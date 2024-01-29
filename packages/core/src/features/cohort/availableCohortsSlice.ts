import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
  createAsyncThunk,
  ThunkAction,
  AnyAction,
  EntityId,
  EntityState,
  Dictionary,
} from "@reduxjs/toolkit";

import { CoreState } from "../../reducers";
import { buildCohortGqlOperator, FilterSet } from "./filters";
import {
  GqlOperation,
  Operation,
  isIncludes,
  Includes,
} from "../gdcapi/filters";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";
import { useCoreSelector } from "../../hooks";
import { SetTypes } from "../sets";
import { defaultCohortNameGenerator } from "./utils";
import { createSetMutationFactory } from "../sets/createSetSlice";
import { setCountQueryFactory } from "../sets/setCountSlice";
import {
  CountsData,
  CountsDataAndStatus,
  fetchCohortCaseCounts,
  NullCountsData,
} from "./cohortCountsQuery";

export const UNSAVED_COHORT_NAME = "Unsaved_Cohort";

export interface CaseSetDataAndStatus {
  readonly status: DataStatus; // status of create caseSet
  readonly error?: string; // any error message
  readonly caseSetIds?: Record<string, string>; // prefix mapped caseSetIds
  readonly filters?: FilterSet; // FilterSet that contains combination of CaseSets + filters
}

export interface CohortStoredSets {
  readonly ids: string[];
  readonly setId: string;
  readonly setType: SetTypes;
  readonly field: string;
}

/**
 * A Cohort is a collection of filters that can be used to query the GDC API.
 * The cohort interface is used to manage the cohort state in the redux-toolkit entity adapter.
 * @see https://redux-toolkit.js.org/api/createEntityAdapter
 *
 * @property id - the id of the cohort
 * @property name - the name of the cohort
 * @property filters - the filters for the cohort
 * @property caseSet - the caseSet for the cohort
 * @property sets - the sets for the cohort
 * @property modified - flag indicating if the cohort has been modified
 * @property modified_datetime - the last time the cohort was modified
 * @property saved - flag indicating if the cohort has been saved
 * @category Cohort
 */

export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: FilterSet; // active filters for cohort
  readonly caseSet: CaseSetDataAndStatus; // case ids for frozen cohorts
  readonly sets?: CohortStoredSets[];
  readonly modified?: boolean; // flag which is set to true if modified and unsaved
  readonly modified_datetime: string; // last time cohort was modified
  readonly saved?: boolean; // flag indicating if cohort has been saved.
  readonly counts: CountsDataAndStatus; //case, file, etc. counts of a cohort
}

/**
 * Parses the set of Filter and returns an object containing query, parameters, and variables
 * used to create a caseSet from the input filters. The prefix (e.g. genes.") of the filters is used to group them.
 * The assumption is that all filters will have a prefix separated by "."
 */
export const buildCaseSetGQLQueryAndVariablesFromFilters = (
  filters: FilterSet,
  id: string,
): Record<string, any> => {
  const prefix = Object.keys(filters.root)
    .map((x) => x.split(".")[0])
    .filter((v, i, a) => a.indexOf(v) == i);
  const sorted = Object.keys(filters.root).reduce(
    (obj, filterName) => {
      const filterPrefix = filterName.split(".")[0];
      return {
        ...obj,
        [filterPrefix]: {
          ...obj[filterPrefix],
          [filterName]: filters.root[filterName],
        },
      };
    },
    prefix.reduce(
      (obj: Record<string, any>, pfx) => ({
        ...obj,
        [pfx]: {},
      }),
      {},
    ),
  );

  return {
    query: prefix
      .map(
        (name) => `${name}Cases : case (input: $input${name}) { set_id size }`,
      )
      .join(","),

    parameters: prefix
      .map((name) => ` $input${name}: CreateSetInput`)
      .join(","),

    variables: Object.entries(sorted).reduce((obj, [key, value]) => {
      return {
        ...obj,
        [`input${key}`]: {
          filters: buildCohortGqlOperator({
            mode: "and",
            root: value as Record<string, Operation>,
          }),
          set_id: `${key}-${id}`,
        },
      };
    }, {}),
  };
};

/*
 A start at handling how to seamlessly create cohorts that can bridge explore
 and repository indexes. The slice creates a case set id using the defined filters
*/
export const buildCaseSetMutationQuery = (
  parameters: string,
  query: string,
): string => `
mutation mutationsCreateRepositoryCaseSetMutation(
  ${parameters}
) {
  sets {
    create {
      explore {
       ${query}
    }
  }
 }
}`;

export interface CreateCaseSetProps {
  readonly caseSetId?: string; // pass a caseSetId to use instead of cohort id
  readonly pendingFilters?: FilterSet;
  readonly modified?: boolean; // to control cohort modification flag
  readonly cohortId?: string; // if set update this cohort instead of the current cohort
}

export const createCaseSet = createAsyncThunk<
  GraphQLApiResponse<Record<string, any>>,
  CreateCaseSetProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohort/createCaseSet",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ caseSetId, pendingFilters = undefined, cohortId }, thunkAPI) => {
    // select a cohort by id if passed in, otherwise use the current cohort
    const cohort = cohortId
      ? cohortSelectors.selectById(thunkAPI.getState(), cohortId)
      : selectCurrentCohort(thunkAPI.getState());
    if (cohort === undefined || pendingFilters === undefined)
      return thunkAPI.rejectWithValue({ error: "No cohort or filters" });

    const dividedFilters = divideFilterSetByPrefix(
      pendingFilters,
      REQUIRES_CASE_SET_FILTERS,
    );

    const graphQL = buildCaseSetMutationQuery(
      "$inputFilters: CreateSetInput",
      "case (input: $inputFilters) { set_id size }",
    );
    return graphqlAPI(graphQL, {
      inputFilters: {
        filters: buildCohortGqlOperator(dividedFilters.withPrefix),
        set_id: `genes-ssms-${caseSetId ?? cohort.id}`, // use case set id if passed in, otherwise use cohort id
      },
    });
  },
);

