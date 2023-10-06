import {
  graphqlAPISlice,
  graphqlAPI,
  GraphQLApiResponse,
} from "../gdcapi/gdcgraphql";

const geneSetCountQuery = `query geneSetCounts(
  $filters: FiltersArgument
) {
  viewer {
    explore {
      genes {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    }
  }
}
`;

const transformGeneSetCountResponse = (
  response: GraphQLApiResponse<any>,
): number => {
  return response.data.viewer.explore.genes.hits.total;
};

const ssmsSetCountQuery = `query ssmSetCounts(
  $filters: FiltersArgument
) {
  viewer {
    explore {
      ssms {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    }
  }
}`;

const transformSsmsSetCountResponse = (
  response: GraphQLApiResponse<any>,
): number => {
  return response.data.viewer.explore.ssms.hits.total;
};

const caseSetCountQuery = `query caseSetCounts(
  $filters: FiltersArgument
) {
  viewer {
    explore {
      cases {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    }
  }
}`;

const transformCaseSetCountResponse = (
  response: GraphQLApiResponse<any>,
): number => {
  return response.data.viewer.explore.cases.hits.total;
};

export const setCountSlice = graphqlAPISlice
  .enhanceEndpoints({ addTagTypes: ["geneSets", "ssmsSets", "caseSets"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      geneSetCount: builder.query({
        query: ({ setId, additionalFilters }) => ({
          graphQLQuery: geneSetCountQuery,
          graphQLFilters: additionalFilters
            ? {
                filters: {
                  content: [
                    {
                      op: "=",
                      content: {
                        field: "genes.gene_id",
                        value: `set_id:${setId}`,
                      },
                    },
                    additionalFilters,
                  ],
                  op: "and",
                },
              }
            : {
                filters: {
                  op: "=",
                  content: {
                    field: "genes.gene_id",
                    value: `set_id:${setId}`,
                  },
                },
              },
        }),
        transformResponse: transformGeneSetCountResponse,
      }),
      geneSetCounts: builder.query<
        Record<string, number>,
        { setIds: string[] }
      >({
        queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
          const counts: Record<string, number> = {};
          for (const setId of _arg.setIds) {
            const result = await fetchWithBQ({
              graphQLQuery: geneSetCountQuery,
              graphQLFilters: {
                filters: {
                  op: "=",
                  content: {
                    field: "genes.gene_id",
                    value: `set_id:${setId}`,
                  },
                },
              },
            });
            if (result.error) {
              return { error: result.error };
            } else {
              counts[setId as string] = transformGeneSetCountResponse(
                result.data as GraphQLApiResponse<any>,
              );
            }
          }

          return { data: counts };
        },
      }),
      ssmSetCount: builder.query({
        query: ({ setId, additionalFilters }) => ({
          graphQLQuery: ssmsSetCountQuery,
          graphQLFilters: additionalFilters
            ? {
                filters: {
                  content: [
                    {
                      op: "=",
                      content: {
                        field: "ssms.ssm_id",
                        value: `set_id:${setId}`,
                      },
                    },
                    additionalFilters,
                  ],
                  op: "and",
                },
              }
            : {
                filters: {
                  op: "=",
                  content: {
                    field: "ssms.ssm_id",
                    value: `set_id:${setId}`,
                  },
                },
              },
        }),
        transformResponse: transformSsmsSetCountResponse,
      }),
      ssmSetCounts: builder.query<Record<string, number>, { setIds: string[] }>(
        {
          queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
            const counts: Record<string, number> = {};
            for (const setId of _arg.setIds) {
              const result = await fetchWithBQ({
                graphQLQuery: ssmsSetCountQuery,
                graphQLFilters: {
                  filters: {
                    op: "=",
                    content: {
                      field: "ssms.ssm_id",
                      value: `set_id:${setId}`,
                    },
                  },
                },
              });
              if (result.error) {
                return { error: result.error };
              } else {
                counts[setId as string] = transformSsmsSetCountResponse(
                  result.data as GraphQLApiResponse<any>,
                );
              }
            }

            return { data: counts };
          },
        },
      ),
      caseSetCount: builder.query({
        query: ({ setId, additionalFilters }) => ({
          graphQLQuery: `query caseSetCounts(
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              cases {
                hits(filters: $filters, first: 0) {
                  total
                }
              }
            }
          }
        }
        `,
          graphQLFilters: additionalFilters
            ? {
                filters: {
                  content: [
                    {
                      op: "=",
                      content: {
                        field: "cases.case_id",
                        value: `set_id:${setId}`,
                      },
                    },
                    additionalFilters,
                  ],
                  op: "and",
                },
              }
            : {
                filters: {
                  op: "=",
                  content: {
                    field: "cases.case_id",
                    value: `set_id:${setId}`,
                  },
                },
              },
        }),
        transformResponse: transformCaseSetCountResponse,
      }),
      caseSetCounts: builder.query<
        Record<string, number>,
        { setIds: string[] }
      >({
        queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
          const counts: Record<string, number> = {};
          for (const setId of _arg.setIds) {
            const result = await fetchWithBQ({
              graphQLQuery: caseSetCountQuery,
              graphQLFilters: {
                filters: {
                  op: "=",
                  content: {
                    field: "cases.case_id",
                    value: `set_id:${setId}`,
                  },
                },
              },
            });
            if (result.error) {
              return { error: result.error };
            } else {
              counts[setId as string] = transformCaseSetCountResponse(
                result.data as GraphQLApiResponse<any>,
              );
            }
          }
          return { data: counts };
        },
      }),
    }),
  });

export const setCountQueryFactory = async (
  field: string,
  filters: Record<string, any>,
): Promise<number | undefined> => {
  let setCount;
  let response;
  switch (field) {
    case "genes.gene_id":
      response = await graphqlAPI(geneSetCountQuery, filters);
      setCount = transformGeneSetCountResponse(response);
      break;
    case "ssms.ssm_id":
      response = await graphqlAPI(ssmsSetCountQuery, filters);
      setCount = transformSsmsSetCountResponse(response);
      break;
    case "cases.case_id":
      response = await graphqlAPI(caseSetCountQuery, filters);
      setCount = transformCaseSetCountResponse(response);
      break;
  }

  return Promise.resolve(setCount);
};

export const {
  useGeneSetCountQuery,
  useGeneSetCountsQuery,
  useSsmSetCountQuery,
  useSsmSetCountsQuery,
  useCaseSetCountQuery,
  useCaseSetCountsQuery,
} = setCountSlice;
