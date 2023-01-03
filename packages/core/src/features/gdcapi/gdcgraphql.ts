import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "../../coreCreateApi";
// import { TableSubrowItem } from "../subrows/tableSubrow";
import { SubrowResponse } from "../subrows/tableSubrow";

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
      { geneIds: string[]; tableData: any }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: Record<string, any> = {};

        for (const geneId of arg.geneIds) {
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
            console.log("td", arg.tableData);
            console.log("result", result.data);
            debugger;
            results = {
              ...results,
              [geneId]: {
                numerators: (result.data as unknown as SubrowResponse).explore
                  .cases.denominators.project__project_id,
                denominators: (result.data as unknown as SubrowResponse).explore
                  .cases.denominators.project__project_id,
              },
            };
          }
        }

        return { data: results };
      },
    }),
  }),
});

export const graphqlAPISliceMiddleware =
  graphqlAPISlice.middleware as Middleware;
export const graphqlAPISliceReducerPath: string = graphqlAPISlice.reducerPath;
export const graphqlAPIReducer: Reducer = graphqlAPISlice.reducer as Reducer;