interface SetIdResponse {
  viewer: {
    [index: string]: {
      [docType: string]: {
        hits: {
          edges: {
            node: {
              [field: string]: string;
            };
          }[];
        };
      };
    };
  };
}

const setIdQueryFactory = async (
  field: string,
  filters: Record<string, any>,
): Promise<string[] | undefined> => {
  let ids;
  let response;

  switch (field) {
    case "genes.gene_id":
      response = await graphqlAPI<SetIdResponse>(
        `query setInfo(
             $filters: FiltersArgument
         ) {
             viewer {
               explore {
                 genes {
                  hits(filters: $filters, first: 50000) {
                    edges {
                      node {
                        gene_id
                      }
                    }
                  }
                }
              }
            }
          }`,
        filters,
      );
      return response.data.viewer.explore.genes.hits.edges.map(
        (node) => node.node.gene_id,
      );

    case "ssms.ssm_id":
      response = await graphqlAPI<SetIdResponse>(
        `query setInfo(
        $filters: FiltersArgument
    ) {
        viewer {
          explore {
            ssms {
             hits(filters: $filters, first: 50000) {
               edges {
                 node {
                   ssm_id
                 }
               }
             }
           }
         }
       }
     }`,
        filters,
      );
      return response.data.viewer.explore.ssms.hits.edges.map(
        (node) => node.node.ssm_id,
      );
    case "cases.case_id":
      response = await graphqlAPI<SetIdResponse>(
        `query setInfo(
        $filters: FiltersArgument
    ) {
        viewer {
          repository {
            cases {
             hits(filters: $filters, first: 50000) {
               edges {
                 node {
                   case_id
                 }
               }
             }
           }
         }
       }
     }`,
        filters,
      );
      return response.data.viewer.repository.cases.hits.edges.map(
        (node) => node.node.case_id,
      );
  }

  return Promise.resolve(ids);
};

/*
  Adds sets to filters. Stores set if it's new or recreates set based on our stored ids if it has disappeared.
*/
const handleFiltersForSet = createAsyncThunk<
  void,
  {
    field: string;
    setIds: string[];
    otherOperands: (string | number)[];
    operation: Operation;
  },
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohort/fetchFiltersForSet",
  async ({ field, setIds, otherOperands, operation }, thunkAPI) => {
    const [docType] = field.split(".");

    const currentCohort = cohortSelectors.selectById(
      thunkAPI.getState(),
      getCurrentCohortFromCoreState(thunkAPI.getState()),
    ) as Cohort;

    const updatedSetIds = [];

    for (const setId of setIds) {
      const filters = {
        op: "=",
        content: {
          field,
          value: `set_id:${setId}`,
        },
      };

      const storedSet = (currentCohort?.sets || []).find(
        (set) => set.setId === setId,
      );
      if (storedSet === undefined) {
        const setResult = await setIdQueryFactory(field, filters);
        if (setResult !== undefined) {
          const newSet = {
            setId: setId,
            setType: docType as SetTypes,
            ids: setResult,
            field,
          };
          thunkAPI.dispatch(addNewCohortSet(newSet));
          updatedSetIds.push(`set_id:${setId}`);
        }
      } else {
        const setCount = await setCountQueryFactory(field, filters);
        if (setCount === 0) {
          const newSetId = await createSetMutationFactory(field, {
            input: {
              filters: {
                op: "in",
                content: {
                  field,
                  value: storedSet.ids,
                },
              },
            },
          });
          if (newSetId) {
            const newSet = {
              setId: newSetId,
              setType: docType as SetTypes,
              ids: storedSet.ids,
              field,
            };
            updatedSetIds.push(`set_id:${newSetId}`);
            thunkAPI.dispatch(removeCohortSet(setId));
            thunkAPI.dispatch(addNewCohortSet(newSet));
          }
        } else {
          updatedSetIds.push(`set_id:${setId}`);
        }
      }
    }

    const updatedFilters = {
      mode: "and",
      root: {
        ...currentCohort.filters.root,
        [field]: {
          operator: operation.operator,
          field,
          operands: [...otherOperands, ...updatedSetIds],
        } as Includes,
      },
    };

    // case is needed if field is gene/ssm
    const requiresCaseSet = willRequireCaseSet(updatedFilters);

    if (requiresCaseSet) {
      thunkAPI.dispatch(
        createCaseSet({
          // NOTE: this will use the current cohort
          caseSetId: currentCohort?.id,
          pendingFilters: updatedFilters,
          modified: true,
        }),
      );
    }
  },
);

export const REQUIRES_CASE_SET_FILTERS = ["genes.", "ssms."];

const cohortsAdapter = createEntityAdapter<Cohort>({
  sortComparer: (a, b) => {
    if (a.modified_datetime <= b.modified_datetime) return 1;
    else return -1;
  },
});

export interface CurrentCohortState {
  readonly currentCohort: string | undefined;
  readonly message: string[] | undefined;
}

const emptyInitialState = cohortsAdapter.getInitialState<CurrentCohortState>({
  currentCohort: undefined,
  message: undefined, // message is used to inform frontend components of changes to the cohort.
});

interface UpdateFilterParams {
  field: string;
  operation: Operation;
}

export const createCohortName = (postfix: string): string => {
  return `Custom Cohort ${postfix}`;
};

export const createCohortId = (): string => nanoid();

const willRequireCaseSet = (
  filters: FilterSet,
  prefixes: string[] = REQUIRES_CASE_SET_FILTERS,
): boolean => {
  return (
    Object.keys(divideFilterSetByPrefix(filters, prefixes).withPrefix.root)
      .length > 0
  );
};

