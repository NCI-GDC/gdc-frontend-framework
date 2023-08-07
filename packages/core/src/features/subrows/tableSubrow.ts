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

export interface TableSubrowItem {
  project: string;
  numerator: number;
  denominator: number;
}

export type TableSubrowData = Partial<TableSubrowItem>;

export const tableSubrowApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTableSubrow: builder.query({
      query: (request: { id: string }) => ({
        graphQLQuery: `
                    query GeneTableSubrow(
                        $filters_case: FiltersArgument
                        $filters_gene: FiltersArgument
                    ) {
                        explore {
                            cases {
                              denominators: aggregations(case_filters: $filters_case) {
                                project__project_id {
                                    buckets {
                                        key
                                        doc_count
                                    }
                                }
                              }
                                numerators: aggregations(case_filters: $filters_gene) {
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
                  value: [request.id],
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
      ): TableSubrowData[] => {
        const { cases } = response?.data?.explore;
        const {
          numerators: {
            project__project_id: { buckets: nBuckets = [] },
          },
          denominators: {
            project__project_id: { buckets: dBuckets = [] },
          },
        } = cases;
        const transformedBuckets = nBuckets.map(({ doc_count, key }) => {
          return {
            project: key,
            numerator: doc_count,
            denominator: dBuckets.find((d) => d.key === key)?.doc_count,
          };
        });
        return transformedBuckets as TableSubrowData[];
      },
    }),
    getSomaticMutationTableSubrow: builder.query({
      query: (request: { id: string }) => ({
        graphQLQuery: `
                query SomaticMutationTableSubrow(
                  $filters_case: FiltersArgument
                  $filters_mutation: FiltersArgument
                ) {
                  explore {
                    cases {
                      denominators: aggregations(case_filters: $filters_case) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                      }
                      numerators: aggregations(case_filters: $filters_mutation) {
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
          filters_mutation: {
            content: [
              {
                content: {
                  field: "ssms.ssm_id",
                  value: [request.id],
                },
                op: "in",
              },
              {
                content: {
                  field: "cases.gene.ssm.observation.observation_id",
                  value: "MISSING",
                },
                op: "NOT",
              },
            ],
            op: "and",
          },
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SubrowResponse>,
      ): TableSubrowData[] => {
        const { cases } = response?.data?.explore;
        const {
          numerators: {
            project__project_id: { buckets: nBuckets = [] },
          },
          denominators: {
            project__project_id: { buckets: dBuckets = [] },
          },
        } = cases;
        const transformedBuckets = nBuckets.map(({ doc_count, key }) => {
          return {
            project: key,
            numerator: doc_count,
            denominator: dBuckets.find((d) => d.key === key)?.doc_count,
          };
        });
        return transformedBuckets as TableSubrowData[];
      },
    }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  useGetSomaticMutationTableSubrowQuery,
  useLazyGetGeneTableSubrowQuery,
  useLazyGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
