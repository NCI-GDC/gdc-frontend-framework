import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const setCountSlice = graphqlAPISlice
  .enhanceEndpoints({ addTagTypes: ["geneSets", "ssmsSets", "caseSets"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      geneSetCount: builder.query({
        query: ({ setId, additionalFilters }) => ({
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
        transformResponse: (response) =>
          response.data.viewer.explore.genes.hits.total,
        providesTags: (_result, _error, arg) => [
          { type: "geneSets", id: arg.setId },
        ],
      }),
      ssmSetCount: builder.query({
        query: ({ setId, additionalFilters }) => ({
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
        transformResponse: (response) =>
          response.data.viewer.explore.ssms.hits.total,
        providesTags: (_result, _error, arg) => [
          { type: "ssmsSets", id: arg.setId },
        ],
      }),
      caseSetCount: builder.query({
        query: ({ setId, additionalFilters }) => ({
          graphQLQuery: `query caseSetCounts(
          $filters: FiltersArgument
        ) {
          viewer {
            repository {
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
        transformResponse: (response) =>
          response.data.viewer.repository.cases.hits.total,
        providesTags: (_result, _error, arg) => [
          { type: "caseSets", id: arg.setId },
        ],
      }),
    }),
  });

export const {
  useGeneSetCountQuery,
  useSsmSetCountQuery,
  useCaseSetCountQuery,
} = setCountSlice;
