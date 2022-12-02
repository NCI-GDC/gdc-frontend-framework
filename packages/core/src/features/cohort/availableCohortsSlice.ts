import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import {
  buildCohortGqlOperator,
  FilterSet,
  isFilterSetRootEmpty,
} from "./filters";
import { COHORTS } from "./cohortFixture";
import { GqlOperation, Operation } from "../gdcapi/filters";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "src/store";

export interface CaseSetDataAndStatus {
  readonly status: DataStatus; // status of create caseSet
  readonly error?: string; // any error message
  readonly caseSetId: FilterSet; // A filter set containing the caseID and additional Filters
  readonly pendingFilters?: FilterSet; // Filters that require creation of a internal/hidden case set
  // TODO this could also hold the cohort
  //  id for query by cohort
}

export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: FilterSet; // active filters for cohort
  readonly caseSet: CaseSetDataAndStatus; // case ids for frozen cohorts
  readonly modified?: boolean; // flag which is set to true if modified and unsaved
  readonly modified_datetime: string; // last time cohort was modified
  readonly saved?: boolean; // flag indicating if cohort has been saved.
}

/*
 A start at handling how to seamlessly create cohorts that can bridge explore
 and repository indexes. The slice creates a case set id using the defined filters
*/
const buildCaseSetMutationQuery = () =>
  `
 mutation mutationsCreateRepositoryCaseSetMutation(
  $input: CreateSetInput
) {
  sets {
    create {
      explore {
        case(input: $input) {
          set_id
          size
        }
      }
    }
  }
}`;

export interface CreateCaseSetProps {
  readonly caseSetId?: string; // pass a caseSetId to use
}

export const createCaseSet = createAsyncThunk<
  GraphQLApiResponse<Record<string, any>>,
  CreateCaseSetProps,
  { dispatch: CoreDispatch; state: CoreState }
>("cohort/createCaseSet", async ({ caseSetId = undefined }, thunkAPI) => {
  const cohort = cohortSelectors.selectById(
    thunkAPI.getState(),
    thunkAPI.getState().cohort.availableCohorts.currentCohort,
  );
  const filters = cohort?.caseSet?.pendingFilters
    ? cohort.caseSet.pendingFilters
    : { mode: "and", root: {} };
  const dividedFilters = divideFilterSetByPrefix(
    filters,
    REQUIRES_CASE_SET_FILTERS,
  );
  const graphQL = buildCaseSetMutationQuery();

  const filtersGQL = {
    input: {
      filters: dividedFilters?.withPrefix
        ? buildCohortGqlOperator(dividedFilters.withPrefix)
        : {},
      set_id: `${caseSetId}`,
    },
  };
  return graphqlAPI(graphQL, filtersGQL);
});

export const DEFAULT_COHORT_ID = "ALL-GDC-COHORT";
const REQUIRES_CASE_SET_FILTERS = ["genes.", "ssms."];

const cohortsAdapter = createEntityAdapter<Cohort>({
  sortComparer: (a, b) => {
    // Sort the Cohorts by modification date, The "All GDC" cohort is always first
    if (a.modified_datetime <= b.modified_datetime) return 1;
    else return -1;
  },
});

const emptyInitialState = cohortsAdapter.getInitialState({
  currentCohort: "ALL-GDC-COHORT",
  message: undefined as string | undefined, // message is used to inform frontend components of changes to the cohort.
});

const initialState = cohortsAdapter.upsertMany(
  emptyInitialState,
  COHORTS as Cohort[],
);

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

const newCohort = (
  filters: FilterSet = { mode: "and", root: {} },
  modified = false,
  pendingFilters?: FilterSet,
): Cohort => {
  const ts = new Date();
  const newName = createCohortName(
    ts
      .toLocaleString("en-CA", { timeZone: "America/Chicago", hour12: false })
      .replace(",", ""),
  );
  const newId = createCohortId();
  return {
    name: newName,
    id: newId,
    caseSet: {
      caseSetId: { mode: "and", root: {} },
      status: "uninitialized" as DataStatus,
      pendingFilters: pendingFilters,
    },
    filters: filters,
    modified: modified,
    saved: false,
    modified_datetime: ts.toISOString(),
  };
};

interface NewCohortParams {
  filters?: FilterSet;
  message?: string;
}

