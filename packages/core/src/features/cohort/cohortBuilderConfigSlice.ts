import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CohortBuilderDefaultConfig from "./data/cohort_builder.json";
import { CoreState } from "../../store";

export interface CohortBuilderCategory {
  readonly label: string;
  readonly docType: string;
  readonly index: string;
  readonly facets: ReadonlyArray<string>;
}

const initialState: Record<string, CohortBuilderCategory> =
  CohortBuilderDefaultConfig.config;

export interface CohortBuilderCategoryFacet {
  readonly category: string;
  readonly facetName: string;
}

const slice = createSlice({
  name: "cohort/builderConfig",
  initialState,
  reducers: {
    addFilterToCohortBuilder: (
      state,
      action: PayloadAction<CohortBuilderCategoryFacet>,
    ) => {
      state[action.payload.category].facets = [
        ...state[action.payload.category].facets,
        action.payload.facetName,
      ];
    },
    removeFilterFromCohortBuilder: (
      state,
      action: PayloadAction<CohortBuilderCategoryFacet>,
    ) => {
      state[action.payload.category].facets = state[
        action.payload.category
      ].facets.filter((x) => x != action.payload.facetName);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetCohortBuilderToDefault: () => initialState,
  },
  extraReducers: {},
});

export const cohortBuilderConfigReducer = slice.reducer;
export const {
  addFilterToCohortBuilder,
  removeFilterFromCohortBuilder,
  resetCohortBuilderToDefault,
} = slice.actions;

export const selectCurrentCohort = (
  state: CoreState,
): Record<string, CohortBuilderCategory> => state.cohort.builderConfig;
