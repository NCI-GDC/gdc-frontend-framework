import { GqlOperation } from "../gdcapi/filters";
import {
  graphqlAPI,
  GraphQLApiResponse,
  graphqlAPISlice,
  GraphQLFetchError,
} from "../gdcapi/gdcgraphql";
import { createTopNQuery, ModifySetFilterArgs } from "./shared";

const appendToGeneSetQuery = `
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
`;

const appendToSsmSetQuery = `
  mutation mutationsAppendExploreSsmSetMutation(
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
`;

const removeFromGeneSetQuery = `
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
  }
`;

const removeFromSsmSetQuery = `
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
`;

const removeFromSsmSetMutation = `mutation mutationsRemoveFromExploreSsmSetMutation(
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
}`;

export const modifySetSlice = graphqlAPISlice
  .enhanceEndpoints({ addTagTypes: ["geneSets", "ssmsSets"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      appendToGeneSet: builder.mutation({
        query: ({
          setId,
          filters,
          size,
          score,
          case_filters,
        }: ModifySetFilterArgs) => ({
          graphQLQuery: appendToGeneSetQuery,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              case_filters,
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
        query: ({
          setId,
          filters,
          case_filters,
          size,
          score,
        }: ModifySetFilterArgs) => ({
          graphQLQuery: appendToSsmSetQuery,
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
        query: ({
          setId,
          filters,
        }: {
          setId: string;
          filters: GqlOperation | Record<string, never>;
        }) => ({
          graphQLQuery: removeFromGeneSetQuery,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              filters,
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
        query: ({
          setId,
          filters,
        }: {
          setId: string;
          filters: GqlOperation | Record<string, never>;
        }) => ({
          graphQLQuery: removeFromSsmSetQuery,
          graphQLFilters: {
            input: {
              set_id: `set_id:${setId}`,
              filters,
            },
          },
        }),
        transformResponse: (response) =>
          response?.data?.sets?.remove_from?.explore?.ssm?.set_id,
        invalidatesTags: (_result, _error, arg) => [
          { type: "ssmsSets", id: arg.setId },
        ],
      }),
      removeTopNSsmsSetFromFilters: builder.mutation<
        string,
        ModifySetFilterArgs
      >({
        queryFn: async ({ case_filters, filters, score, size, setId }) => {
          let results: GraphQLApiResponse<any>;

          // get the top N ssms listed by score
          try {
            results = await graphqlAPI(createTopNQuery("ssms", "ssm_id"), {
              case_filters,
              filters,
              size,
              score,
            });
          } catch (e) {
            return { error: e as GraphQLFetchError };
          }

          const ssmsIds = results.data.viewer.explore.ssms.hits.edges.map(
            ({ node }: Record<string, any>) => node.ssm_id,
          );

          const setFilters = {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "ssms.ssm_id",
                  value: ssmsIds,
                },
              },
            ],
          };

          try {
            results = await graphqlAPI(removeFromSsmSetMutation, {
              input: {
                set_id: `set_id:${setId}`,
                filters: setFilters,
              },
            });
          } catch (e) {
            return { error: e as GraphQLFetchError };
          }

          return {
            data: results.data.sets.remove_from.explore.ssm.set_id as string,
          };
        },
        invalidatesTags: (_result, _error, arg) => {
          if (arg?.setId) {
            return [{ type: "ssmsSets", id: arg?.setId }];
          }
          return [];
        },
      }),
    }),
  });

export const {
  useAppendToGeneSetMutation,
  useAppendToSsmSetMutation,
  useRemoveFromGeneSetMutation,
  useRemoveFromSsmSetMutation,
  useRemoveTopNSsmsSetFromFiltersMutation,
} = modifySetSlice;
