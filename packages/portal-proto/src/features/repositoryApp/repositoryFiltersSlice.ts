import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet } from "@gff/core";
import { AppState } from "./appApi";

export interface RepositoryFiltersSlice {
  readonly filters: FilterSet;
}

const initialState: RepositoryFiltersSlice = {
  filters: { mode: "and", root: {} },
};

const slice = createSlice({
  name: "repositoryApp/filters",
  initialState,
  reducers: {
    updateRepositoryFilter: (
      state,
      action: PayloadAction<{ field: string; operation: Operation }>,
    ) => {
      return {
        ...state,
        filters: {
          mode: "and",
          root: {
            ...state.filters.root,
            [action.payload.field]: action.payload.operation,
          },
        },
      };
    },
    removeRepositoryFilter: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...updated } = state.filters.root;
      return {
        ...state,
        filters: {
          mode: "and",
          root: updated,
        },
      };
    },
    clearRepositoryFilters: () => {
      return { filters: { mode: "and", root: {} } };
    },
  },
});

export const repositoryFiltersReducer = slice.reducer;
export const {
  updateRepositoryFilter,
  removeRepositoryFilter,
  clearRepositoryFilters,
} = slice.actions;

export const selectFilters = (state: AppState): FilterSet | undefined =>
  state.filters.filters;

export const selectFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => state.filters.filters?.root[name];