const buildCaseSetFilters = (
  data: Record<string, string>,
): Record<string, Operation> => {
  if (Object.values(data).length == 1) {
    return {
      internalCaseSet: {
        field: "cases.case_id",
        operator: "includes",
        operands: [`set_id:${Object.values(data)[0]}`],
      },
    };
  }
  if (Object.keys(data).length > 1) {
    // build composite of the two case sets
    return {
      internalCaseSet: {
        operator: "and",
        operands: Object.values(data).map((caseSet) => ({
          field: "cases.case_id",
          operator: "includes",
          operands: [`set_id:${caseSet}`],
        })),
      },
    };
  }
  return {};
};

export const processCaseSetResponse = (
  data: Record<string, any>,
): Record<string, string> => {
  return Object.values(data).reduce((newObj, caseSet) => {
    const prefix = caseSet.set_id.split("-")[0];
    return {
      ...newObj,
      [prefix]: caseSet.set_id,
    };
  }, {});
};

const newCohort = ({
  filters = { mode: "and", root: {} },
  modified = true,
  pendingFilters,
  customName,
}: {
  filters?: FilterSet;
  modified?: boolean;
  pendingFilters?: FilterSet;
  customName?: string;
}): Cohort => {
  const ts = new Date();
  const newName = customName ?? defaultCohortNameGenerator();

  const newId = createCohortId();
  return {
    name: newName,
    id: newId,
    caseSet: {
      caseSetIds: undefined,
      status: "uninitialized" as DataStatus,
      filters: pendingFilters,
    },
    filters: filters,
    modified: modified,
    saved: false,
    modified_datetime: ts.toISOString(),
    counts: {
      ...NullCountsData,
    },
  };
};

const getCurrentCohort = (
  state: EntityState<Cohort> & CurrentCohortState,
): EntityId => {
  if (state.currentCohort) {
    return state.currentCohort;
  }

  const unsavedCohort = newCohort({ customName: UNSAVED_COHORT_NAME });
  return unsavedCohort.id;
};

const getCurrentCohortFromCoreState = (state: CoreState): EntityId => {
  if (state.cohort.availableCohorts.currentCohort) {
    return state.cohort.availableCohorts.currentCohort;
  }
  const unsavedCohort = newCohort({ customName: UNSAVED_COHORT_NAME });
  return unsavedCohort.id;
};

const checkForUnsavedCohorts = (
  state: EntityState<Cohort> & CurrentCohortState,
  replace: boolean,
) => {
  const selector = cohortsAdapter.getSelectors();
  const unsavedCohorts = selector
    .selectAll(state)
    .filter((cohort) => !cohort.saved);
  if (unsavedCohorts.length > 0) {
    if (replace) {
      cohortsAdapter.removeMany(
        state,
        unsavedCohorts.map((c) => c.id),
      );
    } else {
      throw "There is a limit of one unsaved cohort at a time for a user. Please create a saved cohort or replace the current unsaved cohort";
    }
  }
};

interface NewUnsavedCohortParams {
  filters: FilterSet; // set the filters for the new cohort
  message: string; // set message to show when cohort is created
  name: string; // set the name for the new cohort
  replace?: boolean; // Replace the current unsaved cohort if there is one
}

interface CopyCohortParams {
  sourceId: string;
  destId: string;
}

/**
 * A Cohort Management Slice which allow cohort to be created and updated.
 * this uses redux-toolkit entity adapter to manage the cohorts
 * Because it is an entity adapter, the state contains an array of id (string)
 * and a Dictionary of Cohort objects. There are two additional members:
 *  - currentCohortId: which is used to identify the "current" or active cohort
 *  - message: used to pass a state change message and parameter. NOTE: message is a
 *  - simple string consisting of message|parameter and can be replaced in the future with
 *  - something else like an object, but this keeps the additional member to EntityAdapter
 *  - more normalized.
 *
 * The slice exports the following actions:
 * - setCohortList() - set saved cohort to the adapter that comes from the server
 * - addNewDefaultUnsavedCohort - create a an instance of the default unsaved cohort
 * - addNewSavedCohort - add a saved cohort
 * - addNewUnsavedCohort - create a new unsaved cohort with the passed filters and message id
 * - copyToSavedCohort - create a copy of the cohort with sourceId to a new cohort with destId
 * - updateCohortName(name:string): changes the current cohort's name
 * - updateCohortFilter(filters: FilterSet): update the filters for this cohort
 * - removeCohortFilter(filter:string): removes the filter from the cohort
 * - clearCohortFilters(): removes all the filters by setting them to the default all GDC state
 * - setCurrentCohortId(id:string): set the id of the current cohort, used to switch between cohorts
 * - clearCaseSet(): resets the caseSet member to all GDC
 * - removeCohort(): removes the current cohort
 * - setCohortMessage(): sets the current cohort message
 * - clearCohortMessage(): clears the current message by setting it to undefined
 * - addNewCohortGroups(): adds groups of filters to the current cohort
 * - removeCohortGroup(): removes a group of filters from the current cohort
 * @category Cohort
 */