/**
 * A Cohort Management Slice which allow cohort to be created and updated.
 * this uses redux-toolkit entity adapter to manage the cohorts
 * Because it is an entity adapter, the state contains an array of id (string)
 * and a Dictionary of Cohort objects. There are two additional members:
 *  currentCohortId: which is used to identify the "current" or active cohort
 *  message: used to pass a state change message and parameter. NOTE: message is a
 *  simple string consisting of message|parameter and can be replaced in the future with
 *  something else like an object, but this keeps the additional member to EntityAdapter
 *  more normalized.
 *
 *
 * The slice exports the following actions:
 * setCohortList() - set saved cohort to the adapter that comes from the server
 * addNewCohort() - create a new cohort
 * addNewCohortWithFilterAndMessage - create a cohort with the passed filters and message id
 * updateCohortName(name:string): changes the current cohort's name
 * updateCohortFilter(filters: FilterSet): update the filters for this cohort
 * removeCohortFilter(filter:string): removes the filter from the cohort
 * clearCohortFilters(): removes all the filters by setting them to the default all GDC state
 * setCurrentCohortId(id:string): set the id of the current cohort, used to switch between cohorts
 * clearCaseSet(): resets the caseSet member to all GDC
 * removeCohort(): removes the current cohort
 * setCohortMessage(): sets the current cohort message
 * clearCohortMessage(): clears the current message by setting it to undefined
 */
