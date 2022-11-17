import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import { buildCohortGqlOperator, FilterSet } from "./filters";
import { COHORTS } from "./cohortFixture";
import { GqlOperation, Operation } from "../gdcapi/filters";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "src/store";

export interface CaseSetDataAndStatus {
  readonly status: DataStatus; // status of create caseSet
  readonly error?: string; // any error message
  readonly caseSetId: FilterSet; // A filter set containing the caseID and additional Filters
  // TODO this could also hold the cohort
  //  id for query by cohort
}

export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: FilterSet; // active filters for cohort
  readonly caseSet?: CaseSetDataAndStatus; // case ids for frozen cohorts
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
  const dividedFilters = divideCurrentCohortFilterSetFilterByPrefix(
    thunkAPI.getState(),
    "files.",
  );
  const graphQL = buildCaseSetMutationQuery();

  const filtersGQL = {
    input: {
      filters: dividedFilters?.withoutPrefix
        ? buildCohortGqlOperator(dividedFilters.withoutPrefix)
        : {},
      set_id: `${caseSetId}`,
    },
  };
  return graphqlAPI(graphQL, filtersGQL);
});

export const DEFAULT_COHORT_ID = "ALL-GDC-COHORT";

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

const newCohort = (
  filters: FilterSet = { mode: "and", root: {} },
  modified = false,
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
      if (state.currentCohort === DEFAULT_COHORT_ID) {
        // create a new cohort and add it
        // as the GDC All Cohort is immutable
        const cohort = newCohort(filters, true);
        cohortsAdapter.addOne(state, cohort);
        state.currentCohort = cohort.id;
        state.message = `newCohort|${cohort.name}|${cohort.id}`;
      } else {
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
      const root = state.entities[state.currentCohort]?.filters.root;
      if (!root) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...updated } = root;
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          filters: { mode: "and", root: updated },
          modified: true,
          modified_datetime: new Date().toISOString(),
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
      state.currentCohort = action.payload;
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
          },
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCaseSet.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0) {
          cohortsAdapter.updateOne(state, {
            id: state.currentCohort,
            changes: {
              caseSet: {
                caseSetId: { mode: "and", root: {} },
                status: "rejected",
                error: response.errors.sets,
              },
            },
          });
        }
        const data = response.data.sets.create.explore;
        const cohort = state.entities[state.currentCohort] as Cohort;
        const filters = cohort?.filters;
        const additionalFilters =
          filters === undefined
            ? {}
            : divideFilterSetByPrefix(filters, "files.").withPrefix.root;
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
            caseSet: {
              caseSetId: caseSetFilter,
              status: "fulfilled",
            },
          },
        });
      })
      .addCase(createCaseSet.pending, (state) => {
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            caseSet: {
              caseSetId: { mode: "and", root: {} },
              status: "pending",
            },
          },
        });
      })
      .addCase(createCaseSet.rejected, (state) => {
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            caseSet: {
              caseSetId: { mode: "and", root: {} },
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
  prefix: string,
): SplitFilterSet => {
  const results = Object.entries(filters.root).reduce(
    (
      newObj: {
        withPrefix: Record<string, Operation>;
        withoutPrefix: Record<string, Operation>;
      },
      [key, val],
    ) => {
      if (key.startsWith(prefix)) newObj.withPrefix[key] = val;
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
 * @parm prefix - filter prefix to separate on (typically "files.")
 */
export const divideCurrentCohortFilterSetFilterByPrefix = (
  state: CoreState,
  prefix: string,
): SplitFilterSet | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  if (cohort === undefined) return undefined;

  return divideFilterSetByPrefix(cohort?.filters, prefix);
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

  if (
    cohort.caseSet &&
    Object.keys(cohort.caseSet.caseSetId.root).length != 0
  ) {
    return cohort.caseSet.caseSetId;
  } else return cohort.filters;
};

/**
 * Main selector of the current Cohort Filters.
 * @param state
 */
export const selectCurrentCohortFilters = (
  state: CoreState,
): FilterSet | undefined => selectCurrentCohortFilterOrCaseSet(state);

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
  if (cohort === undefined || cohort.caseSet === undefined)
    return {
      data: { mode: "and", root: {} },
      status: "uninitialized",
    };
  return { ...cohort.caseSet };
};
