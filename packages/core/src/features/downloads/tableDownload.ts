import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";

interface DownloadResponse {
  something: any;
}

// todo: 1 for tsv, 1 for json format

export interface TableDownloadData {
  else: any;
}

export type DownloadData = Partial<TableDownloadData>;

export const tableDownloadApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTableDownload: builder.query({
      query: (request: {}) => ({
        graphQLQuery: `
            query GenesTable(
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
              $sort: [Sort]
            ) {
              genesTableDownloadViewer: viewer {
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
            }
  `,
        graphQLFilters: {},
      }),
    }),
    // getSomaticMutationTableDownload: builder.query({
    //     query: (request: {
    //         // todo
    //      }) => ({
    //     graphQLQuery: ``,
    //     graphQLFilters: {},
    //     }),
    //     transformResponse: (
    //         response: GraphQLApiResponse<DownloadResponse>,
    //       ): TableDownloadData[] => {
    //           return response as unknown as TableDownloadData[];
    //       }
    // }),
  }),
});

export const {
  useGetGeneTableDownloadQuery,
  // useGetSomaticMutationTableDownloadQuery,
} = tableDownloadApiSlice;
