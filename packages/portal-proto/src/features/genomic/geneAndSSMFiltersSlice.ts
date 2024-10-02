import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { Operation, FilterSet, isOperandsType } from "@gff/core";
import { AppState } from "./appApi";
import { GENE_AND_MUTATION_FIELDS } from "./constants";

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
    removeAllNonSetFilters: (state) => {
      return {
        mode: "and",
        root: {
          ...Object.fromEntries(
            Object.entries(state.root).filter(([key]) =>
              GENE_AND_MUTATION_FIELDS.includes(key),
            ),
          ),
        },
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
  removeAllNonSetFilters,
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
  const appliedFilterCount = Object.values(state.filters.root)
    .filter(
      (f) => !isEqual(f, initialState.root["genes.is_cancer_gene_census"]),
    )
    .reduce((a, b) => (isOperandsType(b) ? b?.operands.length : 1) + a, 0);

  // If cancer_gene_census filter isn't present, count that as one since the filter starts out true
  return state.filters.root["genes.is_cancer_gene_census"]
    ? appliedFilterCount
    : appliedFilterCount + 1;
};

export const selectGeneAndSSMFiltersByNames = (
  state: AppState,
  names: ReadonlyArray<string>,
): Record<string, Operation> =>
  names.reduce((obj, name) => {
    obj[name] = state.filters.root?.[name];
    return obj;
  }, {});
