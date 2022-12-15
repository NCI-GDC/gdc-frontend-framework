import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

interface SetGeneInfoResponse {
  data: {
    viewer: {
      explore: {
        genes: {
          hits: {
            total: number;
            edges: { node: { gene_id: string } }[];
          };
        };
      };
    };
  };
}

interface SetSsmsInfoResponse {
  data: {
    viewer: {
      explore: {
        ssms: {
          hits: {
            total: number;
            edges: { node: { ssm_id: string } }[];
          };
        };
      };
    };
  };
}

export const setInfoSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    geneSetInfo: builder.query<
      Record<string, { count: number; ids: string[] }>,
      { setIds: string[] }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: Record<string, { count: number; ids: string[] }> = {};

        for (const setId of arg.setIds) {
          const result = await fetchWithBQ({
            graphQLQuery: `query geneSetInfo(
                $filters: FiltersArgument
              ) {
              viewer {
                explore {
                  genes {
                    hits(filters: $filters, first: 50000) {
                      total
                      edges {
                        node {
                          gene_id
                        }
                      }
                    }
                  }
                }
              }
            }
         `,
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
            results = {
              ...results,
              [setId]: {
                count: (result.data as SetGeneInfoResponse).data.viewer.explore
                  .genes.hits.total,
                ids: (
                  result.data as SetGeneInfoResponse
                ).data.viewer.explore.genes.hits.edges.map(
                  (node) => node.node.gene_id,
                ),
              },
            };
          }
        }

        return { data: results };
      },
    }),
    ssmsSetInfo: builder.query<
      Record<string, { count: number; ids: string[] }>,
      { setIds: string[] }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: Record<string, { count: number; ids: string[] }> = {};

        for (const setId of arg.setIds) {
          const result = await fetchWithBQ({
            graphQLQuery: `query ssmSetInfo(
                $filters: FiltersArgument
              ) {
              viewer {
                explore {
                  ssms {
                    hits(filters: $filters, first: 50000) {
                      total
                      edges {
                        node {
                          ssm_id
                        }
                      }
                    }
                  }
                }
              }
            }
         `,
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
            results = {
              ...results,
              [setId]: {
                count: (result.data as SetSsmsInfoResponse).data.viewer.explore
                  .ssms.hits.total,
                ids: (
                  result.data as SetSsmsInfoResponse
                ).data.viewer.explore.ssms.hits.edges.map(
                  (node) => node.node.ssm_id,
                ),
              },
            };
          }
        }

        return { data: results };
      },
    }),
  }),
});

export const { useGeneSetInfoQuery, useSsmsSetInfoQuery } = setInfoSlice;
