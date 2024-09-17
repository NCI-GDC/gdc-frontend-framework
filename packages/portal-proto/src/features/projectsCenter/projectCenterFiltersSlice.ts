import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet, isOperandsType } from "@gff/core";
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
});

export const projectCenterFiltersReducer = slice.reducer;
export const { updateProjectFilter, removeProjectFilter, clearProjectFilters } =
  slice.actions;

export const selectFilters = (state: AppState): FilterSet | undefined =>
  state.projectApp.filters;

export const selectFiltersAppliedCount = (state: AppState): number =>
  Object.values(state.projectApp.filters.root).reduce(
    (a, b) => (isOperandsType(b) ? b?.operands.length : 1) + a,
    0,
  );

export const selectProjectFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => {
  return state.projectApp.filters.root[name];
};
