import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";

// WIP: refactor useGenesTable
interface TableResponse {
  //todo
  something: any;
}

export interface TableData {
  //todo
  another: any;
}

export const tableApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTable: builder.query({
      query: (request: { pageSize: number; offset: number; filters: any }) => ({
        graphQLQuery: `
        query GeneTable(
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
                  hits(case_filters: 0, filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(case_filters: 0, filters: $geneCaseFilter) {
                    total
                  }
                }
                cnvCases: cases {
                  hits(case_filters: 0, filters: $cnvTested) {
                    total
                  }
                }
                genes {
                  hits(
                    first: $genesTable_size
                    offset: $genesTable_offset
                    filters: $genesTable_filters
                    score: $score
                    sort: $sort
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
          }`,
        graphQLFilters: {
          genesTable_filters: request.filters ? request.filters : {},
          genesTable_size: request.pageSize,
          genesTable_offset: request.offset,
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
              ...[
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["ssm"],
                  },
                  op: "in",
                },
              ],
              ...request.filters,
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
              ...[
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["cnv"],
                  },
                  op: "in",
                },
              ],
              ...request.filters,
            ],
          },
          cnvGainFilters: {
            op: "and",
            content: [
              ...[
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["cnv"],
                  },
                  op: "in",
                },
                {
                  content: {
                    field: "cnvs.cnv_change",
                    value: ["Gain"],
                  },
                  op: "in",
                },
              ],
              ...request.filters,
            ],
          },
          cnvLossFilters: {
            op: "and",
            content: [
              ...[
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["cnv"],
                  },
                  op: "in",
                },
                {
                  content: {
                    field: "cnvs.cnv_change",
                    value: ["Loss"],
                  },
                  op: "in",
                },
              ],
              ...request.filters,
            ],
          },
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<TableResponse>,
      ): TableData => {
        return { another: response } as TableData;
      },
    }),
  }),
});

export const { useGetGeneTableQuery } = tableApiSlice;