const slice = createSlice({
  name: "cohort/availableCohorts",
  initialState: emptyInitialState,
  reducers: {
    /** @hidden */
    setCohortList: (state, action: PayloadAction<Cohort[]>) => {
      // TODO: Behavior TBD - https://jira.opensciencedatacloud.org/browse/PEAR-762
      // When the user deletes context id from their cookies
      // All the cohorts that was previously were saved or unsaved should be removed from the adapter
      if (!action.payload) {
        cohortsAdapter.removeMany(state, state.ids);
      } else {
        cohortsAdapter.upsertMany(state, [...action.payload] as Cohort[]);
      }
    },
    addNewDefaultUnsavedCohort: (state) => {
      const cohort = newCohort({
        customName: UNSAVED_COHORT_NAME,
      });
      checkForUnsavedCohorts(state, false);
      cohortsAdapter.addOne(state, cohort);
      state.currentCohort = cohort.id;
      state.message = [`newCohort|${cohort.name}|${cohort.id}`];
    },
    addNewSavedCohort: (state, action: PayloadAction<Cohort>) => {
      cohortsAdapter.setOne(state, {
        ...action.payload,
        modified: false,
        saved: true,
      });
    },
    addNewUnsavedCohort: (
      state,
      action: PayloadAction<NewUnsavedCohortParams>,
    ) => {
      const cohort = newCohort({
        filters: action.payload.filters,
        customName: action.payload.name,
      });
      checkForUnsavedCohorts(state, action.payload?.replace || false);
      cohortsAdapter.addOne(state, cohort);
      state.currentCohort = cohort.id;
      state.message = [`${action.payload.message}|${cohort.name}|${cohort.id}`];
    },
    copyToSavedCohort: (state, action: PayloadAction<CopyCohortParams>) => {
      const sourceCohort = state.entities[action.payload.sourceId];
      if (sourceCohort) {
        const destCohort = {
          ...sourceCohort,
          id: action.payload.destId,
          modified: false,
          saved: true,
          counts: {
            // will need to re-request counts
            ...NullCountsData,
          },
        };
        cohortsAdapter.addOne(state, destCohort);
      }
    },
    updateCohortName: (state, action: PayloadAction<string>) => {
      cohortsAdapter.updateOne(state, {
        id: getCurrentCohort(state),
        changes: { name: action.payload },
      });
    },
    removeCohort: (
      state,
      action?: PayloadAction<{
        shouldShowMessage?: boolean;
        id?: string;
      }>,
    ) => {
      const removedCohort =
        state.entities[action?.payload?.id || getCurrentCohort(state)];
      cohortsAdapter.removeOne(
        state,
        action?.payload?.id || getCurrentCohort(state),
      );
      // TODO: this will be removed after cohort id issue is fixed in the BE
      // This is just a hack to remove cohort without triggering notification
      if (action?.payload.shouldShowMessage) {
        state.message = [
          `deleteCohort|${removedCohort?.name}|${state.currentCohort}`,
        ];
      }

      // If we've removed the last cohort a user has, auto generate a default one for them
      const selector = cohortsAdapter.getSelectors();
      if (selector.selectAll(state).length === 0) {
        cohortsAdapter.addOne(
          state,
          newCohort({ customName: UNSAVED_COHORT_NAME }),
        );
        const selector = cohortsAdapter.getSelectors();
        const createdCohort = selector.selectAll(state)[0];
        state.currentCohort = createdCohort.id;
        state.message = [
          `deleteCohort|${removedCohort?.name}|${state.currentCohort}`,
          `newCohort|${createdCohort.name}|${createdCohort.id}`,
        ];
      } else if (action?.payload.id === undefined) {
        state.currentCohort = selector.selectAll(state)[0].id;
      }
    },
    updateCohortFilter: (state, action: PayloadAction<UpdateFilterParams>) => {
      const filters = {
        mode: "and",
        root: {
          ...state.entities[getCurrentCohort(state)]?.filters.root,
          [action.payload.field]: action.payload.operation,
        },
      };

      const caseSetIds =
        state.entities[getCurrentCohort(state)]?.caseSet?.caseSetIds;
      if (caseSetIds) {
        // using a caseSet
        const dividedFilters = divideFilterSetByPrefix(
          filters,
          REQUIRES_CASE_SET_FILTERS,
        );

        const caseSetIntersection = buildCaseSetFilters(caseSetIds);
        const caseSetFilters: FilterSet = {
          mode: "and",
          root: {
            ...caseSetIntersection,
            ...dividedFilters.withoutPrefix.root,
          },
        };

        cohortsAdapter.updateOne(state, {
          id: getCurrentCohort(state),
          changes: {
            filters: filters,
            modified: true,
            modified_datetime: new Date().toISOString(),
            caseSet: {
              filters: caseSetFilters,
              caseSetIds: caseSetIds,
              status: "fulfilled",
            },
          },
        });
      } else
        cohortsAdapter.updateOne(state, {
          id: getCurrentCohort(state),
          changes: {
            filters: filters,
            modified: true,
            modified_datetime: new Date().toISOString(),
          },
        });
    },
    removeCohortFilter: (state, action: PayloadAction<string>) => {
      // todo clear case set if not needed
      const root = state.entities[getCurrentCohort(state)]?.filters.root;
      if (!root) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _a, ...updated } = root;

      const filterPrefix = action.payload.split(".");
      const cohortCaseSetIds =
        state.entities[getCurrentCohort(state)]?.caseSet?.caseSetIds;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [filterPrefix[0]]: _b, ...updatedCaseIds } =
        cohortCaseSetIds ?? {};

      const sets = (state.entities[getCurrentCohort(state)]?.sets || []).filter(
        (set) => set.field !== action.payload,
      );

      if (Object.keys(updatedCaseIds).length) {
        // still require a case set
        // update caseSet

        const caseSetIntersection = buildCaseSetFilters(updatedCaseIds);
        const additionalFilters = divideFilterSetByPrefix(
          {
            mode: "and",
            root: updated,
          },
          REQUIRES_CASE_SET_FILTERS,
        ).withoutPrefix.root;

        const caseSetFilters: FilterSet = {
          mode: "and",
          root: {
            ...caseSetIntersection,
            ...additionalFilters,
          },
        };
        cohortsAdapter.updateOne(state, {
          id: getCurrentCohort(state),
          changes: {
            filters: { mode: "and", root: updated },
            modified: true,
            modified_datetime: new Date().toISOString(),
            caseSet: {
              filters: caseSetFilters,
              caseSetIds: updatedCaseIds,
              status: "uninitialized",
            },
            sets,
          },
        });
      } else
        cohortsAdapter.updateOne(state, {
          id: getCurrentCohort(state),
          changes: {
            filters: { mode: "and", root: updated },
            modified: true,
            modified_datetime: new Date().toISOString(),
            caseSet: {
              filters: undefined,
              caseSetIds: undefined,
              status: "uninitialized",
            },
            sets,
          },
        });
    },
    clearCohortFilters: (state) => {
      cohortsAdapter.updateOne(state, {
        id: getCurrentCohort(state),
        changes: {
          filters: { mode: "and", root: {} },
          modified: true,
          modified_datetime: new Date().toISOString(),
          caseSet: {
            filters: undefined,
            caseSetIds: undefined,
            status: "uninitialized",
          },
          sets: undefined,
        },
      });
    },

    /**
     * Sets the login state of the cohorts filters to the passed in value
     */
    setCohortLoginStatus: (state, action: PayloadAction<boolean>) => {
      const filters = state.entities[getCurrentCohort(state)]?.filters ?? {
        mode: "and",
        root: {},
      };
      const modified = state.entities[getCurrentCohort(state)]?.modified;
      const modified_datetime =
        state.entities[getCurrentCohort(state)]?.modified_datetime;
      const caseSet = state.entities[getCurrentCohort(state)]?.caseSet;
      cohortsAdapter.updateOne(state, {
        id: getCurrentCohort(state),
        changes: {
          filters: { ...filters, loggedIn: action.payload },
          modified: modified,
          modified_datetime: modified_datetime,
          caseSet: caseSet,
        },
      });
    },

    discardCohortChanges: (
      state,
      action: PayloadAction<{
        filters: FilterSet | undefined;
        showMessage: boolean;
        id?: string;
      }>,
    ) => {
      cohortsAdapter.updateOne(state, {
        id: action.payload.id ?? getCurrentCohort(state),
        changes: {
          filters: action.payload.filters || { mode: "and", root: {} },
          modified: false,
          modified_datetime: new Date().toISOString(),
        },
      });
      if (action.payload.showMessage) {
        state.message = [
          `discardChanges|${state.entities[getCurrentCohort(state)]?.name}|${
            state.currentCohort
          }`,
        ];
      }
    },
    setCurrentCohortId: (state, action: PayloadAction<string>) => {
      state.currentCohort = action.payload;
    },
    clearCohortMessage: (state) => {
      state.message = undefined;
    },
    setCohortMessage: (state, action: PayloadAction<string[]>) => {
      state.message = action.payload;
    },
    clearCaseSet: (state) => {
      cohortsAdapter.updateOne(state, {
        id: getCurrentCohort(state),
        changes: {
          caseSet: {
            status: "uninitialized",
            caseSetIds: undefined,
            filters: undefined,
          },
        },
      });
    },
    addNewCohortSet: (state, action: PayloadAction<CohortStoredSets>) => {
      const currentCohort = getCurrentCohort(state);
      const sets = state.entities[currentCohort]?.sets;
      cohortsAdapter.updateOne(state, {
        id: currentCohort,
        changes: {
          sets: [...(sets !== undefined ? sets : []), action.payload],
        },
      });
    },
    removeCohortSet: (state, action: PayloadAction<string>) => {
      const currentCohort = getCurrentCohort(state);
      const sets = state.entities[currentCohort]?.sets;

      cohortsAdapter.updateOne(state, {
        id: currentCohort,
        changes: {
          sets: [
            ...(sets !== undefined ? sets : []).filter(
              (set) => set.setId !== action.payload,
            ),
          ],
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCaseSet.fulfilled, (state, action) => {
        const currentCohort = getCurrentCohort(state);
        const response = action.payload;
        const pendingFilters = action.meta.arg.pendingFilters;
        // use the cohortId from the action if it exists, otherwise use the current cohort
        const cohortToUpdate = action.meta.arg.cohortId ?? currentCohort;
        const cohort = state.entities[cohortToUpdate] as Cohort;
        if (pendingFilters === undefined) {
          console.error(
            "trying to create a case set with no pending filters",
            cohort.id,
            action.meta,
          );
        }
        if (response.errors && Object.keys(response.errors).length > 0) {
          // reject the current cohort by setting status to rejected
          cohortsAdapter.updateOne(state, {
            id: cohortToUpdate,
            changes: {
              filters: pendingFilters,
              caseSet: {
                caseSetIds: undefined,
                filters: undefined,
                status: "rejected",
                error: response.errors.sets,
              },
            },
          });
        }
        const data = response.data.sets.create.explore;
        const filters = pendingFilters;
        const additionalFilters =
          filters === undefined
            ? {}
            : divideFilterSetByPrefix(filters, REQUIRES_CASE_SET_FILTERS)
                .withoutPrefix.root;

        const caseSetIds = processCaseSetResponse(data);
        const caseSetIntersection = buildCaseSetFilters(caseSetIds);
        const caseSetFilters: FilterSet = {
          mode: "and",
          root: {
            ...caseSetIntersection,
            ...additionalFilters,
          },
        };

        cohortsAdapter.updateOne(state, {
          id: cohortToUpdate,
          changes: {
            filters: pendingFilters,
            modified: action.meta.arg.modified,
            modified_datetime: new Date().toISOString(),
            caseSet: {
              filters: caseSetFilters,
              status: "fulfilled",
              caseSetIds: caseSetIds,
            },
          },
        });
      })
      .addCase(createCaseSet.pending, (state, action) => {
        cohortsAdapter.updateOne(state, {
          id: action.meta.arg.cohortId ?? getCurrentCohort(state),
          changes: {
            caseSet: {
              filters: undefined,
              caseSetIds: undefined,
              status: "pending",
            },
          },
        });
      })
      .addCase(createCaseSet.rejected, (state, action) => {
        cohortsAdapter.updateOne(state, {
          id: action.meta.arg.cohortId ?? getCurrentCohort(state),
          changes: {
            caseSet: {
              caseSetIds: undefined,
              filters: undefined,
              status: "rejected",
            },
          },
        });
      })
      .addCase(fetchCohortCaseCounts.fulfilled, (state, action) => {
        if (
          action.meta.requestId !==
          state.entities[action.meta.arg]?.counts.requestId
        ) {
          // ignore if the request id is not the same as the current cohort
          return;
        }

        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0) {
          cohortsAdapter.updateOne(state, {
            id: action.meta.arg,
            changes: {
              counts: { ...NullCountsData, status: "rejected" },
            },
          });
          return;
        }

        // copy the counts for explore and repository
        cohortsAdapter.updateOne(state, {
          id: action.meta.arg,
          changes: {
            counts: {
              caseCount: response.data.viewer.explore.cases.hits.total,
              genesCount: response.data.viewer.explore.genes.hits.total,
              mutationCount: response.data.viewer.explore.ssms.hits.total,
              fileCount: response.data.viewer.repository.files.hits.total,
              ssmCaseCount: response.data.viewer.explore.ssmsCases.hits.total,
              cnvOrSsmCaseCount:
                response.data.viewer.explore.cnvsOrSsmsCases.hits.total,
              sequenceReadCaseCount:
                response.data.viewer.repository.sequenceReads.hits.total,
              repositoryCaseCount:
                response.data.viewer.repository.cases.hits.total,
              geneExpressionCaseCount:
                response.data.viewer.repository.geneExpression.hits.total,
              status: "fulfilled",
            },
          },
        });
      })
      .addCase(fetchCohortCaseCounts.pending, (state, action) => {
        cohortsAdapter.updateOne(state, {
          id: action.meta.arg,
          changes: {
            counts: {
              caseCount: -1,
              fileCount: -1,
              genesCount: -1,
              mutationCount: -1,
              ssmCaseCount: -1,
              cnvOrSsmCaseCount: -1,
              sequenceReadCaseCount: -1,
              repositoryCaseCount: -1,
              geneExpressionCaseCount: -1,
              status: "pending",
              requestId: action.meta.requestId,
            },
          },
        });
      })
      .addCase(fetchCohortCaseCounts.rejected, (state, action) => {
        if (
          action.meta.requestId !==
          state.entities[action.meta.arg]?.counts.requestId
        ) {
          return;
        }
        cohortsAdapter.updateOne(state, {
          id: action.meta.arg,
          changes: {
            counts: {
              caseCount: -1,
              fileCount: -1,
              genesCount: -1,
              mutationCount: -1,
              ssmCaseCount: -1,
              cnvOrSsmCaseCount: -1,
              sequenceReadCaseCount: -1,
              repositoryCaseCount: -1,
              geneExpressionCaseCount: -1,
              status: "rejected",
            },
          },
        });
      });
  },
});

