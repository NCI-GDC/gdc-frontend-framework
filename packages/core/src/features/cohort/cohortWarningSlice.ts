import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "src/reducers";

const initialState: Record<string, boolean> = {};

const cohortWarningSlice = createSlice({
  name: "cohortWarning",
  initialState,
  reducers: {
    addCohortWarning: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        [action.payload]: true,
      };
    },
    dismissWarningBanner: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        [action.payload]: false,
      };
    },
  },
});

const selectCohortWarnings = (state: CoreState) => state.cohort.cohortWarnings;

export const selectAllCohortsWithWarnings = createSelector(
  [selectCohortWarnings],
  (warnings) => Object.keys(warnings),
);

export const selectDisplayCohortWarning = (
  state: CoreState,
  cohortId: string,
): boolean | undefined => {
  return state.cohort.cohortWarnings?.[cohortId];
};

export const cohortWarningReducer = cohortWarningSlice.reducer;

export const { addCohortWarning, dismissWarningBanner } =
  cohortWarningSlice.actions;
