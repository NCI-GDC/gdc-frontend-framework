import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "../../coreCreateApi";
import { TableSubrowItem } from "../subrows/tableSubrow";

export interface GraphQLFetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly variables?: Record<string, any>;
}

type UnknownJson = Record<string, any>;

export interface GraphQLApiResponse<H = UnknownJson> {
  readonly data: H;
  readonly errors: Record<string, string>;
}

export interface SortOption {
  field: string;
  order: string;
}

export interface TablePageOffsetProps {
  readonly pageSize?: number;
  readonly offset?: number;
  readonly sorts?: Array<SortOption>;
  readonly searchTerm?: string;
}

const buildGraphQLFetchError = async (
  res: Response,
  variables?: Record<string, any>,
): Promise<GraphQLFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    variables: variables,
  };
};

export const graphqlAPI = async <T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<GraphQLApiResponse<T>> => {
  const res = await fetch(`${GDC_APP_API_AUTH}/graphql`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (res.ok) return res.json();

  throw await buildGraphQLFetchError(res, variables);
};

export interface GraphqlApiSliceRequest {
  readonly graphQLQuery: string;
  readonly graphQLFilters: Record<string, unknown>;
}

export const graphqlAPISlice = coreCreateApi({
  reducerPath: "graphql",
  baseQuery: async (request: GraphqlApiSliceRequest) => {
    let results: GraphQLApiResponse<any>;

    try {
      results = await graphqlAPI(request.graphQLQuery, request.graphQLFilters);
    } catch (e) {
      return { error: e };
    }

    return { data: results };
  },
  endpoints: (builder) => ({
    mutationFreqDL: builder.query<
      Record<string, { geneIds: string[] }>,
      { geneIds: string[] }
    >({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // todo: pass pageSize, offset & other filters as params to this endpt
        const tableQuery = await fetchWithBQ({
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
            }`,
          graphQLFilters: {
            genesTable_filters: {},
            // request.filters ? request.filters : {},
            genesTable_size: 10,
            // request.pageSize,
            genesTable_offset: 0,
            // request.offset,
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
                // ...request.filters,
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
                // ...request.filters,
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
                // ...request.filters,
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
                // ...request.filters,
              ],
            },
          },
        });

        let results: Record<string, unknown> = {};

        for (const geneId of _arg.geneIds) {
          const result = await fetchWithBQ({
            graphQLQuery: `
                        query GeneTableSubrow(
                            $filters_case: FiltersArgument
                            $filters_gene: FiltersArgument
                        ) {
                            explore {
                                cases {
                                  denominators: aggregations(filters: $filters_case) {
                                    project__project_id {
                                        buckets {
                                            key
                                            doc_count
                                        }
                                    }
                                  }
                                    numerators: aggregations(filters: $filters_gene) {
                                        project__project_id {
                                            buckets {
                                                doc_count
                                                key
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        `,
            graphQLFilters: {
              filters_case: {
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
              filters_gene: {
                op: "and",
                content: [
                  {
                    content: {
                      field: "genes.gene_id",
                      value: [geneId],
                    },
                    op: "in",
                  },
                  {
                    op: "NOT",
                    content: {
                      field: "cases.gene.ssm.observation.observation_id",
                      value: "MISSING",
                    },
                  },
                ],
              },
            },
          });
          if (result.error) {
            return { error: result.error };
          } else {
            results = {
              ...results,
              [geneId]: {
                denominators: result.data as unknown as TableSubrowItem,
                numerators: result.data as unknown as TableSubrowItem,
              },
            };
          }
        }
        console.log(tableQuery);
        return { data: results };
      },
    }),
  }),
});

export const graphqlAPISliceMiddleware =
  graphqlAPISlice.middleware as Middleware;
export const graphqlAPISliceReducerPath: string = graphqlAPISlice.reducerPath;
export const graphqlAPIReducer: Reducer = graphqlAPISlice.reducer as Reducer;
