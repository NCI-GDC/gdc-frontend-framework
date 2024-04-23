import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection } from "../gdcapi/filters";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { Bucket } from "../gdcapi/gdcapi";

const graphQLQuery = `query CancerDistribution($caseFilters: FiltersArgument, $caseAggsFilters: FiltersArgument, $ssmTested: FiltersArgument, $ssmFilters: FiltersArgument) {
  viewer {
    explore {
      ssms {
        hits(first: 0, case_filters: $caseFilters, filters: $ssmFilters) {
          total
        }
      }
      cases {
        ssmFiltered: aggregations(case_filters: $caseFilters, filters: $caseAggsFilters) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        },
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
`;

interface SsmPlotPoint {
  readonly project: string;
  readonly ssmCount: number;
  readonly totalCount: number;
}

export interface SsmPlotData {
  readonly cases: SsmPlotPoint[];
  readonly ssmCount: number;
}

interface SsmPlotRequest {
  gene: string;
  ssms: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}

const ssmPlotSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    ssmPlot: builder.query<SsmPlotData, SsmPlotRequest>({
      query: ({ gene, ssms, cohortFilters, genomicFilters }) => {
        const gqlGenomicFilters = buildCohortGqlOperator(genomicFilters);
        const gqlContextIntersection =
          gqlGenomicFilters && (gqlGenomicFilters as GqlIntersection).content
            ? (gqlGenomicFilters as GqlIntersection).content
            : [];
        const graphQLFilters = gene
          ? {
              caseFilters: buildCohortGqlOperator(cohortFilters),
              caseAggsFilters: {
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
                    op: "in",
                    content: {
                      field: "genes.gene_id",
                      value: [gene],
                    },
                  },
                  {
                    op: "not",
                    content: {
                      field: "cases.gene.ssm.observation.observation_id",
                      value: "MISSING",
                    },
                  },
                  ...gqlContextIntersection,
                ],
              },
              ssmFilters: {
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
                    op: "in",
                    content: {
                      field: "genes.gene_id",
                      value: [gene],
                    },
                  },
                  ...gqlContextIntersection,
                ],
              },
              ssmTested: {
                op: "and",
                content: [
                  {
                    op: "in",
                    content: {
                      field: "cases.available_variation_data",
                      value: ["ssm"],
                    },
                  },
                ],
              },
            }
          : {
              caseAggsFilters: {
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
                    op: "in",
                    content: {
                      field: "ssms.ssm_id",
                      value: [ssms],
                    },
                  },
                ],
              },
              ssmTested: {
                op: "and",
                content: [
                  {
                    op: "in",
                    content: {
                      field: "cases.available_variation_data",
                      value: ["ssm"],
                    },
                  },
                ],
              },
            };

        return {
          graphQLQuery,
          graphQLFilters,
        };
      },
      transformResponse: (response) => {
        const ssm =
          response?.data?.viewer?.explore?.cases?.ssmFiltered?.project__project_id?.buckets.map(
            (d: Bucket) => ({ ssmCount: d.doc_count, project: d.key }),
          ) || [];
        const total =
          response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
            (d: Bucket) => ({ totalCount: d.doc_count, project: d.key }),
          );

        const merged = ssm.map((d: SsmPlotPoint) => ({
          ...d,
          ...total.find((t: SsmPlotPoint) => t.project === d.project),
        }));
        return {
          cases: merged,
          ssmCount: response?.data?.viewer?.explore?.ssms?.hits?.total,
        };
      },
    }),
  }),
});

export const { useSsmPlotQuery } = ssmPlotSlice;
