import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import RepositoryDefaultConfig from "./config/filters.json";
import { AppState } from "./appApi";

export interface RepositoryFacet {
  readonly facetName: string;
}

const initialState = { customFacets: [] };

const slice = createSlice({
  name: "repository/appConfig",
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<RepositoryFacet>) => {
      if (!state.customFacets.includes(action.payload.facetName))
        state.customFacets = [action.payload.facetName, ...state.customFacets];
    },
    removeFilter: (state, action: PayloadAction<RepositoryFacet>) => {
      state.customFacets = state.customFacets.filter(
        (x) => x != action.payload.facetName,
      );
    },
    resetToDefault: (state) => {
      state.customFacets = [];
    },
  },
});

export const repositoryConfigReducer = slice.reducer;
export const { addFilter, removeFilter, resetToDefault } = slice.actions;

export const getDefaultFacets = (): string[] => RepositoryDefaultConfig.facets;

export const selectCustomFacets = (state: AppState) =>
  state.facets.customFacets;
export const selectRepositoryConfigFacets = (
  state: AppState,
): ReadonlyArray<string> => [
  ...state.facets.customFacets,
  ...RepositoryDefaultConfig.facets,
];
