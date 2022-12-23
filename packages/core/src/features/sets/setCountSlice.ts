import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const setCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    geneSetCount: builder.query({
      query: ({ setId }) => ({
        graphQLQuery: `query geneSetCounts(
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
      }),
      transformResponse: (response) =>
        response.data.viewer.explore.genes.hits.total,
    }),
    ssmSetCount: builder.query({
      query: ({ setId }) => ({
        graphQLQuery: `query ssmSetCounts(
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
      }),
      transformResponse: (response) =>
        response.data.viewer.explore.ssms.hits.total,
    }),
  }),
});

export const { useGeneSetCountQuery, useSsmSetCountQuery } = setCountSlice;
