import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import { COHORTS } from "./cohortFixture";

export interface CohortName {
  readonly currentCohort?: string;
}

const initialState: CohortName = { currentCohort: COHORTS[0].name };

const slice = createSlice({
  name: "cohort/name",
  initialState,
  reducers: {
    setCurrentCohort: (state, action: PayloadAction<string>) => {
      state.currentCohort = action.payload;
    },
    clearCurrentCohort: (state) => {
      state.currentCohort = undefined;
    },
  },
  extraReducers: {},
});

export const cohortNameReducer = slice.reducer;
export const { setCurrentCohort, clearCurrentCohort } = slice.actions;

export const selectCurrentCohort = (state: CoreState): string | undefined =>
  state.cohort.currentCohort.currentCohort;
