import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet, isOperandsType } from "@gff/core";
import { AppState } from "./appApi";

export interface AnnotationCenterFiltersState {
  readonly filters: FilterSet;
}

const initialState: AnnotationCenterFiltersState = {
  filters: { mode: "and", root: {} },
};

const slice = createSlice({
  name: "annotationCenter/filters",
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
  state.annotationBrowserFilterState.filters;

export const selectAnnotationFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => {
  return state.annotationBrowserFilterState.filters.root[name];
};

export const selectFiltersAppliedCount = (state: AppState): number =>
  Object.values(state.annotationBrowserFilterState.filters.root).reduce(
    (a, b) => (isOperandsType(b) ? b?.operands.length : 1) + a,
    0,
  );
