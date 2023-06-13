import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { AppState } from "./appApi";
import { type Cohort, type FilterSet } from "@gff/core";
import { isEqual } from "lodash";

type CohortSetCommand = "use" | "create" | "update" | "delete";

interface CohortCaseSets {
  readonly cohort: Cohort; // cohort this case set belongs to
  readonly caseSets: ReadonlyArray<string>; // case sets in this cohort
  readonly caseSetId: string; // case set id associated with this cohort
  readonly createdFilters: FilterSet; // filters that created this cohort
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

export const selectCommand = (
  state: AppState,
  cohort: Cohort,
): CohortSetCommand => {
  const cohortCaseSet = selectCohortCaseSet(state, cohort.id);
  if (cohortCaseSet === undefined) return "create";
  if (isEqual(cohort.filters, cohortCaseSet.createdFilters)) return "use";
  return "update";
};
