import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet } from "@gff/core";
import { AppState } from "./appApi";

export interface GeneAndSSMFiltersState {
  readonly filters: FilterSet;
}

const initialState: FilterSet = { mode: "and", root: {} };

const slice = createSlice({
  name: "geneFrequencyApp/filters",
  initialState,
  reducers: {
    updateGeneAndSSMFilter: (
      state,
      action: PayloadAction<{ field: string; operation: Operation }>,
    ) => {
      return {
        mode: "and",
        root: {
          ...state.root,
          [action.payload.field]: action.payload.operation,
        },
      };
    },
    removeGeneAndSSMFilter: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...updated } = state.root;
      return {
        mode: "and",
        root: updated,
      };
    },
    clearGeneAndSSMFilters: () => {
      return { mode: "and", root: {} };
    },
  },
  extraReducers: {},
});

export const geneFrequencyFiltersReducer = slice.reducer;
export const {
  updateGeneAndSSMFilter,
  removeGeneAndSSMFilter,
  clearGeneAndSSMFilters,
} = slice.actions;

export const selectFilters = (state: AppState): FilterSet | undefined =>
  state.filters;

export const selectGeneAndSSMFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => {
  return state.filters.root?.[name];
};
