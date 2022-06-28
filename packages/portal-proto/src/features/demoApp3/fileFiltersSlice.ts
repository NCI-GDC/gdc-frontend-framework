import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import RepositoryDefaultConfig from "./config/filters.json";
import { AppState } from "./reducers";

export interface RepositoryFilters {
  readonly label: string;
  readonly docType: string;
  readonly index: string;
  readonly facets: ReadonlyArray<string>;
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
      state.facets = [...state.facets, action.payload.facetName];
    },
    removeFilter: (state, action: PayloadAction<RepositoryFacet>) => {
      state.facets = state.facets.filter((x) => x != action.payload.facetName);
    },
    resetToDefault: () => initialState,
  },
  extraReducers: {},
});

export const repositoryConfigReducer = slice.reducer;
export const { addFilter, removeFilter, resetToDefault } = slice.actions;

export const selectRepositoryConfig = (state: AppState): RepositoryFilters =>
  state.facets;
