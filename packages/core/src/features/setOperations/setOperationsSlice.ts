import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const setOperationSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    setOperationGeneTotal: builder.query({
      query: ({ filters }) => ({
        graphQLQuery: `query setOperationGeneTotal(
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
        }`,
        graphQLFilters: filters,
      }),
      transformResponse: (response) =>
        response.data.viewer.explore.genes.hits.total,
    }),
    setOperationSsmTotal: builder.query({
      query: ({ filters }) => ({
        graphQLQuery: `query setOperationSsmTotal(
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
        }`,
        graphQLFilters: filters,
      }),
      transformResponse: (response) =>
        response.data.viewer.explore.ssms.hits.total,
    }),
    setOperationsCasesTotal: builder.query({
      query: ({ filters }) => ({
        graphQLQuery: `query setOperationCaseTotal (
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
        }`,
        graphQLFilters: filters,
      }),
      transformResponse: (response) =>
        response.data.viewer.explore.cases.hits.total,
    }),
  }),
});

export const {
  useSetOperationGeneTotalQuery,
  useSetOperationSsmTotalQuery,
  useSetOperationsCasesTotalQuery,
} = setOperationSlice;
