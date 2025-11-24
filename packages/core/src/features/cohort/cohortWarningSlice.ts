import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "src/reducers";

const initialState: Record<string, boolean> = {};

const cohortWarningSlice = createSlice({
  name: "cohortWarning",
  initialState,
  reducers: {
    addCohortWarning: (state, action: PayloadAction<{ cohortId: string }>) => {
      return {
        ...state,
        [action.payload.cohortId]: false,
      };
    },
    dismissWarningBanner: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        [action.payload]: true,
      };
    },
  },
});

export const selectAllCohortsWithWarnings = (state: CoreState): string[] =>
  Object.keys(state.cohort.cohortWarnings);

export const selectCohortWarning = (
  state: CoreState,
  cohortId: string,
): boolean | undefined => {
  const warningState = state.cohort.cohortWarnings?.[cohortId];
  return warningState;
};

export const cohortWarningReducer = cohortWarningSlice.reducer;

export const { addCohortWarning, dismissWarningBanner } =
  cohortWarningSlice.actions;
