import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "src/reducers";

interface CohortWarnings {
  readonly deprecated: string[];
  readonly nonexistent: string[];
}

export interface CohortWarningState {
  readonly warnings: CohortWarnings;
  readonly bannerDismissed: boolean;
}

const initialState: Record<string, CohortWarningState> = {};

const cohortWarningSlice = createSlice({
  name: "cohortWarning",
  initialState,
  reducers: {
    addCohortWarning: (
      state,
      action: PayloadAction<{ cohortId: string; warnings: CohortWarnings }>,
    ) => {
      return {
        ...state,
        [action.payload.cohortId]: {
          bannerDismissed: false,
          warnings: action.payload.warnings,
        },
      };
    },
    dismissWarningBanner: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        [action.payload]: { ...state[action.payload], bannerDismissed: true },
      };
    },
  },
});

export const selectAllCohortsWithWarnings = (state: CoreState): string[] =>
  Object.keys(state.cohort.cohortWarnings);

export const selectCohortWarning = (
  state: CoreState,
  cohortId: string,
): CohortWarningState | undefined => {
  const warningState = state.cohort.cohortWarnings?.[cohortId];
  return warningState;
};

export const cohortWarningReducer = cohortWarningSlice.reducer;

export const { addCohortWarning, dismissWarningBanner } =
  cohortWarningSlice.actions;
