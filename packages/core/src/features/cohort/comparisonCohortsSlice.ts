import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

const initialState: string[] = [];

const slice = createSlice({
  name: "cohort/comparisonCohorts",
  initialState,
  reducers: {
    setComparisonCohorts: (state, action: PayloadAction<string[]>) => {
      state = action.payload;
      return state;
    },
    clearComparisonCohorts: (state) => {
      state = [];
      return state;
    },
  },
  extraReducers: {},
});

export const comparisonCohortsReducer = slice.reducer;
export const { setComparisonCohorts, clearComparisonCohorts } = slice.actions;

export const selectComparisonCohorts = (state: CoreState): string[] =>
  state.cohort.comparisonCohorts;
