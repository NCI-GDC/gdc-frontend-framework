/**
 * Genomic Filters are designed to be local
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GqlOperation, Operation } from "../gdcapi/filters";
import { CoreState } from "../../reducers";
import { buildCohortGqlOperator, FilterSet, joinFilters } from "../cohort";
import { selectCurrentCohortFilters } from "../cohort";

const initialState: FilterSet = {
  mode: "and",
  root: {
    "genes.is_cancer_gene_census": {
      field: "genes.is_cancer_gene_census",
      operator: "includes",
      operands: ["true"], // TODO: this will be fixed when toggle facets are implemented
    },
  },
};

const slice = createSlice({
  name: "genomic/filters",
  initialState,
  reducers: {
    updateGenomicFilter: (
      state,
      action: PayloadAction<{ field: string; operation: Operation }>,
    ) => {
      return {
        ...state,
        root: {
          ...state.root,
          [action.payload.field]: action.payload.operation,
        },
      };
    },
    removeGenomicFilter: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _unused, ...updated } = state.root;
      return {
        ...state,
        root: updated,
      };
    },
    clearGenomicFilters: (state) => {
      return { ...state, root: initialState.root };
    },
  },
});

export const genomicFilterReducer = slice.reducer;
export const { updateGenomicFilter, removeGenomicFilter, clearGenomicFilters } =
  slice.actions;

export const selectGenomicFilters = (state: CoreState): FilterSet =>
  state.genomic.filters;

export const selectGenomicGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.genomic.filters);
};

/**
 * merges the current cohort with genomic filters (really ANY FilterSet)
 * @param state - CoreState
 * @param genomicFilters - FilterSet to merge
 */
export const mergeGenomicAndCohortFilters = (
  state: CoreState,
  genomicFilters: FilterSet,
): FilterSet => joinFilters(selectCurrentCohortFilters(state), genomicFilters);

/**
 * Deprecated
 */
export const selectGenomicAndCohortFilters = (state: CoreState): FilterSet =>
  mergeGenomicAndCohortFilters(state, state.genomic.filters);
/**
 * Deprecated
 */
export const selectGenomicAndCohortGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  return buildCohortGqlOperator(selectGenomicAndCohortFilters(state));
};
/**
 * Deprecated
 */
export const selectGenomicFiltersByName = (
  state: CoreState,
  name: string,
): Operation | undefined => state.genomic.filters?.root[name];
