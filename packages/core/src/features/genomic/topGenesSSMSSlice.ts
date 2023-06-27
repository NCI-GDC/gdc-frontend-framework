import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CoreDataSelectorResponse,
  createUseFiltersCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import {
  buildCohortGqlOperator,
  FilterSet,
  joinFilters,
  selectCurrentCohortFilterSet,
} from "../cohort";

const TopGeneFrequencyQuery = `
query TopGeneQuery (
  $ssmTested: FiltersArgument
  $ssmCaseFilter: FiltersArgument
  $topTable_size: Int
  $consequenceFilters: FiltersArgument
  $topTable_offset: Int
  $topTable_filters: FiltersArgument
  $caseFilters: FiltersArgument
  $ssmsScore: String
  $ssmsSort: [Sort]
  $geneScore: String
) {
  viewer {
    explore {
        genes {
            hits(first: $topTable_size, offset: $topTable_offset, case_filters: $caseFilters, filters: $topTable_filters, score: $geneScore) {
              total
              edges {
                node {
                  id
                  numCases: score
                  symbol
                  name
                  gene_id
                }
              }
            }
          }
      ssms {
        hits(first: $topTable_size, offset: $topTable_offset, case_filters: $caseFilters, filters: $topTable_filters, score: $ssmsScore, sort: $ssmsSort) {
          total
          edges {
            node {
              id
              score
              genomic_dna_change
              mutation_subtype
              ssm_id
              consequence {
                hits(first: 1, filters: $consequenceFilters) {
                  edges {
                    node {
                      transcript {
                        consequence_type
                        gene {
                          gene_id
                          symbol
                        }
                        aa_change
                      }
                    }
                  }
                }
              }
              filteredOccurences: occurrence {
                hits(first: 0, filters: $ssmCaseFilter) {
                  total
                }
              }
              occurrence {
                hits(first: 0, filters: $ssmTested) {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export interface GeneSSMSEntry {
  genes: {
    readonly name: string;
    readonly symbol: string;
  };
  ssms: {
    readonly name: string;
    readonly symbol: string;
    readonly aa_change?: string;
    readonly consequence_type: string;
  };
}

export interface FetchTopGeneProps {
  cohortFilters: FilterSet;
  genomicFilters: FilterSet;
  isDemoMode: boolean;
  overwritingDemoFilter: FilterSet;
}

export const fetchTopGene = createAsyncThunk<
  GraphQLApiResponse,
  FetchTopGeneProps, // additional local filters
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/topGene",
  async ({
    cohortFilters,
    genomicFilters,
    isDemoMode,
    overwritingDemoFilter,
  }: FetchTopGeneProps): Promise<GraphQLApiResponse> => {
    const filters = isDemoMode
      ? buildCohortGqlOperator(
          joinFilters(overwritingDemoFilter, genomicFilters),
        )
      : buildCohortGqlOperator(genomicFilters);
    const filterContents = filters?.content ? Object(filters?.content) : [];

    const graphQlVariables = {
      ssmTested: {
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
      ssmCaseFilter: {
        content: [
          ...[
            {
              content: {
                field: "available_variation_data",
                value: ["ssm"],
              },
              op: "in",
            },
          ],
          ...filterContents,
        ],
        op: "and",
      },
      topTable_size: 1,
      consequenceFilters: {
        content: [
          {
            content: {
              field: "consequence.transcript.is_canonical",
              value: ["true"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
      topTable_offset: 0,
      topTable_filters: filters ?? {},
      caseFilters: buildCohortGqlOperator(cohortFilters) ?? {},
      ssmsScore: "occurrence.case.project.project_id",
      geneScore: "case.project.project_id",
      ssmsSort: [
        {
          field: "_score",
          order: "desc",
        },
        {
          field: "_uid",
          order: "asc",
        },
      ],
    };

    return graphqlAPI(TopGeneFrequencyQuery, graphQlVariables);
  },
);

export interface TopGeneState {
  readonly top: ReadonlyArray<GeneSSMSEntry>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: TopGeneState = {
  top: [],
  status: "uninitialized",
};

const slice = createSlice({
  name: "genomicApp/fetchTopGene",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopGene.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }
        const data = response.data.viewer.explore;
        //  Note: change this to the field parameter
        const genes = data.genes.hits.edges.map(
          ({ node }: Record<string, never>) =>
            (({ gene_id, numCases, symbol, name }) => ({
              gene_id,
              numCases,
              symbol,
              name,
            }))(node),
        );

        const ssms = data.ssms.hits.edges.map(({ node }: Record<any, any>) => {
          return {
            ssm_id: node.ssm_id,
            score: node.score,
            mutation_subtype: node.mutation_subtype,
            genomic_dna_change: node.genomic_dna_change,
            occurrence: node.occurrence.hits.total,
            filteredOccurrences: node.filteredOccurences.hits.total,
            consequence: node.consequence.hits.edges.map(
              (y: Record<any, any>) => {
                const transcript = y.node.transcript;
                return {
                  id: y.node.id,
                  is_canonical: transcript.is_canonical,
                  aa_change: transcript.aa_change,
                  consequence_type: transcript.consequence_type,
                  gene: { ...transcript.gene },
                };
              },
            ),
          };
        });

        state = {
          top: [
            {
              genes: {
                name: genes[0]?.name,
                symbol: genes[0]?.symbol,
              },
              ssms: {
                symbol: ssms[0]?.ssm_id,
                name: ssms[0]?.consequence[0]?.gene?.symbol,
                aa_change: ssms[0]?.consequence[0]?.aa_change,
                consequence_type: ssms[0]?.consequence[0]?.consequence_type,
              },
            },
          ],
          status: "fulfilled",
          error: undefined,
        };
        return state;
      })
      .addCase(fetchTopGene.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchTopGene.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const topGeneReducer = slice.reducer;

export const selectTopGeneState = (state: CoreState): TopGeneState =>
  state.genomic.topGeneSSMS;

export const selectTopGeneData = (
  state: CoreState,
): CoreDataSelectorResponse<GeneSSMSEntry[]> => {
  return {
    data: [...state.genomic.topGeneSSMS.top],
    status: state.genomic.topGeneSSMS.status,
    error: state.genomic.topGeneSSMS.error,
  };
};

export const useTopGene = createUseFiltersCoreDataHook(
  fetchTopGene,
  selectTopGeneData,
  selectCurrentCohortFilterSet, // used only to trigger a fetch
);
