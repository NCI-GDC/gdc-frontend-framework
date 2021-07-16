import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";

export interface CohortState {
  readonly currentCohort?: string;
}

const initialState: CohortState = {};

const slice = createSlice({
  name: "cohort",
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

export const cohortReducer = slice.reducer;

export const { setCurrentCohort, clearCurrentCohort } = slice.actions;

export const selectCurrentCohort = (state: CoreState): string | undefined =>
  state.cohort.currentCohort;
