import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import RepositoryDefaultConfig from "./config/filters.json";
import { AppState } from "./appApi";

export interface RepositoryFilters {
  readonly label: string;
  readonly docType: string;
  readonly index: string;
  readonly facets: Array<string>;
}

export interface RepositoryFacet {
  readonly facetName: string;
}

const initialState: RepositoryFilters = RepositoryDefaultConfig;

const slice = createSlice({
  name: "repository/appConfig",
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<RepositoryFacet>) => {
      if (!state.facets.includes(action.payload.facetName))
        state.facets = [action.payload.facetName, ...state.facets];
    },
    removeFilter: (state, action: PayloadAction<RepositoryFacet>) => {
      state.facets = state.facets.filter((x) => x != action.payload.facetName);
    },
    resetToDefault: () => initialState,
  },
});

export const repositoryConfigReducer = slice.reducer;
export const { addFilter, removeFilter, resetToDefault } = slice.actions;

export const selectRepositoryConfig = (state: AppState): RepositoryFilters =>
  state.facets;

export const getDefaultFacets = (): string[] => RepositoryDefaultConfig.facets;

export const selectRepositoryConfigFacets = (
  state: AppState,
): ReadonlyArray<string> => state.facets.facets;
