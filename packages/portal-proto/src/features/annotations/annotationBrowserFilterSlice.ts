import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet } from "@gff/core";
import { AppState } from "./appApi";

export interface AnnotationCenterFiltersState {
  readonly filters: FilterSet;
}

const initialState: AnnotationCenterFiltersState = {
  filters: { mode: "and", root: {} },
};

const slice = createSlice({
  name: "AnnotationCenter/filters",
  initialState,
  reducers: {
    updateAnnotationFilter: (
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
    removeAnnotationFilter: (state, action: PayloadAction<string>) => {
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
    clearAnnotationFilters: () => {
      return { filters: { mode: "and", root: {} } };
    },
  },
});

export const annotationBrowserReducer = slice.reducer;
export const {
  updateAnnotationFilter,
  removeAnnotationFilter,
  clearAnnotationFilters,
} = slice.actions;

export const selectFilters = (state: AppState): FilterSet | undefined =>
  state.filters;

export const selectAnnotationFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => {
  return state.filters.root[name];
};
