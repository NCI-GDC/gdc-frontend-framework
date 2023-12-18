import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection, Includes } from "../gdcapi/filters";
import { Buckets, Bucket } from "../gdcapi/gdcapi";
import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";

interface GeneCancerDistributionTableResponse {
  viewer: {
    explore: {
      ssms: {
        aggregations: {
          occurrence__case__project__project_id: Buckets;
        };
      };
      cases: {
        filtered: {
          project__project_id: Buckets;
        };
        total: {
          project__project_id: Buckets;
        };
        cnvGain: {
          project__project_id: Buckets;
        };
        cnvLoss: {
          project__project_id: Buckets;
        };
        cnvTotal: {
          project__project_id: Buckets;
        };
      };
    };
  };
}

interface SSMSCancerDistributionTableResponse {
  viewer: {
    explore: {
      ssms: {
        aggregations: {
          occurrence__case__project__project_id: Buckets;
        };
      };
      cases: {
        filtered: {
          project__project_id: Buckets;
        };
        total: {
          project__project_id: Buckets;
        };
      };
    };
  };
}

export interface CancerDistributionTableData {
  projects: readonly Bucket[];
  ssmFiltered: Record<string, number>;
  ssmTotal: Record<string, number>;
  cnvGain?: Record<string, number>;
  cnvLoss?: Record<string, number>;
  cnvTotal?: Record<string, number>;
}

export const cancerDistributionTableApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneCancerDistributionTable: builder.query({
      query: (request: {
        gene: string;
        cohortFilters: FilterSet | undefined;
        genomicFilters: FilterSet | undefined;
        //     contextFilters: FilterSet | undefined;
      }) => {
        const genomicWithGene = {
          mode: "and",
          root: {
            ...request.genomicFilters?.root,
            ["genes.gene_id"]: {
              operator: "includes",
              field: "genes.gene_id",
              operands: [request.gene],
            } as Includes,
          },
        };

        const gqlContextFilter = buildCohortGqlOperator(genomicWithGene);
        const gqlCohortFilters = buildCohortGqlOperator(request.cohortFilters);
        const gqlContextIntersection =
          gqlContextFilter && (gqlContextFilter as GqlIntersection).content
            ? (gqlContextFilter as GqlIntersection).content
            : [];
        return {
          graphQLQuery: `
        query CancerDistributionTable(
          $cohortFilters: FiltersArgument
          $ssmTested: FiltersArgument
          $ssmCountsFilters: FiltersArgument
          $caseAggsFilter: FiltersArgument
          $cnvGainFilter: FiltersArgument
          $cnvLossFilter: FiltersArgument
          $cnvTested: FiltersArgument
        ) {
          viewer {
            explore {
              ssms {
                aggregations(case_filters: $cohortFilters, filters: $ssmCountsFilters) {
                  occurrence__case__project__project_id {
                    buckets {
                      key
                      doc_count
                    }
                  }
                }
              }
              cases {
                filtered: aggregations(case_filters: $cohortFilters, filters: $caseAggsFilter) {
                  project__project_id {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
                cnvGain: aggregations(case_filters: $cohortFilters, filters: $cnvGainFilter) {
                  project__project_id {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
                cnvLoss: aggregations(case_filters: $cohortFilters, filters: $cnvLossFilter) {
                  project__project_id {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
                cnvTotal: aggregations(filters: $cnvTested) {
                   project__project_id {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
                total: aggregations(filters: $ssmTested) {
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
        }
      `,
          graphQLFilters: {
            cohortFilters: gqlCohortFilters,
            ssmTested: {
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
            ssmCountsFilters: {
              op: "and",
              content: [
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["ssm"],
                  },
                  op: "in",
                },
                ...gqlContextIntersection,
              ],
            },
            caseAggsFilter: {
              op: "and",
              content: [
                {
                  op: "in",
                  content: {
                    field: "cases.available_variation_data",
                    value: ["ssm"],
                  },
                },
                {
                  op: "NOT",
                  content: {
                    field: "cases.gene.ssm.observation.observation_id",
                    value: "MISSING",
                  },
                },
                ...gqlContextIntersection,
              ],
            },
            cnvGainFilter: {
              op: "and",
              content: [
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["cnv"],
                  },
                  op: "in",
                },
                {
                  content: {
                    field: "cnvs.cnv_change",
                    value: ["Gain"],
                  },
                  op: "in",
                },
                ...gqlContextIntersection,
              ],
            },
            cnvLossFilter: {
              op: "and",
              content: [
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["cnv"],
                  },
                  op: "in",
                },
                {
                  content: {
                    field: "cnvs.cnv_change",
                    value: ["Loss"],
                  },
                  op: "in",
                },
                ...gqlContextIntersection,
              ],
            },
            cnvTested: {
              content: [
                {
                  content: {
                    field: "cases.available_variation_data",
                    value: ["cnv"],
                  },
                  op: "in",
                },
              ],
              op: "and",
            },
          },
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<GeneCancerDistributionTableResponse>,
      ): CancerDistributionTableData => {
        return {
          projects:
            response?.data?.viewer?.explore?.ssms?.aggregations
              ?.occurrence__case__project__project_id?.buckets.length > 0
              ? response?.data?.viewer?.explore?.ssms?.aggregations
                  ?.occurrence__case__project__project_id?.buckets
              : response?.data?.viewer?.explore?.cases?.cnvTotal
                  .project__project_id.buckets,
          ssmFiltered: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.filtered?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          ssmTotal: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          cnvGain: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.cnvGain?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          cnvLoss: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.cnvLoss?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          cnvTotal: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.cnvTotal?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
        };
      },
    }),
    getSSMSCancerDistributionTable: builder.query({
      query: (request) => ({
        graphQLQuery: `query CancerDistributionSsmTable(
          $ssmTested: FiltersArgument
          $ssmCountsFilters: FiltersArgument
          $caseAggsFilter: FiltersArgument
        ) {
          viewer {
            explore {
              ssms {
                aggregations(filters: $ssmCountsFilters) {
                  occurrence__case__project__project_id {
                    buckets {
                      key
                      doc_count
                    }
                  }
                }
              }
              cases {
                filtered: aggregations(filters: $caseAggsFilter) {
                  project__project_id {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
                total: aggregations(filters: $ssmTested) {
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
        }`,
        graphQLFilters: {
          ssmTested: {
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
          ssmCountsFilters: {
            content: [
              {
                content: {
                  field: "ssms.ssm_id",
                  value: [request.ssms],
                },
                op: "in",
              },
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
          caseAggsFilter: {
            content: [
              {
                content: {
                  field: "ssms.ssm_id",
                  value: [request.ssms],
                },
                op: "in",
              },
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
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SSMSCancerDistributionTableResponse>,
      ): CancerDistributionTableData => {
        return {
          projects:
            response?.data?.viewer?.explore?.ssms?.aggregations
              ?.occurrence__case__project__project_id?.buckets,
          ssmFiltered: Object.fromEntries(
            (
              response?.data?.viewer?.explore?.cases?.filtered
                ?.project__project_id as Buckets
            )?.buckets.map((b) => [b.key, b.doc_count]),
          ),
          ssmTotal: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
        };
      },
    }),
  }),
});

export const {
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
} = cancerDistributionTableApiSlice;