export const availableCohortsReducer = slice.reducer;

export const {
  addNewDefaultUnsavedCohort,
  addNewUnsavedCohort,
  removeCohort,
  updateCohortName,
  addNewSavedCohort,
  setCurrentCohortId,
  updateCohortFilter,
  removeCohortFilter,
  clearCohortFilters,
  setCohortLoginStatus,
  clearCaseSet,
  clearCohortMessage,
  setCohortList,
  copyToSavedCohort,
  discardCohortChanges,
  setCohortMessage,
  addNewCohortSet,
  removeCohortSet,
} = slice.actions;

/**
 * --------------------------------------------------------------------------
 *  Cohort Selectors
 *  -------------------------------------------------------------------------
 **/

/**
 * Returns the selectors for the cohorts EntityAdapter
 * @param state - the CoreState
 *
 * @hidden
 */
export const cohortSelectors = cohortsAdapter.getSelectors(
  (state: CoreState) => state.cohort.availableCohorts,
);

/**
 * Returns all the cohorts in the state
 * @param state - the CoreState
 *
 * @category Cohort
 * @category Selectors
 */

export const selectAvailableCohorts = (state: CoreState): Cohort[] =>
  cohortSelectors.selectAll(state);

/**
 * Returns the current cohort id
 * @param state - the CoreState
 *
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortId = (state: CoreState): string | undefined =>
  state.cohort?.availableCohorts?.currentCohort;

/**
 * Returns the current cohort message
 * @param state - the CoreState
 * @hidden
 */
