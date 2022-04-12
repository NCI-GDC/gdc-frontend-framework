import { createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import { COHORTS } from "./cohortFixture";

const initialState: any = COHORTS;

const slice = createSlice({
  name: "cohort/availableCohorts",
  initialState,
  reducers: {
    addCohort: (state, action) => {
      state = [...state, action.payload];
    },
  },
  extraReducers: {},
});

export const availableCohortsReducer = slice.reducer;
export const { addCohort } = slice.actions;

export const selectAvailableCohorts = (state: CoreState) =>
  state.cohort.availableCohorts;

export const selectAvailableCohortByName = (
  state: CoreState,
  name: string,
) => state.cohort.availableCohorts.find(cohort => cohort.name === name);
