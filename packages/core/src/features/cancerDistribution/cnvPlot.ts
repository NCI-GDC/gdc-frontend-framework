import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection, Includes } from "../gdcapi/filters";
import { Buckets } from "../gdcapi/types";
import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";

interface CancerDistributionChartResponse {
  viewer: {
    explore: {
      cases: {
        amplification: {
          project__project_id: Buckets;
        };
        gain: {
          project__project_id: Buckets;
        };
        loss: {
          project__project_id: Buckets;
        };
        homozygousDeletion: {
          project__project_id: Buckets;
        };
        cnvTotal: {
          project__project_id: Buckets;
        };
        cnvCases: {
          total: number;
        };
      };
    };
  };
}

const graphQLQuery = `query CancerDistributionCNV(
  $caseFilters: FiltersArgument,
  $cnvAmplificationFilter: FiltersArgument,
  $cnvGainFilter: FiltersArgument,
  $cnvLossFilter: FiltersArgument,
  $cnvHomozygousDeletionFilter: FiltersArgument,
  $cnvTotalFilter: FiltersArgument,
  $cnvCasesFilter: FiltersArgument
  ) {
  viewer {
    explore {
      cases {

        amplification: aggregations(case_filters: $caseFilters, filters: $cnvAmplificationFilter) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        gain: aggregations(case_filters: $caseFilters, filters: $cnvGainFilter) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        loss: aggregations(case_filters: $caseFilters, filters: $cnvLossFilter) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        homozygousDeletion: aggregations(case_filters: $caseFilters, filters: $cnvHomozygousDeletionFilter) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        cnvTotal: aggregations(filters: $cnvTotalFilter) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        cnvCases: hits(case_filters: $caseFilters, filters: $cnvCasesFilter) {
          total
        }
      }
    }
  }
}
`;

interface CNVPlotRequest {
  gene: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}

interface GroupedCnvData {
  [projectId: string]: {
    total: number;
    amplification: number;
    gain: number;
    loss: number;
    homozygousDeletion: number;
  };
}

interface CNVData {
  readonly cnvs: GroupedCnvData;
  readonly caseTotal: number;
}

const cnvPlotSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    cnvPlot: builder.query<CNVData, CNVPlotRequest>({
      query: ({ gene, cohortFilters, genomicFilters }) => {
        const contextGene =
          ((genomicFilters?.root["genes.gene_id"] as Includes)
            ?.operands as string[]) ?? [];
        const contextWithGene = {
          mode: "and",
          root: {
            ...genomicFilters?.root,
            ["genes.gene_id"]: {
              operator: "includes",
              field: "genes.gene_id",
              operands: [gene, ...contextGene],
            } as Includes,
          },
        };

        const caseFilters = buildCohortGqlOperator(cohortFilters);
        const gqlContextFilter = buildCohortGqlOperator(contextWithGene);
        const gqlContextIntersection =
          gqlContextFilter && (gqlContextFilter as GqlIntersection).content
            ? (gqlContextFilter as GqlIntersection).content
            : [];

        const graphQLFilters = {
          cnvAmplificationFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change_5_category",
                  value: ["Amplification"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvGainFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change_5_category",
                  value: ["Gain"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvLossFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change_5_category",
                  value: ["Loss"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvHomozygousDeletionFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change_5_category",
                  value: ["Homozygous Deletion"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvTotalFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.available_variation_data",
                  value: ["cnv"],
                },
              },
            ],
          },
          cnvCasesFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change_5_category",
                  value: [
                    "Amplification",
                    "Gain",
                    "Loss",
                    "Homozygous Deletion",
                  ],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          caseFilters,
        };
        return {
          graphQLQuery,
          graphQLFilters,
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<CancerDistributionChartResponse>,
      ): CNVData => {
        const amplification = Object.fromEntries(
          response?.data?.viewer?.explore?.cases?.amplification?.project__project_id?.buckets?.map(
            (b) => [b.key, b.doc_count],
          ),
        );
        const gain = Object.fromEntries(
          response?.data?.viewer?.explore?.cases?.gain?.project__project_id?.buckets?.map(
            (b) => [b.key, b.doc_count],
          ),
        );
        const loss = Object.fromEntries(
          response?.data?.viewer?.explore?.cases?.loss?.project__project_id?.buckets?.map(
            (b) => [b.key, b.doc_count],
          ),
        );
        const homozygousDeletion = Object.fromEntries(
          response?.data?.viewer?.explore?.cases?.homozygousDeletion?.project__project_id?.buckets?.map(
            (b) => [b.key, b.doc_count],
          ),
        );
        const total = Object.fromEntries(
          response?.data?.viewer?.explore?.cases?.cnvTotal?.project__project_id?.buckets?.map(
            (b) => [b.key, b.doc_count],
          ),
        );

        const cnvsByProject: GroupedCnvData = Object.keys(
          total,
        ).reduce<GroupedCnvData>((acc, projectId) => {
          const amplificationCount = amplification[projectId] || 0;
          const gainCount = gain[projectId] || 0;
          const lossCount = loss[projectId] || 0;
          const homozygousDeletionCount = homozygousDeletion[projectId] || 0;

          // Only add project if at least one CNV count is non-zero
          if (
            amplificationCount ||
            gainCount ||
            lossCount ||
            homozygousDeletionCount
          ) {
            acc[projectId] = {
              total: total[projectId] || 0,
              amplification: amplificationCount,
              gain: gainCount,
              loss: lossCount,
              homozygousDeletion: homozygousDeletionCount,
            };
          }

          return acc;
        }, {});

        return {
          cnvs: cnvsByProject,
          caseTotal: response?.data?.viewer?.explore?.cases.cnvCases?.total,
        };
      },
    }),
  }),
});

export const { useCnvPlotQuery } = cnvPlotSlice;
