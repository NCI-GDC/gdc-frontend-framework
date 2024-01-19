import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseFiltersCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { castDraft } from "immer";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import { GenomicTableProps } from "./types";
import {
  buildCohortGqlOperator,
  selectCurrentCohortFilterSet,
} from "../cohort";

const GeneMutationFrequencyQuery = `
    query GeneMutationFrequencyChart (
      $geneCaseFilter: FiltersArgument
      $geneFrequencyChart_filters: FiltersArgument
      $geneFrequencyChart_size: Int
      $geneFrequencyChart_offset: Int
      $score: String
    ) {
      geneFrequencyChartViewer: viewer {
        explore {
          cases {
            hits(first: 0, case_filters: $geneCaseFilter) {
              total
            }
          }
          genes {
            hits(first: $geneFrequencyChart_size, offset: $geneFrequencyChart_offset, case_filters: $geneCaseFilter, filters: $geneFrequencyChart_filters, score: $score) {
              total
              edges {
                node {
                  id
                  numCases: score
                  symbol
                  name
                  biotype
                  gene_id
                  is_cancer_gene_census
                }
              }
            }
          }
        }
      }
    }
`;

export interface GeneFrequencyEntry {
  readonly gene_id: string;
  readonly numCases: number;
  readonly symbol: string;
}

export interface GenesFrequencyChart {
  readonly geneCounts: ReadonlyArray<GeneFrequencyEntry>;
  readonly casesTotal: number;
  readonly genesTotal: number;
}

export const fetchGeneFrequencies = createAsyncThunk<
  GraphQLApiResponse,
  GenomicTableProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/geneFrequencyChart",
  async ({
    pageSize = 20,
    offset = 0,
    genomicFilters,
    cohortFilters,
  }: GenomicTableProps): Promise<GraphQLApiResponse> => {
    const caseFilters = buildCohortGqlOperator(cohortFilters);
    const cohortFiltersContent = caseFilters?.content
      ? Object(caseFilters?.content)
      : [];

    const graphQlVariables = {
      geneFrequencyChart_filters: buildCohortGqlOperator(genomicFilters) ?? {},
      geneFrequencyChart_size: pageSize,
      geneFrequencyChart_offset: offset,
      geneCaseFilter: {
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
          ...cohortFiltersContent,
        ],
        op: "and",
      },
      score: "case.project.project_id",
    };

    return await graphqlAPI(GeneMutationFrequencyQuery, graphQlVariables);
  },
);

export interface GeneFrequencyChartState {
  readonly frequencies: GenesFrequencyChart;
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: string;
}

const initialState: GeneFrequencyChartState = {
  frequencies: { casesTotal: 0, genesTotal: 0, geneCounts: [] },
  status: "uninitialized",
};

const slice = createSlice({
  name: "genomic/geneFrequencyChart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneFrequencies.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }

        const data = response.data.geneFrequencyChartViewer.explore;
        //  Note: change this to the field parameter
        state.frequencies.casesTotal = data.cases.hits.total;
        state.frequencies.genesTotal = data.genes.hits.total;
        state.frequencies.geneCounts = data.genes.hits.edges.map(
          ({ node }: Record<string, never>) =>
            (({ gene_id, numCases, symbol }) => ({
              gene_id,
              numCases,
              symbol,
            }))(node),
        );

        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchGeneFrequencies.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchGeneFrequencies.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const geneFrequencyChartReducer = slice.reducer;

export const selectGeneFrequencyChartState = (
  state: CoreState,
): GeneFrequencyChartState => state.genomic.geneFrequencyChart;

export const selectGeneFrequencyChartData = (
  state: CoreState,
): CoreDataSelectorResponse<GenesFrequencyChart> => {
  return {
    data: state.genomic.geneFrequencyChart.frequencies,
    status: state.genomic.geneFrequencyChart.status,
    error: state.genomic.geneFrequencyChart.error,
  };
};

export const useGeneFrequencyChart = createUseFiltersCoreDataHook(
  fetchGeneFrequencies,
  selectGeneFrequencyChartData,
  selectCurrentCohortFilterSet,
);
