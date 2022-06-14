import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

const slice = createSlice({
  name: "cohort/currentCohort",
  initialState: "" as string | undefined,
  reducers: {
    setCurrentCohort: (state, action: PayloadAction<string>) => {
      state = action.payload;
      return state;
    },
    clearCurrentCohort: (state) => {
      state = undefined;
      return state;
    },
  },
  extraReducers: {},
});

export const currentCohortReducer = slice.reducer;
export const { setCurrentCohort, clearCurrentCohort } = slice.actions;

export const selectCurrentCohort = (state: CoreState): string | undefined =>
  state.cohort.currentCohort;
