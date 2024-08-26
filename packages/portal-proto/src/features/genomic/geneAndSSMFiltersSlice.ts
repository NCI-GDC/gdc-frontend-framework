import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { Operation, FilterSet, isOperandsType } from "@gff/core";
import { AppState } from "./appApi";

const initialState: FilterSet = {
  mode: "and",
  root: {
    "genes.is_cancer_gene_census": {
      field: "genes.is_cancer_gene_census",
      operator: "includes",
      operands: ["true"],
    },
  },
};

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
      return { mode: "and", root: initialState.root };
    },
  },
});

export const geneFrequencyFiltersReducer = slice.reducer;
export const {
  updateGeneAndSSMFilter,
  removeGeneAndSSMFilter,
  clearGeneAndSSMFilters,
} = slice.actions;

export const selectGeneAndSSMFilters = (
  state: AppState,
): FilterSet | undefined => state.filters;

export const selectGeneAndSSMFiltersByName = (
  state: AppState,
  name: string,
): Operation | undefined => {
  return state.filters.root?.[name];
};

export const selectFiltersAppliedCount = (state: AppState): number => {
  console.log(
    state.filters.root,
    initialState.root,
    isEqual(state.filters.root, initialState.root),
  );
  return Object.values(state.filters.root)
    .filter(
      (f) => !isEqual(f, initialState.root["genes.is_cancer_gene_census"]),
    )
    .reduce((a, b) => (isOperandsType(b) ? b?.operands.length : 1) + a, 0);
};

export const selectGeneAndSSMFiltersByNames = (
  state: AppState,
  names: ReadonlyArray<string>,
): Record<string, Operation> =>
  names.reduce((obj, name) => {
    obj[name] = state.filters.root?.[name];
    return obj;
  }, {});
