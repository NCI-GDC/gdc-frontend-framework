import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import { buildCohortGqlOperator, FilterSet } from "./cohortFilterSlice";
import { COHORTS } from "./cohortFixture";
import { GqlOperation, Operation } from "../gdcapi/filters";
import { createCaseSet } from "./caseSetSlice";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";

export interface CaseSetState {
  readonly status: DataStatus;
  readonly error?: string;
  readonly caseSetId: FilterSet;
}

export interface Cohort {
  readonly name: string;
  readonly id: string;
  readonly filters: FilterSet;
  readonly caseSet: CaseSetState;
  //  readonly status?: DataStatus;
  //  readonly error?: string;
  //  readonly caseSetId: FilterSet;
}

const cohortsAdapter = createEntityAdapter<Cohort>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const emptyInitialState = cohortsAdapter.getInitialState({
  currentCohort: COHORTS[0].id,
});
const initialState = cohortsAdapter.upsertMany(
  emptyInitialState,
  COHORTS as Cohort[],
);

interface UpdateFilterParams {
  field: string;
  operation: Operation;
}

const slice = createSlice({
  name: "cohort/availableCohorts",
  initialState: initialState,
  reducers: {
    addNewCohort: (state, action: PayloadAction<string>) => {
      cohortsAdapter.addOne(state, {
        name: "cohort1",
        id: action.payload,
        caseSet: {
          caseSetId: { mode: "and", root: {} },
          status: "uninitialized",
        },
        filters: { mode: "and", root: {} },
      });
    },
    updateCohortName: (state, action: PayloadAction<string>) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: { name: action.payload },
      });
    },
    updateCohortFilter: (state, action: PayloadAction<UpdateFilterParams>) => {
      const filters = {
        mode: "and",
        root: {
          ...state.entities[state.currentCohort]?.filters.root,
          [action.payload.field]: action.payload.operation,
        },
      };
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: { filters: filters },
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
        changes: { filters: { mode: "and", root: updated } },
      });
    },
    clearCohortFilters: (state) => {
      cohortsAdapter.updateOne(state, {
        id: state.currentCohort,
        changes: { filters: { mode: "and", root: {} } },
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
        const index = action.meta.arg.index ?? "explore";
        const data = response.data.sets.create[index];
        const caseSetFilter: FilterSet = {
          mode: "and",
          root: {
            "cases.case_id": {
              field: "cases.case_id",
              operator: "includes",
              operands: [`set_id:${data.case.set_id}`],
            },
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

export const { addNewCohort } = slice.actions;
export const { updateCohortFilter, removeCohortFilter, clearCohortFilters } =
  slice.actions;

const cohortSelectors = cohortsAdapter.getSelectors(
  (state: CoreState) => state.cohorts.availableCohorts,
);

export const selectAvailableCohorts: (state: CoreState) => any = (
  state: CoreState,
) => state.cohort.availableCohorts;

export const selectAvailableCohortByName: (
  state: CoreState,
  name: string,
) => any = (state: CoreState, name: string) =>
  cohortSelectors
    .selectAll(state)
    .find((cohort: Cohort) => cohort.name === name);

export const selectCurrentCohortFilterSet = (
  state: CoreState,
): FilterSet | undefined => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort?.filters;
};

export const selectCurrentCohortCaseGqlFilters = (
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

  if (Object.keys(cohort.caseSet.caseSetId.root).length != 0) {
    return cohort.caseSet.caseSetId;
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
  return { ...cohort.caseSet };
};

export const selectCurrentCohortCaseSetFilter = (
  state: CoreState,
): FilterSet => {
  const cohort = cohortSelectors.selectById(
    state,
    state.cohort.availableCohorts.currentCohort,
  );
  return cohort === undefined
    ? { mode: "and", root: {} }
    : cohort.caseSet.caseSetId;
};