export const selectCohortMessage = (state: CoreState): string[] | undefined =>
  state.cohort.availableCohorts.message;

/**
 * Returns if the current cohort is modified
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 * @hidden
 */
export const selectCurrentCohortModified = (
  state: CoreState,
): boolean | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  return cohort?.modified;
};

/**
 * Returns if the current cohort has been saved
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 * @hidden
 */
export const selectCurrentCohortSaved = (
  state: CoreState,
): boolean | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  return cohort?.saved;
};

/**
 * Returns the current cohort or undefined if cohort is not found
 * @param state - the CoreState
 * @returns the current cohort or undefined
 *
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohort = (state: CoreState): Cohort | undefined =>
  cohortSelectors.selectById(state, getCurrentCohortFromCoreState(state));

/**
 *  Returns the current cohort name
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortName = (
  state: CoreState,
): string | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  return cohort?.name;
};

/**
 * Finds a cohort by name and returns it or undefined if not found
 * @param state - the CoreState
 * @param name - the name of the cohort
 * @category Cohort
 * @category Selectors
 */

export const selectAvailableCohortByName = (
  state: CoreState,
  name: string,
): Cohort | undefined =>
  cohortSelectors
    .selectAll(state)
    .find((cohort: Cohort) => cohort.name === name);

/**
 * Returns the current cohort filters as a {@link FilterSet}
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortFilterSet = (
  state: CoreState,
): FilterSet | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  return cohort?.filters;
};

/**
 * Returns the cohort's name given the id
 * @param state - the CoreState
 * @param cohortId - the cohort id
 * @category Cohort
 * @category Selectors
 */
export const selectCohortNameById = (
  state: CoreState,
  cohortId: string,
): string | undefined => {
  const cohort = cohortSelectors.selectById(state, cohortId);
  return cohort?.name;
};

/**
 * Returns the cohort's filters given an id
 * @param state - the CoreState
 * cohortId - the cohort id
 * @category Cohort
 * @category Selectors
 *
 */
export const selectCohortFilterSetById = (
  state: CoreState,
  cohortId: string,
): FilterSet | undefined => {
  const cohort = cohortSelectors.selectById(state, cohortId);
  return cohort?.filters;
};

