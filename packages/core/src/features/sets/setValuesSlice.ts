import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const setValuesSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    geneSetValues: builder.query({
      query: ({ setId }) => ({
        graphQLQuery: `
        query setInfo(
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              genes {
                hits(filters: $filters, first: 50000) {
                  edges {
                    node {
                      gene_id
                    }
                  }
                }
              }
            }
          }
        }`,
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
      transformResponse: (response) => response.data.viewer.explore.genes.hits,
    }),
    ssmSetValues: builder.query({
      query: ({ setId }) => ({
        graphQLQuery: `
        query setInfo(
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              ssms {
                hits(filters: $filters, first: 50000) {
                  edges {
                    node {
                      ssm_id
                    }
                  }
                }
              }
            }
          }
        }`,
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
      transformResponse: (response) => response.data.viewer.explore.genes.hits,
    }),
  }),
});

export const { useGeneSetValuesQuery, useSsmSetValuesQuery } = setValuesSlice;
