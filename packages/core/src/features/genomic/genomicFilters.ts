import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GqlOperation, Operation } from "../gdcapi/filters";
import { CoreState } from "../../store";
import { buildCohortGqlOperator, FilterSet, joinFilters } from "../cohort/cohortFilterSlice";


const initialState: FilterSet = {
  mode: "and",
  root: { "genes.is_cancer_gene_census" :
      { field: "genes.is_cancer_gene_census",
        operator: "includes",
        operands:["true"] // TODO: this will be fixed when boolean facets are implemented
      }
  }
};

const slice = createSlice({
  name: "genomic/filters",
  initialState,
  reducers: {
    updateGenomicFilter: (state, action: PayloadAction<{  field:string, operation:Operation }>) => {
      return {
        ...state,
          root: { ...state.root, [action.payload.field]: action.payload.operation },
        };
    },
    removeGenomicFilter: (state, action: PayloadAction<string>)  => {
      const { [action.payload]: _, ...updated} = state.root;
      return {
        ...state,
          root: updated,
        }
    },
    clearGenomicFilters: (state) => {
      return { ...state, root: initialState.root };
    },
  },
  extraReducers: {},
});

export const genomicFilterReducer = slice.reducer;
export const { updateGenomicFilter, removeGenomicFilter, clearGenomicFilters } = slice.actions;

export const selectGenomicFilters = (state: CoreState): FilterSet =>
  state.genomic.filters;

export const selectGenomicGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.genomic.filters);
};

export const selectGenomicAndCohortFilters = (state: CoreState): FilterSet => joinFilters(state.cohort.currentFilters.filters, state.genomic.filters)

export const selectGenomicAndCohortGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(joinFilters(state.cohort.currentFilters.filters, state.genomic.filters));
};

export const selectGenomicFiltersByName = (state: CoreState, name: string): Operation | undefined =>
  state.genomic.filters?.root[name];


