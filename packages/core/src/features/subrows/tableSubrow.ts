import { Buckets } from "../gdcapi/gdcapi";
import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";

export interface SubrowResponse {
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
    mutationFreqDL: builder.query<
      Record<string, { numerators: string[]; denominators: string[] }>,
      { geneIds: string[]; tableData: any }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: Record<
          string,
          { numerators: string[]; denominators: string[] }
        > = {};
        for (const geneId of arg.geneIds) {
          const result = await fetchWithBQ({
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
                      value: [geneId],
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
          });
          const { numerators, denominators } = result?.data?.data?.explore
            ?.cases ?? { numerators: 0, denominators: 0 };
          const [n, d] = [
            numerators.project__project_id.buckets,
            denominators.project__project_id.buckets,
          ];
          const { genes } = arg.tableData;

          const casesAcrossGDC = n.map(
            ({ doc_count: count, key }: { doc_count: string; key: string }) => {
              return {
                count,
                key,
              };
            },
          );
          console.log("cases", casesAcrossGDC);

          // todo: spread cases across gdc into mutated genes mapping

          const mutated = genes.map(
            ({
              gene_id,
              symbol,
              name,
              cytoband,
              biotype,
            }: {
              gene_id: string;
              symbol: string;
              name: string;
              cytoband: string[];
              biotype: string;
            }) => {
              return {
                gene_id,
                symbol,
                name,
                cytoband,
                biotype,
              };
            },
          );

          console.log("mutated", mutated);
          console.log("n", n, "d", d, "results", results);
          console.log("tableData?", arg.tableData);
          debugger;

          //   if (result.error) {
          //     return { error: result.error };
          //   }
          //   else {
          //     console.log("td", arg.tableData);
          //     console.log("result", result.data);
          //     debugger;
          //     results = {
          //       ...results,
          //       [geneId]: {
          //         numerators: (result.data as unknown as SubrowResponse).explore
          //           .cases.denominators.project__project_id,
          //         denominators: (result.data as unknown as SubrowResponse).explore
          //           .cases.denominators.project__project_id,
          //       },
          //     };
          //   }
          // }
        }
        return { data: { eng12312: { numerators: [""], denominators: [""] } } };
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
                      denominators: aggregations(filters: $filters_case) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                      }
                      numerators: aggregations(filters: $filters_mutation) {
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
    freqGeneMutationDL: builder.query<
      Record<string, { numerators: string[]; denominators: string[] }>,
      { ssmsIds: string[] }
      // , tableData: any
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: Record<
          string,
          { numerators: string[]; denominators: string[] }
        > = {};
        for (const ssmsId of arg.ssmsIds) {
          const result = await fetchWithBQ({
            graphQLQuery: `
                    query SomaticMutationTableSubrow(
                      $filters_case: FiltersArgument
                      $filters_mutation: FiltersArgument
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
                          numerators: aggregations(filters: $filters_mutation) {
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
                      value: [ssmsId],
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
          });
          // results["geneId"] = { numerators: [''], denominators: ['']};
          console.table([result, results]);
          debugger;

          //   if (result.error) {
          //     return { error: result.error };
          //   }
          //   else {
          //     console.log("td", arg.tableData);
          //     console.log("result", result.data);
          //     debugger;
          //     results = {
          //       ...results,
          //       [ssmsId]: {
          //         numerators: (result.data as unknown as SubrowResponse).explore
          //           .cases.denominators.project__project_id,
          //         denominators: (result.data as unknown as SubrowResponse).explore
          //           .cases.denominators.project__project_id,
          //       },
          //     };
          //   }
          // }
        }
        return { data: { eng12312: { numerators: [""], denominators: [""] } } };
      },
    }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  useMutationFreqDLQuery,
  useFreqGeneMutationDLQuery,
  useGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
