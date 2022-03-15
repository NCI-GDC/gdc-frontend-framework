import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseMultipleFiltersCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { castDraft } from "immer";
import { CoreDispatch, CoreState } from "../../store";
import {
  GraphQLApiResponse,
  graphqlAPI,
  TablePageOffsetProps,
} from "../gdcapi/gdcgraphql";
import { selectCurrentCohortFilters } from "../cohort/cohortFilterSlice";
import { selectGenomicAndCohortGqlFilters, selectGenomicFilters } from "./genomicFilters";


const GeneMuatationFrequenceQuery = `
    query GeneMutationFrequency (
      $genesTable_filters: FiltersArgument
      $genesTable_size: Int
      $genesTable_offset: Int
      $score: String
    ) {
      genesTableViewer: viewer {
        explore {
          cases {
            hits(first: 0, filters: $genesTable_filters) {
              total
            }
          }
          genes {
            hits(first: $genesTable_size, offset: $genesTable_offset, filters: $genesTable_filters, score: $score) {
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
  TablePageOffsetProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/geneFrequencyChart",
  async ({
    pageSize = 20,
    offset = 0,
  }: TablePageOffsetProps, thunkAPI): Promise<GraphQLApiResponse> => {
    const filters = selectGenomicAndCohortGqlFilters(thunkAPI.getState());

    const graphQlVariables = {
      genesTable_filters: filters? filters: {},
      genesTable_size: pageSize,
      genesTable_offset: offset,
      score: "case.project.project_id",
    };

    return await graphqlAPI(GeneMuatationFrequenceQuery, graphQlVariables);
  },
);

export interface GeneFrequencyChartState {
  readonly frequencies: GenesFrequencyChart;
  readonly status: DataStatus;
  readonly error?: string;
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
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }
        const data = response.data.genesTableViewer.explore;
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
      .addCase(fetchGeneFrequencies.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchGeneFrequencies.rejected, (state, action) => {
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


export const useGeneFrequencyChart = createUseMultipleFiltersCoreDataHook(fetchGeneFrequencies,
  selectGeneFrequencyChartData,
  selectCurrentCohortFilters,
  selectGenomicFilters);

