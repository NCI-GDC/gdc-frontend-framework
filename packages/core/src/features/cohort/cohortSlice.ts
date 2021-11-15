import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";

export interface CohortState {
  readonly currentCohort?: string;
  readonly filters:string[];
}

const initialState: CohortState = { filters: []};

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
    addFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.concat(action.payload)
    },
    clearFilters: (state) => {
      state.filters = [];
    },
  },
  extraReducers: {},
});

export const cohortReducer = slice.reducer;

export const { setCurrentCohort, clearCurrentCohort, addFilter, clearFilters } = slice.actions;

export const selectCurrentCohort = (state: CoreState): string | undefined =>
  state.cohort.currentCohort;

export const selectCurrentCohortFilters = (state: CoreState): string[]  =>
  state.cohort.filters;
