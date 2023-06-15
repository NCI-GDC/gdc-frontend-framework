import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AppState } from "./appApi";
import { type Cohort, type GqlOperation } from "@gff/core";
import { isEqual } from "lodash";
import { SelectedEntities } from "@/features/set-operations/types";

export type CohortCaseSetStatus =
  | "use"
  | "create"
  | "update"
  | "delete"
  | "unused";

interface CohortCaseSet {
  readonly cohort: Cohort; // cohort this case set belongs to
  readonly caseSetId: string; // case set id associated with this cohort
  readonly createdFilters: GqlOperation; // filters that created this cohort
}

const cohortCaseSetsAdapter = createEntityAdapter<CohortCaseSet>({
  selectId: (c) => c.cohort.id,
  sortComparer: (a, b) => a.cohort.id.localeCompare(b.cohort.id),
});

const cohortCaseSetsSlice = createSlice({
  name: "set-operations/cohortCaseSets",
  initialState: cohortCaseSetsAdapter.getInitialState(),
  reducers: {
    addCohort: cohortCaseSetsAdapter.addOne,
    updateCohortCaseSet: cohortCaseSetsAdapter.updateOne,
    registerCohortCaseSet: (state, action: PayloadAction<CohortCaseSet>) => {
      console.log("registerCohortCaseSet", action);
      cohortCaseSetsAdapter.setOne(state, action.payload);
    },
  },
});

export const cohortCaseSetReducer = cohortCaseSetsSlice.reducer;
export const { registerCohortCaseSet } = cohortCaseSetsSlice.actions;

export const cohortCaseSetSelectors = cohortCaseSetsAdapter.getSelectors(
  (state: AppState) => state.cohortCaseSets,
);

const selectCohortCaseSet = (
  state: AppState,
  id: string,
): CohortCaseSet | undefined => state.cohortCaseSets.entities?.[id];

/**
 * Classify if a cohort needs  to create a  case set if there is no case set
 * or updating a case set if the filters have changed
 * @param state
 * @param cohort
 * @returns CohortCaseSetStatus
 */
export const classifyIfCohortNeedsCaseSet = (
  state: AppState,
  cohort: Cohort,
): CohortCaseSetStatus => {
  const cohortCaseSet = selectCohortCaseSet(state, cohort.id);
  console.log("classifyIfCohortNeedsCaseSet", cohortCaseSet);
  if (cohortCaseSet === undefined) return "create";
  if (isEqual(cohort.filters, cohortCaseSet.createdFilters)) return "use";
  return "update";
};

/**
 * Classify if a cohort needs a case set for each cohort in a list of cohorts
 * @param state
 * @param cohorts
 * @returns a Record<string, CohortCaseSetStatus> mapping cohort ids to status
 */
export const classifyIfManyCohortsNeedForCaseSet = (
  state: AppState,
  cohorts: Record<string, Cohort>,
): Record<string, CohortCaseSetStatus> => {
  return Object.values(cohorts).reduce((acc, cohort) => {
    return { ...acc, [cohort.id]: classifyIfCohortNeedsCaseSet(state, cohort) };
  }, {});
};

/**
 * Classify if a cohort needs a case set for each cohort in a list of cohorts
 * @param state
 * @param cohorts
 * @returns a Record<string, CohortCaseSetStatus> mapping cohort ids to status
 */
export const selectCaseSetsFromCohort = (
  state: AppState,
  cohorts: ReadonlyArray<Cohort>,
): SelectedEntities[] => {
  return Object.values(cohorts).reduce((acc, cohort) => {
    if (cohort.id in state.cohortCaseSets.entities)
      acc.push({
        name: cohort.name,
        id: state.cohortCaseSets.entities?.[cohort.id].caseSetId,
      });
    return acc;
  }, []);
};
