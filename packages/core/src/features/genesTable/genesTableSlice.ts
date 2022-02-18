import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { castDraft } from "immer";
import { CoreDispatch, CoreState } from "../../store";
import { fetchSmsAggregations } from "./smsAggregationsApi";
import {
  GraphQLApiResponse,
  graphqlAPI,
  TablePageOffsetProps,
} from "../gdcapi/gdcgraphql";
import { selectCurrentCohortCaseGqlFilters } from "../cohort/cohortFilterSlice";

const GenesTableGraphQLQuery = `
          query GenesTable_relayQuery(
            $genesTable_filters: FiltersArgument
            $genesTable_size: Int
            $genesTable_offset: Int
            $score: String
            $ssmCase: FiltersArgument
            $geneCaseFilter: FiltersArgument
            $ssmTested: FiltersArgument
            $cnvTested: FiltersArgument
            $cnvGainFilters: FiltersArgument
            $cnvLossFilters: FiltersArgument
          ) {
            genesTableViewer: viewer {
              explore {
                cases {
                  hits(first: 0, filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(first: 0, filters: $geneCaseFilter) {
                    total
                  }
                }
                cnvCases: cases {
                  hits(first: 0, filters: $cnvTested) {
                    total
                  }
                }
                genes {
                  hits(
                    first: $genesTable_size
                    offset: $genesTable_offset
                    filters: $genesTable_filters
                    score: $score
                  ) {
                    total
                    edges {
                      node {
                        id
                        numCases: score
                        symbol
                        name
                        cytoband
                        biotype
                        gene_id
                        is_cancer_gene_census
                        ssm_case: case {
                          hits(first: 0, filters: $ssmCase) {
                            total
                          }
                        }
                        cnv_case: case {
                          hits(first: 0, filters: $cnvTested) {
                            total
                          }
                        }
                        case_cnv_gain: case {
                          hits(first: 0, filters: $cnvGainFilters) {
                            total
                          }
                        }
                        case_cnv_loss: case {
                          hits(first: 0, filters: $cnvLossFilters) {
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

export interface GeneRowInfo {
  readonly biotype: string;
  readonly case_cnv_gain: number;
  readonly case_cnv_loss: number;
  readonly cnv_case: number;
  readonly cytoband: ReadonlyArray<string>;
  readonly gene_id: string;
  readonly id: string;
  readonly is_cancer_gene_census: boolean;
  readonly name: string;
  readonly num_cases: number;
  readonly ssm_case: number;
  readonly symbol: string;
}

export interface GDCGenesTable {
  readonly cases: number;
  readonly cnvCases: number;
  readonly filteredCases: number;
  readonly genes: ReadonlyArray<GeneRowInfo>;
  readonly genes_total: number;
  readonly mutationCounts?: Record<string, string>;
}

export const fetchGenesTable = createAsyncThunk<
  GraphQLApiResponse,
  TablePageOffsetProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/genesTable",
  async ({
    pageSize,
    offset,
  }: TablePageOffsetProps, thunkAPI): Promise<GraphQLApiResponse> => {
    const currentFilters =  selectCurrentCohortCaseGqlFilters(thunkAPI.getState());
    console.log(currentFilters);
    const graphQlFilters = {
      genesTable_filters: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.primary_site",
              value: ["kidney"],
            },
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
        ],
      },
      genesTable_size: pageSize,
      genesTable_offset: offset,
      score: "case.project.project_id",
      ssmCase: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
          },
          {
            op: "NOT",
            content: {
              field: "genes.case.ssm.observation.observation_id",
              value: "MISSING",
            },
          },
        ],
      },
      geneCaseFilter: {
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "cases.primary_site",
              value: ["kidney"],
            },
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
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
      cnvTested: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "cases.primary_site",
              value: ["kidney"],
            },
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
        ],
      },
      cnvGainFilters: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "cases.primary_site",
              value: ["kidney"],
            },
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Gain"],
            },
            op: "in",
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
        ],
      },
      cnvLossFilters: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "cases.primary_site",
              value: ["kidney"],
            },
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Loss"],
            },
            op: "in",
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
        ],
      },
    };
    // get the TableData

    const results: GraphQLApiResponse<any> = await graphqlAPI(
      GenesTableGraphQLQuery,
      graphQlFilters,
    );
    // if we have valid data from the table, need to query the mutation counts
    if (!results.errors) {
      // extract the gene ids and user it for the call to
      const geneIds =
        results.data.genesTableViewer.explore.genes.hits.edges.map(
          ({ node }: Record<string, any>) => node.gene_id,
        );
      const counts = await fetchSmsAggregations({ ids: geneIds });
      if (!counts.errors) {
        const countsData =
          counts.data.ssmsAggregationsViewer.explore.ssms.aggregations
            .consequence__transcript__gene__gene_id;
        results.data.genesTableViewer["mutationCounts"] =
          countsData.buckets.reduce(
            (
              counts: Record<string, number>,
              apiBucket: Record<string, any>,
            ) => {
              counts[apiBucket.key] = apiBucket.doc_count;
              return counts;
            },
            {} as Record<string, number>,
          );
      }
    }

    return results;
  },
);

export interface GenesTableState {
  readonly genes: GDCGenesTable;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: GenesTableState = {
  genes: {
    cases: 0,
    filteredCases: 0,
    cnvCases: 0,
    genes: [],
    genes_total: 0,
  },
  status: "uninitialized",
};

// interface GeneNode {
//   readonly node: {
//       readonly gene: {
//         readonly gene_id: string;
//       }
//   }
// }

// interface GeneResponseNode {
//   readonly biotype: string;
//   readonly gene_id: string;
//   readonly id: string;
//   readonly is_cancer_gene_census: boolean;
//   readonly name: string;
//   readonly numCases: number;
//   readonly symbol: string;
// }
//
// interface GeneResponseEdge {
//   readonly node: GeneResponseNode;
// }

const slice = createSlice({
  name: "genes/genesTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenesTable.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }
        const data = action.payload.data.genesTableViewer.explore;
        state.genes.cases = data.cases.hits.total;
        state.genes.cnvCases = data.cnvCases.hits.total;
        state.genes.filteredCases = data.filteredCases.hits.total;
        state.genes.genes_total = data.genes.hits.total;
        state.genes.mutationCounts =
          action.payload.data.genesTableViewer.mutationCounts;
        state.genes.genes = data.genes.hits.edges.map(
          ({ node }: Record<string, any>): GeneRowInfo => {
            const {
              biotype,
              cytoband,
              gene_id,
              id,
              is_cancer_gene_census,
              name,
              num_cases,
              symbol,
            } = node;
            return {
              biotype,
              cytoband,
              gene_id,
              id,
              is_cancer_gene_census,
              name,
              num_cases,
              symbol,
              cnv_case: node.cnv_case.hits.total,
              case_cnv_loss: node.case_cnv_loss.hits.total,
              case_cnv_gain: node.case_cnv_gain.hits.total,
              ssm_case: node.ssm_case.hits.total,
            };
          },
        );

        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchGenesTable.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchGenesTable.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const genesTableReducer = slice.reducer;

export const selectGenesTableState = (state: CoreState): GDCGenesTable =>
  state.genesTable.genes;

export const selectGenesTableData = (
  state: CoreState,
): CoreDataSelectorResponse<GenesTableState> => {
  return {
    data: state.genesTable,
    status: state.genesTable.status,
    error: state.genesTable.error,
  };
};

export const useGenesTable = createUseCoreDataHook(
  fetchGenesTable,
  selectGenesTableData,
);
