import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const modifySetSlice = graphqlAPISlice
  .enhanceEndpoints({ addTagTypes: ["geneSets", "ssmsSets"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      appendToGeneSet: builder.mutation({
        query: ({ setId, filters, size, score }) => ({
          graphQLQuery: `
        mutation mutationsAppendExploreGeneSetMutation(
          $input: AppendSetInput
        ) {
          sets {
            append {
              explore {
                gene(input: $input) {
                  set_id
                  size
                }
              }
            }
          }
        }
        `,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              filters,
              size,
              score,
            },
          },
        }),
        transformResponse: (response) =>
          response?.data?.sets?.append?.explore?.gene?.set_id,
        invalidatesTags: (_result, _error, arg) => [
          { type: "geneSets", id: arg.setId },
        ],
      }),
      appendToSsmSet: builder.mutation({
        query: ({ setId, filters, case_filters, size, score }) => ({
          graphQLQuery: `mutation mutationsAppendExploreSsmSetMutation(
          $input: AppendSetInput
        ) {
          sets {
            append {
              explore {
                ssm(input: $input) {
                  set_id
                  size
                }
              }
            }
          }
        }
        `,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              filters,
              case_filters,
              size,
              score,
            },
          },
        }),
        transformResponse: (response) =>
          response?.data?.sets?.append?.explore?.ssm?.set_id,
        invalidatesTags: (_result, _error, arg) => [
          { type: "ssmsSets", id: arg.setId },
        ],
      }),
      removeFromGeneSet: builder.mutation({
        query: ({ setId, filters, size }) => ({
          graphQLQuery: `
        mutation mutationsRemoveFromExploreGeneSetMutation(
          $input: RemoveFromSetInput
        ) {
          sets {
            remove_from {
              explore {
                gene(input: $input) {
                  set_id
                  size
                }
              }
            }
          }
        } `,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              filters,
              size,
            },
          },
        }),
        transformResponse: (response) =>
          response?.data?.sets?.remove_from?.explore?.gene?.set_id,
        invalidatesTags: (_result, _error, arg) => [
          { type: "geneSets", id: arg.setId },
        ],
      }),
      removeFromSsmSet: builder.mutation({
        query: ({ setId, filters, size }) => ({
          graphQLQuery: `
        mutation mutationsRemoveFromExploreSsmSetMutation(
          $input: RemoveFromSetInput
        ) {
          sets {
            remove_from {
              explore {
                ssm(input: $input) {
                  set_id
                  size
                }
              }
            }
          }
        }

        `,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              filters,
              size,
            },
          },
        }),
        transformResponse: (response) =>
          response?.data?.sets?.remove_from?.explore?.ssm?.set_id,
        invalidatesTags: (_result, _error, arg) => [
          { type: "ssmsSets", id: arg.setId },
        ],
      }),
    }),
  });

export const {
  useAppendToGeneSetMutation,
  useAppendToSsmSetMutation,
  useRemoveFromGeneSetMutation,
  useRemoveFromSsmSetMutation,
} = modifySetSlice;