const slice = createSlice({
  name: "cohort/availableCohorts",
  initialState: initialState,
  reducers: {
    setCohortList: (state, action: PayloadAction<Cohort[]>) => {
      // TODO: Behavior TBD - https://jira.opensciencedatacloud.org/browse/PEAR-762
      // When the user deletes context id from their cookies
      // All the cohorts that was previously were saved or unsaved should be removed from the adapter
      if (!action.payload) {
        cohortsAdapter.removeMany(
          state,
          state.ids.filter((id) => state.entities[id]?.id !== "ALL-GDC-COHORT"),
        );
        state.currentCohort = "ALL-GDC-COHORT";
      } else {
        cohortsAdapter.upsertMany(state, [...action.payload] as Cohort[]);
      }
    },
    addNewCohort: (state) => {
      const cohort = newCohort();
      cohortsAdapter.addOne(state, cohort);
      state.currentCohort = cohort.id;
      state.message = `newCohort|${cohort.name}|${cohort.id}`;
    },
    addNewCohortWithFilterAndMessage: (
      state,
      action: PayloadAction<NewCohortParams>,
    ) => {
      const cohort = newCohort(action.payload.filters);
      cohortsAdapter.addOne(state, cohort); // Note: does not set the current cohort
      state.message = `${action.payload.message}|${cohort.name}|${cohort.id}`;
    },
    updateCohortName: (state, action: PayloadAction<string>) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: { name: action.payload },
      });
    },
    removeCohort: (
      state,
      action?: PayloadAction<{
        shouldShowMessage?: boolean;
        currentID?: string;
      }>,
    ) => {
      if (state.currentCohort === DEFAULT_COHORT_ID) return; // Do NOT remove the "All GDC"

      const removedCohort =
        state.entities[action?.payload?.currentID || state.currentCohort];
      cohortsAdapter.removeOne(
        state,
        action?.payload?.currentID || state.currentCohort,
      );

      // TODO: this will be removed after cohort id issue is fixed in the BE
      // This is just a hack to remove cohort without trigerring notification and changing the cohort to the default
      if (action?.payload?.shouldShowMessage) {
        state.message = `deleteCohort|${removedCohort?.name}|${state.currentCohort}`;
        state.currentCohort = DEFAULT_COHORT_ID;
      }
    },
    updateCohortFilter: (state, action: PayloadAction<UpdateFilterParams>) => {
      const filters = {
        mode: "and",
        root: {
          ...state.entities[state.currentCohort]?.filters.root,
          [action.payload.field]: action.payload.operation,
        },
      };

      const requiresCaseSet = willRequireCaseSet(filters);

      if (state.currentCohort === DEFAULT_COHORT_ID) {
        // create a new cohort and add it
        // as the GDC All Cohort is immutable
        const cohort = requiresCaseSet
          ? newCohort({ mode: "and", root: {} }, true, filters)
          : newCohort(filters, true);
        cohortsAdapter.addOne(state, cohort);
        state.currentCohort = cohort.id;
        state.message = `newCohort|${cohort.name}|${cohort.id}`;
      } else {
        if (requiresCaseSet) {
          const cohortCaseSetFilters =
            state.entities[state.currentCohort]?.caseSet?.caseSetId;
          // don't update the filter as they will be updated when the caseSet is created
          cohortsAdapter.updateOne(state, {
            id: state.currentCohort,
            changes: {
              modified: true,
              modified_datetime: new Date().toISOString(),
              caseSet: {
                pendingFilters: filters,
                caseSetId:
                  cohortCaseSetFilters === undefined
                    ? { mode: "and", root: {} }
                    : cohortCaseSetFilters,
                status: "uninitialized",
              },
            },
          });
        } else
          cohortsAdapter.updateOne(state, {
            id: state.currentCohort,
            changes: {
              filters: filters,
              modified: true,
              modified_datetime: new Date().toISOString(),
            },
          });
      }
    },
    removeCohortFilter: (state, action: PayloadAction<string>) => {
      // todo clear case set if not needed
      const root = state.entities[state.currentCohort]?.filters.root;
      if (!root) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...updated } = root;

      const requiresCaseSet = willRequireCaseSet({
        mode: "and",
        root: updated,
      });

      if (requiresCaseSet) {
        const cohortCaseSetFilters =
          state.entities[state.currentCohort]?.caseSet?.caseSetId;
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            modified: true,
            modified_datetime: new Date().toISOString(),
            caseSet: {
              pendingFilters: { mode: "and", root: updated },
              caseSetId:
                cohortCaseSetFilters === undefined
                  ? { mode: "and", root: {} }
                  : cohortCaseSetFilters,
              status: "uninitialized",
            },
          },
        });
      } else
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            filters: { mode: "and", root: updated },
            modified: true,
            modified_datetime: new Date().toISOString(),
            caseSet: {
              pendingFilters: undefined,
              caseSetId: { mode: "and", root: {} },
              status: "uninitialized",
            },
          },
        });
    },
    clearCohortFilters: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          filters: { mode: "and", root: {} },
          modified: true,
          modified_datetime: new Date().toISOString(),
          caseSet: {
            pendingFilters: undefined,
            caseSetId: { mode: "and", root: {} },
            status: "uninitialized",
          },
        },
      });
    },
    discardCohortChanges: (
      state,
      action: PayloadAction<FilterSet | undefined>,
    ) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          filters: action.payload || { mode: "and", root: {} },
          modified: false,
          modified_datetime: new Date().toISOString(),
        },
      });
      state.message = `discardChanges|${
        state.entities[state.currentCohort]?.name
      }|${state.currentCohort}`;
    },
    setCurrentCohortId: (state, action: PayloadAction<string>) => {
      const currentCohort = state.entities[state.currentCohort];
      const cohort = state.entities[action.payload];
      state.currentCohort = action.payload; // todo create pending caseSet if needed
      if (cohort && willRequireCaseSet(cohort.filters)) {
        cohortsAdapter.updateOne(state, {
          id: action.payload,
          changes: {
            filters: currentCohort?.filters,
            caseSet: {
              status: "uninitialized",
              caseSetId: { mode: "and", root: {} },
              pendingFilters: cohort.filters,
            },
          },
        });
      }
    },
    clearCohortMessage: (state) => {
      state.message = undefined;
    },
    setCohortMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearCaseSet: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          caseSet: {
            status: "uninitialized",
            caseSetId: { mode: "and", root: {} },
            pendingFilters: undefined,
          },
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCaseSet.fulfilled, (state, action) => {
        const response = action.payload;
        const cohort = state.entities[state.currentCohort] as Cohort;
        if (cohort?.caseSet?.pendingFilters === undefined) {
          console.error(
            "trying to create a case set with no pending filters",
            cohort.id,
          );
        }
        if (response.errors && Object.keys(response.errors).length > 0) {
          // get pending filter and set them as the cohort filters
          cohortsAdapter.updateOne(state, {
            id: state.currentCohort,
            changes: {
              filters: cohort?.caseSet?.pendingFilters,
              caseSet: {
                caseSetId: { mode: "and", root: {} },
                status: "rejected",
                error: response.errors.sets,
              },
            },
          });
        }
        const data = response.data.sets.create.explore;
        const filters = cohort?.caseSet?.pendingFilters;
        const additionalFilters =
          filters === undefined
            ? {}
            : divideFilterSetByPrefix(filters, ["genes."]).withoutPrefix.root;
        const caseSetFilter: FilterSet = {
          mode: "and",
          root: {
            "cases.case_id": {
              field: "cases.case_id",
              operator: "includes",
              operands: [`set_id:${data.case.set_id}`],
            },
            ...additionalFilters,
          },
        };
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            filters: cohort?.caseSet?.pendingFilters,
            caseSet: {
              caseSetId: caseSetFilter,
              status: "fulfilled",
              pendingFilters: undefined,
            },
          },
        });
      })
      .addCase(createCaseSet.pending, (state) => {
        const cohort = state.entities[state.currentCohort] as Cohort;
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            caseSet: {
              pendingFilters: cohort?.caseSet?.pendingFilters,
              caseSetId: cohort?.caseSet.caseSetId,
              status: "pending",
            },
          },
        });
      })
      .addCase(createCaseSet.rejected, (state) => {
        const cohort = state.entities[state.currentCohort] as Cohort;
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            caseSet: {
              caseSetId: { mode: "and", root: {} },
              pendingFilters: cohort?.caseSet?.pendingFilters,
              status: "rejected",
            },
          },
        });
      });
  },
});