/**
 * Returns the currentCohortFilters as a GqlOperation
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  return buildCohortGqlOperator(cohort?.filters);
};

/**
 * Returns either a filterSet or a filter containing a caseSetId that was created
 * for the current cohort. If the cohort is undefined an empty FilterSet is returned.
 * Used to create a cohort that works with both explore and repository indexes
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 * @hidden
 */
export const selectCurrentCohortGeneAndSSMCaseSet = (
  state: CoreState,
): FilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  if (cohort === undefined) return { mode: "and", root: {} };

  return cohort?.caseSet.filters ?? cohort.filters;
};

/**
 * Public selector of the current Cohort Filters.
 * Returns the current cohort filters as a FilterSet
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortFilters = (state: CoreState): FilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  if (cohort === undefined) return { mode: "and", root: {} };
  return cohort.filters;
};

/**
 * Select a filter by its name from the current cohort. If the filter is not found
 * returns undefined.
 * @param state - the CoreState
 * @param name - the name of the filter
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortFiltersByName = (
  state: CoreState,
  name: string,
): Operation | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  return cohort?.filters?.root[name];
};

/**
 * Returns the current cohort case count
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortCaseCount = (
  state: CoreState,
): number | undefined =>
  cohortSelectors.selectById(state, getCurrentCohortFromCoreState(state))
    ?.counts.caseCount;

export const selectCurrentCohortFiltersByNames = (
  state: CoreState,
  names: ReadonlyArray<string>,
): Record<string, Operation> => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );

  // TODO replace with memoized selector
  return names.reduce((obj, name) => {
    if (cohort?.filters?.root[name]) obj[name] = cohort?.filters?.root[name];
    return obj;
  }, {} as Record<string, Operation>);
};

/**
 * Returns the current caseSetId filter representing the cohort
 * if the cohort is undefined it returns an empty caseSetIdFilter
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 */
export const selectCurrentCohortCaseSet = (
  state: CoreState,
): CoreDataSelectorResponse<FilterSet> => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  // TODO replace with memoized selector
  if (cohort === undefined || cohort?.caseSet === undefined)
    return {
      data: { mode: "and", root: {} },
      status: "uninitialized",
    };
  return { ...cohort.caseSet };
};

/**
 * Given a cohortId returns the Cohort if found, otherwise returns undefined
 * @param state - the CoreState
 * @param cohortId - the cohort id to return
 * @category Cohort
 * @category Selectors
 */
export const selectCohortById = (
  state: CoreState,
  cohortId: string,
): Cohort | undefined => cohortSelectors.selectById(state, cohortId);

/**
 * Returns a array of all the cohorts
 * @param state - the CoreState
 * @category Cohort
 * @category Selectors
 */
export const selectAllCohorts = (state: CoreState): Dictionary<Cohort> =>
  cohortSelectors.selectEntities(state);

export const selectCohortCountsResults = (
  state: CoreState,
  cohortId: EntityId = getCurrentCohortFromCoreState(state),
): CoreDataSelectorResponse<CountsData> => {
  return {
    data: cohortSelectors.selectById(state, cohortId)?.counts ?? NullCountsData,
    status:
      cohortSelectors.selectById(state, cohortId)?.counts?.status ??
      NullCountsData.status,
  };
};

export const selectCohortCounts = (
  state: CoreState,
  cohortId: EntityId = getCurrentCohortFromCoreState(state),
): CoreDataSelectorResponse<CountsDataAndStatus> =>
  cohortSelectors.selectById(state, cohortId)?.counts ?? NullCountsData;

export const selectCohortCountsByName = (
  state: CoreState,
  name: keyof CountsData,
  cohortId: EntityId = getCurrentCohortFromCoreState(state),
): number =>
  cohortSelectors.selectById(state, cohortId)?.counts[name] ??
  NullCountsData[name];

export const selectHasUnsavedCohorts = (state: CoreState): boolean =>
  cohortSelectors.selectAll(state).filter((c) => !c.saved).length >= 1;

export const selectUnsavedCohortName = (state: CoreState): string | undefined =>
  cohortSelectors.selectAll(state).find((c) => !c.saved)?.name;

/**
 * --------------------------------------------------------------------------
 *  Cohort Hooks
 *  -------------------------------------------------------------------------
 **/

/**
 * A hook to get the current cohort filter as a FilterSet
 * @category Cohort
 * @category Hooks
 */
export const useCurrentCohortFilters = (): FilterSet | undefined => {
  return useCoreSelector((state: CoreState) =>
    selectCurrentCohortFilterSet(state),
  );
};

/**
 * A hook to get gene/ssm case set for the current cohort
 * This function is being deprecated and will be removed in the future
 * @category Cohort
 * @category Hooks
 * @hidden
 * @deprecated - after refactoring to support dynamic cohorts, this function will be removed
 */
export const useCurrentCohortWithGeneAndSsmCaseSet = ():
  | FilterSet
  | undefined => {
  return useCoreSelector((state: CoreState) =>
    selectCurrentCohortGeneAndSSMCaseSet(state),
  );
};

/**
 * A hook to get the counts of cases and files for the current cohort
 * @category Cohort
 * @category Hooks
 */
export const useCurrentCohortCounts =
  (): CoreDataSelectorResponse<CountsData> => {
    return useCoreSelector((state: CoreState) =>
      selectCohortCountsResults(state),
    );
  };

/**
 * --------------------------------------------------------------------------
 *  Helper Functions
 *  -------------------------------------------------------------------------
 **/

/**
 * A thunk to create a case set when adding filter that require them
 * This primary used to handle gene and ssms applications
 * and is also called from the query expression to handle removing
 * genes and ssms from the expression
 * @param field - the field that requires a case set
 * @param operation - the new filter operation
 * @category Cohort
 * @category Thunks
 * @hidden
 */
