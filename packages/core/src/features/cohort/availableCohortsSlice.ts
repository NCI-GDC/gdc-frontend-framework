import { createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import { FilterSet } from "./cohortFilterSlice";
import { COHORTS } from "./cohortFixture";

const initialState: any = COHORTS;

interface Cohort {
  readonly name: string;
  readonly filters: FilterSet;
}

const slice = createSlice({
  name: "cohort/availableCohorts",
  initialState,
  reducers: {},
  extraReducers: {},
});

export const availableCohortsReducer = slice.reducer;

export const selectAvailableCohorts: (state: CoreState) => any = (
  state: CoreState,
) => state.cohort.availableCohorts;

export const selectAvailableCohortByName: (
  state: CoreState,
  name: string,
) => any = (state: CoreState, name: string) =>
  state.cohort.availableCohorts.find((cohort: Cohort) => cohort.name === name);
