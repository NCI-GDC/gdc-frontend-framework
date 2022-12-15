import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

export const createSetSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    createGeneSet: builder.mutation({
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
    createSsmsSet: builder.mutation({
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
  }),
});

export const { useCreateGeneSetMutation, useCreateSsmsSetMutation } =
  createSetSlice;