export const updateActiveCohortFilter =
  ({
    field,
    operation,
  }: UpdateFilterParams): ThunkAction<void, CoreState, undefined, AnyAction> =>
  async (dispatch: CoreDispatch, getState) => {
    const includesSet =
      isIncludes(operation) &&
      operation.operands.some(
        (operand) => typeof operand === "string" && operand.includes("set_id:"),
      );

    // check if we need a case set
    // case is needed if field is gene/ssm
    const requiresCaseSet = willRequireCaseSet({
      mode: "and",
      root: { [field]: operation },
    });

    if (includesSet) {
      const setIds = operation.operands
        .filter(
          (operand) =>
            typeof operand === "string" && operand.includes("set_id:"),
        )
        .map((operand) => (operand as string).split("set_id:")[1]);
      const otherOperands = operation.operands.filter(
        (operand) => !operand.toString().includes("set_id:"),
      );

      dispatch(
        handleFiltersForSet({
          field,
          setIds,
          otherOperands,
          operation,
        }),
      );
    }

    if (requiresCaseSet) {
      // need a caseset or the caseset needs updating
      const cohortId = selectCurrentCohortId(getState());
      if (cohortId) {
        const currentFilters = selectCurrentCohortFilterSet(getState());
        const updatedFilters = {
          mode: "and",
          root: {
            ...currentFilters?.root,
            [field]: operation,
          },
        };
        dispatch(
          createCaseSet({
            pendingFilters: updatedFilters,
            modified: true,
            cohortId: cohortId,
          }),
        );
      }
    } else {
      dispatch(updateCohortFilter({ field, operation }));
    }
  };

/**
 * a thunk to optionally create a caseSet when switching cohorts.
 * Note the assumption if the caseset member has ids then the caseset has previously been created.
 */
export const setActiveCohort =
  (cohortId: string): ThunkAction<void, CoreState, undefined, AnyAction> =>
  async (dispatch: CoreDispatch, getState) => {
    const cohort = getState().cohort.availableCohorts.entities[cohortId];
    if (cohort) {
      if (
        willRequireCaseSet(cohort.filters) &&
        cohort.caseSet.caseSetIds === undefined
      ) {
        // switched to a cohort without a case set
        await dispatch(
          createCaseSet({
            pendingFilters: cohort.filters,
            modified: cohort.modified,
            cohortId: cohortId,
          }),
        );
      }
    }
    dispatch(setCurrentCohortId(cohortId));
  };

export const discardActiveCohortChanges =
  (filters: FilterSet): ThunkAction<void, CoreState, undefined, AnyAction> =>
  async (dispatch: CoreDispatch, getState) => {
    const cohortId = selectCurrentCohortId(getState());
    if (cohortId && willRequireCaseSet(filters)) {
      createCaseSet({
        pendingFilters: filters,
        modified: false,
        cohortId: cohortId,
      });
    } else dispatch(discardCohortChanges({ filters, showMessage: true }));
  };

export const setActiveCohortList =
  (cohorts: Cohort[]): ThunkAction<void, CoreState, undefined, AnyAction> =>
  async (dispatch: CoreDispatch, getState) => {
    // set the list of all cohorts
    dispatch(setCohortList(cohorts));

    const availableCohorts = selectAllCohorts(getState());
    if (Object.keys(availableCohorts).length === 0) {
      dispatch(addNewDefaultUnsavedCohort());
    }

    const cohortId = selectCurrentCohortId(getState());
    const cohort = selectCurrentCohort(getState());
    // have to request counts for all cohorts loaded from the backend
    cohorts.forEach((cohort) => {
      dispatch(fetchCohortCaseCounts(cohort.id));
    });

    if (!cohort) return;
    if (
      cohortId &&
      willRequireCaseSet(cohort.filters) &&
      cohort.caseSet.status === "uninitialized"
    ) {
      dispatch(
        createCaseSet({
          pendingFilters: cohort.filters,
          modified: false,
          cohortId: cohortId,
        }),
      );
    }
  };

export const createCaseSetsIfNeeded =
  (cohort: Cohort): ThunkAction<void, CoreState, undefined, AnyAction> =>
  async (dispatch: CoreDispatch) => {
    if (!cohort) return;
    if (willRequireCaseSet(cohort.filters)) {
      dispatch(
        createCaseSet({
          pendingFilters: cohort.filters,
          modified: true,
          cohortId: cohort.id,
        }),
      );
    }
  };

export const getCohortFilterForAPI = (cohort: Cohort): FilterSet => {
  return cohort?.caseSet.filters ?? cohort.filters;
};

export const divideFilterSetByPrefix = (
  filters: FilterSet,
  prefixes: string[],
): SplitFilterSet => {
  const results = Object.entries(filters.root).reduce(
    (
      newObj: {
        withPrefix: Record<string, Operation>;
        withoutPrefix: Record<string, Operation>;
      },
      [key, val],
    ) => {
      if (prefixes.some((prefix) => key.startsWith(prefix)))
        newObj.withPrefix[key] = val;
      else newObj.withoutPrefix[key] = val;
      return newObj;
    },
    { withPrefix: {}, withoutPrefix: {} },
  );

  return {
    withPrefix: { mode: "and", root: results.withPrefix },
    withoutPrefix: { mode: "and", root: results.withoutPrefix },
  };
};

interface SplitFilterSet {
  withPrefix: FilterSet;
  withoutPrefix: FilterSet;
}

/**
 * Divides the current cohort into prefix and not prefix. This is
 * used to create caseSets for files and cases
 * @param prefixes - and array of filter prefix to separate on (typically ["genes."])
 */
export const divideCurrentCohortFilterSetFilterByPrefix = (
  state: CoreState,
  prefixes: string[],
): SplitFilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    getCurrentCohortFromCoreState(state),
  );
  if (cohort === undefined)
    return {
      withPrefix: { mode: "and", root: {} },
      withoutPrefix: { mode: "and", root: {} },
    };

  return divideFilterSetByPrefix(cohort?.filters, prefixes);
};
