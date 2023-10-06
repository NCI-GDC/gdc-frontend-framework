import { GqlOperation } from "../gdcapi/filters";
import {
  GraphQLApiResponse,
  graphqlAPISlice,
  graphqlAPI,
} from "../gdcapi/gdcgraphql";

interface CreateSetValueArgs {
  values: readonly string[];
}

interface CreateSetFilterArgs {
  filters?: GqlOperation | Record<string, never>;
  size?: number;
  score?: string;
  set_id?: string;
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
        query: ({ values }) => ({
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
            },
          },
        }),
        transformResponse: transformGeneSetResponse,
      }),
      createSsmsSetFromValues: builder.mutation<string, CreateSetValueArgs>({
        query: ({ values }) => ({
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
            },
          },
        }),
        transformResponse: transformSsmsSetResponse,
      }),
      createCaseSetFromValues: builder.mutation<string, CreateSetValueArgs>({
        query: ({ values }) => ({
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
            },
          },
        }),
        transformResponse: transformCaseSetResponse,
      }),
      createGeneSetFromFilters: builder.mutation<string, CreateSetFilterArgs>({
        query: ({ filters, size, score }) => ({
          graphQLQuery: createGeneSetMutation,
          graphQLFilters: {
            input: {
              filters,
              size,
              score,
            },
          },
        }),
        transformResponse: transformGeneSetResponse,
      }),
      createSsmsSetFromFilters: builder.mutation<string, CreateSetFilterArgs>({
        query: ({ filters, size, score, set_id }) => ({
          graphQLQuery: createSsmsSetMutation,
          graphQLFilters: {
            input: {
              filters,
              set_id,
              size,
              score,
            },
          },
        }),
        transformResponse: transformSsmsSetResponse,
      }),
      createCaseSetFromFilters: builder.mutation<string, CreateSetFilterArgs>({
        query: ({ filters, size, score, set_id }) => ({
          graphQLQuery: createCaseSetExploreMutation,
          graphQLFilters: {
            input: {
              filters: filters ?? {},
              set_id,
              size,
              score,
            },
          },
        }),
        transformResponse: (response) =>
          response.data.sets.create.explore.case.set_id,
      }),
    }),
  });

export const createSetMutationFactory = async (
  field: string,
  filters: Record<string, any>,
): Promise<string | undefined> => {
  let setId;
  let response;
  switch (field) {
    case "genes.gene_id":
      response = await graphqlAPI(createGeneSetMutation, filters);
      setId = transformGeneSetResponse(response);
      break;
    case "ssms.ssm_id":
      response = await graphqlAPI(createSsmsSetMutation, filters);
      setId = transformSsmsSetResponse(response);
      break;
    case "cases.case_id":
      response = await graphqlAPI(createCaseSetMutation, filters);
      setId = transformCaseSetResponse(response);
      break;
  }

  return Promise.resolve(setId);
};

export const {
  useCreateGeneSetFromValuesMutation,
  useCreateSsmsSetFromValuesMutation,
  useCreateCaseSetFromValuesMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateSsmsSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
} = createSetSlice;
