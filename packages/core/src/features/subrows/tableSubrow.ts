import { Buckets } from "../gdcapi/gdcapi";
import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { startCase } from "lodash";

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

export interface Gene {
  gene_id: string;
  symbol: string;
}
export interface Annotation {
  polyphen_impact: string;
  polyphen_score: number;
  sift_score: number;
  sift_impact: string;
  vep_impact: string;
}

export interface Consequence {
  aa_change: string;
  annotation: Annotation;
  consequence_type: string;
  gene: Gene;
  id: string;
  is_canonical: boolean;
}

export interface SSMData {
  ssm_id: string;
  occurrence: number;
  filteredOccurrences: number;
  genomic_dna_change: string;
  mutation_subtype: string;
  consequence: Consequence[];
  annotation: Annotation;
}

export interface MutatedGenesFreqTransformedData {
  gene_id: string;
  symbol: string;
  name: string;
  cytoband: string;
  biotype: string;
  ssmsAffectedCasesInCohort: string;
  ssmsAffectedCasesAcrossGDC: string;
  cnvGain: string;
  cnvLoss: string;
  mutations: string;
  annotations: string;
}

export interface MutationsFreqTransformedData {
  dnaChange: string;
  proteinChange: string;
  mutationId: string;
  type: string;
  consequences: string;
  affectedCasesInCohort: string;
  affectedCasesAcrossGDC: string;
  impact: string;
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
    mutatedGenesFreqDL: builder.query<
      Record<string, MutatedGenesFreqTransformedData[]>,
      { geneIds: string[]; tableData: any }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: MutatedGenesFreqTransformedData[] = [];
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
          const {
            numerators = { project__project_id: { buckets: [] } },
            denominators = { project__project_id: { buckets: [] } },
          } = result?.data?.data?.explore?.cases;
          const [n, d] = [
            numerators?.project__project_id?.buckets,
            denominators?.project__project_id?.buckets,
          ];
          const { genes, cnvCases, filteredCases, mutationCounts } =
            arg?.tableData;

          const casesAcrossGDC = n.map(
            ({
              doc_count: count,
              key: projectName,
            }: {
              doc_count: number;
              key: string;
            }) => {
              const countComplement = d.find(
                ({ key }: { key: string }) => key === projectName,
              )?.doc_count;
              return `${projectName}: ${count} / ${countComplement} (${(
                100 *
                (count / countComplement)
              ).toFixed(2)}%)`;
            },
          );

          const gene = genes.find(
            ({ gene_id }: { gene_id: string }) => gene_id === geneId,
          );

          const mutatedGene = [gene].map(
            ({
              gene_id,
              symbol,
              name,
              cytoband,
              biotype,
              numCases,
              case_cnv_gain,
              case_cnv_loss,
              annotations,
            }: {
              gene_id: string;
              symbol: string;
              name: string;
              cytoband: string[];
              biotype: string;
              numCases: number;
              case_cnv_gain: number;
              case_cnv_loss: number;
              annotations: boolean;
            }) => {
              return {
                gene_id,
                symbol,
                name,
                cytoband: cytoband.join(", "),
                biotype,
                ssmsAffectedInCohort: `${numCases} / ${filteredCases} (${(
                  100 *
                  (numCases / filteredCases)
                ).toFixed(2)}%)`,
                ...(gene_id === geneId
                  ? { ssmsAffectedCasesAcrossGDC: casesAcrossGDC.join(", ") }
                  : {}),
                cnvGain: `${case_cnv_gain} / ${cnvCases} (${(
                  100 *
                  (case_cnv_gain / cnvCases)
                ).toFixed(2)}%)`,
                cnvLoss: `${case_cnv_loss} / ${cnvCases} (${(
                  100 *
                  (case_cnv_loss / cnvCases)
                ).toFixed(2)}%)`,
                ...(mutationCounts[geneId] && {
                  mutations: mutationCounts[geneId],
                }),
                ...(annotations
                  ? { annotations: "Cancer Gene Cencus" }
                  : { annotations: "" }),
              };
            },
          );

          // todo handle errors
          // if (error) {
          //   return { error };
          // } else {

          results.push(mutatedGene[0]);

          // }
        }
        return { data: { results } };
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
    mutationsFreqDL: builder.query<
      Record<string, MutationsFreqTransformedData[]>,
      { ssmsIds: string[]; tableData: any }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        let results: MutationsFreqTransformedData[] = [];
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
          const {
            numerators = { project__project_id: { buckets: [] } },
            denominators = { project__project_id: { buckets: [] } },
          } = result?.data?.data?.explore?.cases;
          const [n, d] = [
            numerators?.project__project_id?.buckets,
            denominators?.project__project_id?.buckets,
          ];
          console.log("result", result, "tableData", arg.tableData);
          debugger;
          const { cases, filteredCases, ssms } = arg?.tableData;

          const casesAcrossGDC = n.map(
            ({
              doc_count: count,
              key: projectName,
            }: {
              doc_count: number;
              key: string;
            }) => {
              const countComplement = d.find(
                ({ key }: { key: string }) => key === projectName,
              )?.doc_count;
              return `${projectName}: ${count} / ${countComplement} (${(
                100 *
                (count / countComplement)
              ).toFixed(2)}%)`;
            },
          );

          const mtn = ssms.find(
            ({ ssm_id }: { ssm_id: string }) => ssm_id === ssmsId,
          );

          const mutation = [mtn].map(
            ({
              genomic_dna_change,
              ssm_id,
              filteredOccurrences,
              mutation_subtype,
              consequence,
            }: SSMData) => {
              return {
                dnaChange: genomic_dna_change,
                mutationId: ssm_id,
                type: [
                  "Oligo-nucleotide polymorphism",
                  "Tri-nucleotide polymorphism",
                ].includes(mutation_subtype)
                  ? mutation_subtype
                  : startCase(mutation_subtype.split(" ").at(-1)),
                ssmsAffectedCasesInCohort: `${filteredOccurrences} / ${filteredCases} (${(
                  100 *
                  (filteredOccurrences / filteredCases)
                ).toFixed(2)}%)`,
                // todo edge cases
                consequences: consequence.map(({ gene, aa_change }) => {
                  aa_change + gene.symbol;
                }),
                ...(ssm_id === ssmsId
                  ? { ssmsAffectedCasesAcrossGDC: casesAcrossGDC.join(", ") }
                  : {}),
              };
            },
          );
          console.table([
            `cases:${cases}`,
            `filtered${filteredCases}`,
            casesAcrossGDC,
            ssms,
            mutation,
          ]);
          debugger;

          // todo handle errors
          // if (error) {
          //   return { error };
          // } else {

          results.push(mutation[0]);

          // }
        }
        return { data: { results } };
      },
    }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  useMutatedGenesFreqDLQuery,
  useMutationsFreqDLQuery,
  useGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
