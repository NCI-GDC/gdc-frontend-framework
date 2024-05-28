import { GqlOperation } from "../gdcapi/filters";
import {
  graphqlAPI,
  GraphQLApiResponse,
  graphqlAPISlice,
  GraphQLFetchError,
} from "../gdcapi/gdcgraphql";

type SetIntent = "user" | "portal";
type SetCreationType = "instant" | "ephemeral" | "mutable" | "frozen";

export interface CreateSetValueArgs {
  values: readonly string[];
  set_type: SetCreationType;
  intent: SetIntent;
}

export interface CreateSetFilterArgs {
  case_filters?: GqlOperation | Record<string, never>;
  filters?: GqlOperation | Record<string, never>;
  size?: number;
  score?: string;
  set_id?: string;
  set_type: SetCreationType;
  intent: SetIntent;
}

const createGeneSetMutation = `mutation createSet(
  $input: CreateSetInput
) {
  sets {
    create {
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

const transformGeneSetResponse = (
  response: GraphQLApiResponse<any>,
): string => {
  return response.data.sets.create.explore.gene.set_id;
};

const createSsmsSetMutation = `mutation createSet(
  $input: CreateSetInput
) {
  sets {
    create {
      explore {
        ssm(input: $input) {
          set_id
          size
        }
      }
    }
  }
}`;

const TopNGenesQuery = `
query topNGenesQuery($cohortFilter: FiltersArgument,
  $filters: FiltersArgument, $score: String, $size: Int) {
  viewer {
    explore {
      genes  {
        hits(filters: $filters, case_filters: $cohortFilter, score:$score, first: $size) {
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
`;

const transformSsmsSetResponse = (
  response: GraphQLApiResponse<any>,
): string => {
  return response.data.sets.create.explore.ssm.set_id;
};

const createCaseSetMutation = `mutation createSet(
  $input: CreateSetInput
) {
  sets {
    create {
      repository {
        case(input: $input) {
          set_id
          size
        }
      }
    }
  }
}
`;

const createCaseSetExploreMutation = `mutation createSet(
  $input: CreateSetInput
) {
  sets {
    create {
      explore {
        case(input: $input) {
          set_id
          size
        }
      }
    }
  }
}
`;

const transformCaseSetResponse = (
  response: GraphQLApiResponse<any>,
): string => {
  return response.data.sets.create.repository.case.set_id;
};

export const createSetSlice = graphqlAPISlice
  .enhanceEndpoints({ addTagTypes: ["geneSets", "ssmsSets", "caseSets"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      createGeneSetFromValues: builder.mutation<string, CreateSetValueArgs>({
        query: ({ values, intent, set_type }) => ({
          graphQLQuery: createGeneSetMutation,
          graphQLFilters: {
            input: {
              filters: {
                op: "and",
                content: [
                  {
                    op: "in",
                    content: {
                      field: "genes.gene_id",
                      value: values,
                    },
                  },
                ],
              },
              intent,
              set_type,
            },
          },
        }),
        transformResponse: transformGeneSetResponse,
      }),
      createSsmsSetFromValues: builder.mutation<string, CreateSetValueArgs>({
        query: ({ values, intent, set_type }) => ({
          graphQLQuery: createSsmsSetMutation,
          graphQLFilters: {
            input: {
              filters: {
                op: "and",
                content: [
                  {
                    op: "in",
                    content: {
                      field: "ssms.ssm_id",
                      value: values,
                    },
                  },
                ],
              },
              intent,
              set_type,
            },
          },
        }),
        transformResponse: transformSsmsSetResponse,
      }),
      createCaseSetFromValues: builder.mutation<string, CreateSetValueArgs>({
        query: ({ values, intent, set_type }) => ({
          graphQLQuery: createCaseSetMutation,
          graphQLFilters: {
            input: {
              filters: {
                op: "and",
                content: [
                  {
                    op: "in",
                    content: {
                      field: "cases.case_id",
                      value: values,
                    },
                  },
                ],
              },
              intent,
              set_type,
            },
          },
        }),
        transformResponse: transformCaseSetResponse,
      }),
      createGeneSetFromFilters: builder.mutation<string, CreateSetFilterArgs>({
        query: ({ case_filters, filters, size, intent, set_type }) => ({
          graphQLQuery: createGeneSetMutation,
          graphQLFilters: {
            input: {
              case_filters: case_filters ?? {},
              filters: filters ?? {},
              size,
              intent,
              set_type,
            },
          },
        }),
        transformResponse: transformGeneSetResponse,
        invalidatesTags: (_result, _error, arg) => {
          if (arg?.set_id) {
            return [{ type: "geneSets", id: arg?.set_id }];
          }
          return [];
        },
      }),
      createTopNGeneSetFromFilters: builder.mutation<
        string,
        CreateSetFilterArgs
      >({
        queryFn: async ({
          case_filters,
          filters,
          score,
          size,
          intent,
          set_type,
        }) => {
          let results: GraphQLApiResponse<any>;
          // get the top N genes listed by score
          try {
            results = await graphqlAPI(TopNGenesQuery, {
              cohortFilter: case_filters,
              filters,
              size,
              score,
            });
          } catch (e) {
            return { error: e as GraphQLFetchError };
          }
          // get the top N gene_ids
          const geneIds = results.data.viewer.explore.genes.hits.edges.map(
            ({ node }: Record<string, any>) => node.gene_id,
          );
          // creat the gene set
          const setFilters = {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "genes.gene_id",
                  value: geneIds,
                },
              },
            ],
          };

          try {
            results = await graphqlAPI(createGeneSetMutation, {
              input: {
                case_filters: {},
                filters: setFilters,
                size,
                intent,
                set_type,
              },
            });
          } catch (e) {
            return { error: e as GraphQLFetchError };
          }
          return {
            data: results.data.sets.create.explore.gene.set_id as string,
          };
        },
        invalidatesTags: (_result, _error, arg) => {
          if (arg?.set_id) {
            return [{ type: "geneSets", id: arg?.set_id }];
          }
          return [];
        },
      }),
      createSsmsSetFromFilters: builder.mutation<string, CreateSetFilterArgs>({
        query: ({ case_filters, filters, size, set_id, intent, set_type }) => ({
          graphQLQuery: createSsmsSetMutation,
          graphQLFilters: {
            input: {
              case_filters: case_filters ?? {},
              filters: filters ?? {},
              set_id,
              size,
              intent,
              set_type,
            },
          },
        }),
        transformResponse: transformSsmsSetResponse,
        invalidatesTags: (_result, _error, arg) => {
          if (arg?.set_id) {
            return [{ type: "ssmsSets", id: arg?.set_id }];
          }
          return [];
        },
      }),
      createCaseSetFromFilters: builder.mutation<string, CreateSetFilterArgs>({
        query: ({ case_filters, filters, size, set_id, intent, set_type }) => ({
          graphQLQuery: createCaseSetExploreMutation,
          graphQLFilters: {
            input: {
              case_filters: case_filters ?? {},
              filters: filters ?? {},
              set_id,
              size,
              intent,
              set_type,
            },
          },
        }),
        transformResponse: (response) =>
          response.data.sets.create.explore.case.set_id,
        invalidatesTags: (_result, _error, arg) => {
          if (arg?.set_id) {
            return [{ type: "caseSets", id: arg?.set_id }];
          }
          return [];
        },
      }),
    }),
  });

export const {
  useCreateGeneSetFromValuesMutation,
  useCreateSsmsSetFromValuesMutation,
  useCreateCaseSetFromValuesMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateSsmsSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
  useCreateTopNGeneSetFromFiltersMutation,
} = createSetSlice;
