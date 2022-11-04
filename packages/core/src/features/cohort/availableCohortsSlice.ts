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
import { GQLIndexType } from "../facets/types";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";

export interface CaseSetDataAndStatus {
  readonly status: DataStatus;
  readonly error?: string;
  readonly caseSetId: FilterSet;
}

export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: FilterSet; // active filters for cohort
  readonly case_ids: string[]; // case ids for frozen cohorts
  readonly modified: boolean; // flag which is set to true if modified and unsaved
  readonly modifiedDate: string; // last time cohort was modified
  readonly saved?: boolean; // flag indicating if cohort has been saved.
}

/*
 A start at handling how to seamlessly create cohorts that can bridge explore
 and repository indexes. The slice creates a case set id using the defined filters
*/
const buildCaseSetMutationQuery = (index: string) => `
 mutation mutationsCreateRepositoryCaseSetMutation(
  $input: CreateSetInput
) {
  sets {
    create {
      ${index} {
        case(input: $input) {
          set_id
          size
        }
      }
    }
  }
}`;

export interface CreateCaseSetProps {
  readonly filterSelector?: (state: CoreState) => FilterSet;
  readonly index?: GQLIndexType;
}

export const createCaseSet = createAsyncThunk<
  GraphQLApiResponse<Record<string, any>>,
  CreateCaseSetProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohort/createCaseSet",
  async (
    {
      filterSelector = selectCurrentCohortFilters,
      index = "repository" as GQLIndexType,
    },
    thunkAPI,
  ) => {
    const filters = buildCohortGqlOperator(filterSelector(thunkAPI.getState()));
    const graphQL = buildCaseSetMutationQuery(index);

    const filtersGQL = {
      input: { filters: filters ? filters : {} },
      never_used: null,
    };
    return graphqlAPI(graphQL, filtersGQL);
  },
);

export const DEFAULT_COHORT_ID = "ALL-GDC-COHORT";

const cohortsAdapter = createEntityAdapter<Cohort>({
  sortComparer: (a, b) => {
    //sort everything else by modified
    if (a.modifiedDate <= b.modifiedDate) return 1;
    else return -1;
  },
});

// console.log("cohortsAdapter: ", cohortsAdapter);
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
    case_ids: [],
    filters: filters,
    modified: modified,
    saved: false,
    modifiedDate: ts.toISOString(),
  };
};

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
 * addNewCohort() - create a new cohort
 * updateCohortName(name:string): changes the current cohort's name
 * updateCohortFilter(filters: FilterSet): update the filters for this cohort
 * removeCohortFilter(filter:string): removes the filter from the cohort
 * clearCohortFilters(): removes all the filters by setting them to the default all GDC state
 * setCurrentCohortId(id:string): set the id of the current cohort, used to switch between cohorts
 * clearCaseSet(): resets the caseSet member to all GDC
 * removeCohort(): removes the current cohort
 * clearCohortMessage(): clears the current message by setting it to undefined
 */
const slice = createSlice({
  name: "cohort/availableCohorts",
  initialState: initialState,
  reducers: {
    addNewCohort: (state) => {
      const cohort = newCohort();
      cohortsAdapter.addOne(state, cohort);
      state.currentCohort = cohort.id;
      state.message = `newCohort|${cohort.name}`;
    },
    updateCohortName: (state, action: PayloadAction<string>) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: { name: action.payload },
      });
    },
    setCohortList: (state, action: PayloadAction<Cohort[]>) => {
      // console.log("here: ", action);
      cohortsAdapter.upsertMany(state, (action.payload as Cohort[]) || []);
      //  console.log("cohortsAdapter: ", cohortsAdapter);
    },
    removeCohort: (state) => {
      if (state.currentCohort === DEFAULT_COHORT_ID) return; // Do NOT remove the "All GDC"
      const removedCohort = state.entities[state.currentCohort];
      cohortsAdapter.removeOne(state, state.currentCohort);
      state.message = `deleteCohort|${removedCohort?.name}`;
      state.currentCohort = DEFAULT_COHORT_ID;
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
        state.message = `newCohort|${cohort.name}`;
      } else {
        console.log("filters: ", filters);
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            filters: filters,
            modified: Object.keys(filters.root).length > 0 || true,
            modifiedDate: new Date().toISOString(),
          },
        });
      }
    },
    setModifed: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          modified: false,
          modifiedDate: new Date().toISOString(),
        },
      });
    },
    setSaved: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          saved: true,
        },
      });
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
          modifiedDate: new Date().toISOString(),
        },
      });
    },
    clearCohortFilters: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          filters: { mode: "and", root: {} },
          modified: true,
          modifiedDate: new Date().toISOString(),
        },
      });
    },
    discardCohortChanges: (state) => {
      // need to get the filters of the cohort saved in BE
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          filters: { mode: "and", root: {} },
          modified: false,
          saved: true,
          modifiedDate: new Date().toISOString(),
        },
      });
    },
    setCurrentCohortId: (state, action: PayloadAction<string>) => {
      state.currentCohort = action.payload;
    },
    clearCohortMessage: (state) => {
      state.message = undefined;
    },
    clearCaseSet: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: {
          case_ids: [],
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
              case_ids: [],
            },
          });
        }
        // const index = action.meta.arg.index ?? "explore";
        // const data = response.data.sets.create[index];
        // const caseSetFilter: FilterSet = {
        //   mode: "and",
        //   root: {
        //     "cases.case_id": {
        //       field: "cases.case_id",
        //       operator: "includes",
        //       operands: [`set_id:${data.case.set_id}`],
        //     },
        //   },
        // };
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            case_ids: [],
          },
        });
      })
      .addCase(createCaseSet.pending, (state) => {
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            case_ids: [],
          },
        });
      })
      .addCase(createCaseSet.rejected, (state) => {
        cohortsAdapter.updateOne(state, {
          id: state.currentCohort,
          changes: {
            case_ids: [],
          },
        });
      });
  },
});

export const availableCohortsReducer = slice.reducer;

export const {
  addNewCohort,
  removeCohort,
  updateCohortName,
  setCurrentCohortId,
  updateCohortFilter,
  removeCohortFilter,
  clearCohortFilters,
  clearCaseSet,
  clearCohortMessage,
  setCohortList,
  setModifed,
  setSaved,
  discardCohortChanges,
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

export const selectCurrentCohortFilters = (
  state: CoreState,
): FilterSet | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.filters;
};

export const selectCurrentCohortGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return buildCohortGqlOperator(cohort?.filters);
};

export const selectCurrentCohortFilterOrCaseSet = (
  state: CoreState,
): FilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  if (cohort === undefined) return { mode: "and", root: {} };

  if (Object.keys(cohort.case_ids).length != 0) {
    return cohort.filters;
  } else return cohort.filters;
};

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

export const selectCurrentCohortCaseSet = (
  state: CoreState,
): CoreDataSelectorResponse<FilterSet> => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  if (cohort === undefined)
    return {
      data: { mode: "and", root: {} },
      status: "uninitialized",
    };
  return { ...cohort.filters, status: "uninitialized" };
};

export const selectCurrentCohortCaseSetFilter = (
  state: CoreState,
): FilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort === undefined ? { mode: "and", root: {} } : cohort.filters;
};
