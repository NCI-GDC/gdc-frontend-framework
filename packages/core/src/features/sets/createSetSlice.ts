import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const createSetSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    createGeneSetFromValues: builder.mutation({
      query: ({ values }) => ({
        graphQLQuery: `mutation createSet(
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
        `,
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
      transformResponse: (response) =>
        response.data.sets.create.explore.gene.set_id,
    }),
    createSsmsSetFromValues: builder.mutation({
      query: ({ values }) => ({
        graphQLQuery: `mutation createSet(
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
        }
        `,
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
      transformResponse: (response) =>
        response.data.sets.create.explore.ssm.set_id,
    }),
    createGeneSetFromFilters: builder.mutation({
      query: ({ filters, size }) => ({
        graphQLQuery: `mutation createSet(
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
        `,
        graphQLFilters: {
          input: {
            filters,
            size,
          },
        },
      }),
      transformResponse: (response) =>
        response.data.sets.create.explore.gene.set_id,
    }),
    createSsmsSetFromFilters: builder.mutation({
      query: ({ filters, size }) => ({
        graphQLQuery: `mutation createSet(
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
        }
        `,
        graphQLFilters: {
          input: {
            filters,
            size,
          },
        },
      }),
      transformResponse: (response) =>
        response.data.sets.create.explore.ssm.set_id,
    }),
  }),
});

export const {
  useCreateGeneSetFromValuesMutation,
  useCreateSsmsSetFromValuesMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateSsmsSetFromFiltersMutation,
} = createSetSlice;
