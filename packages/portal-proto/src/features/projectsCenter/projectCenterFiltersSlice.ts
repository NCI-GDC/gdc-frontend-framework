import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet } from "@gff/core";
import { AppState } from "./appApi";

export interface ProjectCenterFiltersState {
  readonly filters: FilterSet;
}

const initialState: ProjectCenterFiltersState = {
  filters: { mode: "and", root: {} },
};

const slice = createSlice({
  name: "projectCenter/filters",
  initialState,
  reducers: {
    updateProjectFilter: (
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
    removeProjectFilter: (state, action: PayloadAction<string>) => {
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
    clearProjectFilters: () => {
      return { filters: { mode: "and", root: {} } };
    },
  },
  extraReducers: {},
});

export const projectCenterFiltersReducer = slice.reducer;
export const { updateProjectFilter, removeProjectFilter, clearProjectFilters } =
  slice.actions;

export const selectFilters = (state: AppState): FilterSet | undefined =>
  state.filters;

export const selectFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => {
  console.log("state", state);
  return state.filters?.root[name];
};
