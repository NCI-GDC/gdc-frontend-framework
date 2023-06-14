import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { AppState } from "./appApi";
import { type Cohort, type GqlOperation } from "@gff/core";
import { isEqual } from "lodash";

export type CohortSetCommand =
  | "use"
  | "create"
  | "update"
  | "delete"
  | "unused";

interface CohortCaseSets {
  readonly cohort: Cohort; // cohort this case set belongs to
  readonly caseSetId: string; // case set id associated with this cohort
  readonly createdFilters: GqlOperation; // filters that created this cohort
}

const cohortCaseSetsAdapter = createEntityAdapter<CohortCaseSets>({
  selectId: (c) => c.cohort.id,
  sortComparer: (a, b) => a.cohort.id.localeCompare(b.cohort.id),
});

const cohortCaseSetsSlice = createSlice({
  name: "set-operations/cohortCaseSets",
  initialState: cohortCaseSetsAdapter.getInitialState(),
  reducers: {
    addCohort: cohortCaseSetsAdapter.addOne,
    updateCohortCaseSet: cohortCaseSetsAdapter.updateOne,
  },
});

export const cohortCaseSetReducer = cohortCaseSetsSlice.reducer;
export const { addCohort } = cohortCaseSetsSlice.actions;

const selectCohortCaseSet = (
  state: AppState,
  id: string,
): CohortCaseSets | undefined => state.cohortCaseSets.entities?.[id];

export const classifyIfCohortNeedsCaseSet = (
  state: AppState,
  cohort: Cohort,
): CohortSetCommand => {
  const cohortCaseSet = selectCohortCaseSet(state, cohort.id);
  if (cohortCaseSet === undefined) return "create";
  if (isEqual(cohort.filters, cohortCaseSet.createdFilters)) return "use";
  return "update";
};

export const classifyIfManyCohortsNeedForCaseSet = (
  state: AppState,
  cohorts: Record<string, Cohort>,
): Record<string, CohortSetCommand> => {
  return Object.values(cohorts).reduce((acc, cohort) => {
    return { ...acc, [cohort.id]: classifyIfCohortNeedsCaseSet(state, cohort) };
  }, {});
};
