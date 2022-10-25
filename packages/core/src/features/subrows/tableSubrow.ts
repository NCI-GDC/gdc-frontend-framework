import { Buckets } from "../gdcapi/gdcapi";
import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";

interface SubrowResponse {
  explore: {
    cases: {
      denominators: {
        project__project_id: Buckets;
      };
      numerators: {
        project__project_id: Buckets;
      };
    };
  };
}

export interface TableSubrowData {
  something: any;
}
// include in export @ core index
export const tableSubrowApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTableSubrow: builder.query({
      query: (request: { geneId: string }) => ({
        graphQLQuery: `
                    query GeneTableSubrow(
                        $filters_case: FiltersArgument
                        $filters_gene: FiltersArgument
                    ) {
                        explore {
                            cases {
                                denominators: aggregations(filters: $filters_case) {
                                    project__project_id {
                                        buckets {
                                            key
                                            doc_count
                                        }
                                    }
                                }
                                numerators: aggregations(filters: $filters_gene) {
                                    project__project_id {
                                        buckets {
                                            doc_count
                                            key
                                        }
                                    }
                                }
                            }
                        }
                    }
                    `,
        graphQLFilters: {
          filters_case: {
            content: [
              {
                content: {
                  field: "cases.available_variation_data",
                  value: ["ssm"],
                },
                op: "in",
              },
            ],
            op: "and",
          },
          filters_gene: {
            op: "and",
            content: [
              {
                content: {
                  field: "genes.gene_id",
                  value: [request.geneId],
                },
                op: "in",
              },
              {
                op: "NOT",
                content: {
                  field: "cases.gene.ssm.observation.observation_id",
                  value: "MISSING",
                },
              },
            ],
          },
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SubrowResponse>,
      ): any => {
        console.log("gene res", response);
        return {
          something: response,
        };
      },
    }),
    // getSomaticMutationTableSubrow: builder.query({
    //   query: (request: { mutationId: string }) => ({
    //     graphQLQuery: `
    //             query SomaticMutationTableSubrow(
    //               $filters_case: FiltersArgument
    //               $filters_mutation: FiltersArgument
    //             ) {
    //               explore {
    //                 cases {
    //                   denominators: aggregations(filters: $filters_case) {
    //                     project__project_id {
    //                       buckets {
    //                         key
    //                         doc_count
    //                       }
    //                     }
    //                   }
    //                   numerators: aggregations(filters: $filters_mutation) {
    //                     project__project_id {
    //                       buckets {
    //                         doc_count
    //                         key
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           `,
    //     graphQLFilters: {
    //       filters_case: {
    //         content: [
    //           {
    //             content: {
    //               field: "cases.available_variation_data",
    //               value: ["ssm"],
    //             },
    //             op: "in",
    //           },
    //         ],
    //         op: "and",
    //       },
    //       filters_mutation: {
    //         content: [
    //           {
    //             content: {
    //               field: "ssms.ssm_id",
    //               value: [request.mutationId],
    //             },
    //             op: "in",
    //           },
    //           {
    //             content: {
    //               field: "cases.gene.ssm.observation.observation_id",
    //               value: "MISSING",
    //             },
    //             op: "NOT",
    //           },
    //         ],
    //         op: "and",
    //       },
    //     },
    //   }),
    //   transformResponse: (
    //     response: GraphQLApiResponse<SubrowResponse>,
    //   ): any => {
    //     console.log("mtn res", response);
    //     return {
    //       something: response,
    //     };
    //   },
    // }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  // useGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