export const availableCohortsReducer = slice.reducer;

export const {
  addNewCohort,
  addNewCohortWithFilterAndMessage,
  removeCohort,
  updateCohortName,
  setCurrentCohortId,
  updateCohortFilter,
  removeCohortFilter,
  clearCohortFilters,
  clearCaseSet,
  clearCohortMessage,
  setCohortList,
  discardCohortChanges,
  setCohortMessage,
} = slice.actions;

export const cohortSelectors = cohortsAdapter.getSelectors(
  (state: CoreState) => state.cohort.availableCohorts,
);

export const selectAvailableCohorts = (state: CoreState): Cohort[] =>
  cohortSelectors.selectAll(state);

export const selectCurrentCohortId = (state: CoreState): string | undefined =>
  state.cohort.availableCohorts.currentCohort;

export const selectCohortMessage = (state: CoreState): string | undefined =>
  state.cohort.availableCohorts.message;

export const selectCurrentCohortModified = (
  state: CoreState,
): boolean | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.modified;
};

export const selectCurrentCohortSaved = (
  state: CoreState,
): boolean | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.saved;
};

export const selectCurrentCohort = (state: CoreState): Cohort | undefined =>
  cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );

export const selectCurrentCohortName = (
  state: CoreState,
): string | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.name;
};

export const selectAvailableCohortByName = (
  state: CoreState,
  name: string,
): Cohort | undefined =>
  cohortSelectors
    .selectAll(state)
    .find((cohort: Cohort) => cohort.name === name);

/**
 * Returns the current cohort filters as a FilterSet
 * @param state
 */
export const selectCurrentCohortFilterSet = (
  state: CoreState,
): FilterSet | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.filters;
};

interface SplitFilterSet {
  withPrefix: FilterSet;
  withoutPrefix: FilterSet;
}

const divideFilterSetByPrefix = (
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

/**
 * Divides the current cohort into prefix and not prefix. This is
 * used to create caseSets for files and cases
 * @param state
 * @param prefixes - and array of filter prefix to separate on (typically ["genes."])
 */
export const divideCurrentCohortFilterSetFilterByPrefix = (
  state: CoreState,
  prefixes: string[],
): SplitFilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  if (cohort === undefined)
    return {
      withPrefix: { mode: "and", root: {} },
      withoutPrefix: { mode: "and", root: {} },
    };

  return divideFilterSetByPrefix(cohort?.filters, prefixes);
};

/**
 * Returns the currentCohortFilters as a GqlOperation
 * @param state
 */
export const selectCurrentCohortGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return buildCohortGqlOperator(cohort?.filters);
};

/**
 * Returns either a filterSet or a filter containing a caseSetId that was created
 * for the current cohort. If the cohort is undefined an empty FilterSet is returned.
 * Used to create a cohort that work with both explore and repository indexes
 * @param state
 */
export const selectCurrentCohortFilterOrCaseSet = (
  state: CoreState,
): FilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  if (cohort === undefined) return { mode: "and", root: {} };

  if (!isFilterSetRootEmpty(cohort?.caseSet.caseSetId)) {
    return cohort?.caseSet.caseSetId;
  } else {
    return cohort.filters;
  }
};

/**
 * Main selector of the current Cohort Filters.
 * @param state
 */
export const selectCurrentCohortFilters = (
  state: CoreState,
): FilterSet | undefined => selectCurrentCohortFilterOrCaseSet(state);

/**
 * CurrentCohort filters for GraphQL
 * @param state
 */
export const selectCurrentCohortFiltersGQL = (
  state: CoreState,
): GqlOperation | undefined =>
  buildCohortGqlOperator(selectCurrentCohortFilterOrCaseSet(state));

/**
 * Select a filter by its name from the current cohort. If the filter is not found
 * returns undefined.
 * @param state
 * @param name
 */
export const selectCurrentCohortFiltersByName = (
  state: CoreState,
  name: string,
): Operation | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.filters?.root[name];
};

/**
 * Returns the current caseSetId filter representing the cohort
 * if the cohort is undefined it returns an empty caseSetIdFilter
 * @param state
 */
export const selectCurrentCohortCaseSet = (
  state: CoreState,
): CoreDataSelectorResponse<FilterSet> => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  if (cohort === undefined || cohort?.caseSet === undefined)
    return {
      data: { mode: "and", root: {} },
      status: "uninitialized",
    };
  return { ...cohort.caseSet };
};
