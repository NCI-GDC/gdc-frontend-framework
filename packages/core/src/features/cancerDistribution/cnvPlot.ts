import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection, Includes } from "../gdcapi/filters";
import { Bucket } from "../gdcapi/gdcapi";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

const graphQLQuery = `query CancerDistributionCNV(
  $caseFilters: FiltersArgument,
  $cnvAll: FiltersArgument,
  $cnvGain: FiltersArgument,
  $cnvLoss: FiltersArgument,
  $cnvTested: FiltersArgument,
  $cnvTestedByGene: FiltersArgument
  ) {
  viewer {
    explore {
      cases {
        cnvAll: hits(case_filters: $caseFilters,  filters: $cnvAll) {
          total
        }
        gain: aggregations(case_filters: $caseFilters, filters: $cnvGain) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        loss: aggregations(case_filters: $caseFilters, filters: $cnvLoss) {
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
        cnvTestedByGene: hits(case_filters: $caseFilters, filters: $cnvTestedByGene) {
          total
        }
      }
    }
  }
}
`;

interface CNVPlotPoint {
  readonly project: string;
  readonly gain: number;
  readonly loss: number;
  readonly total: number;
}

interface CNVData {
  readonly cases: CNVPlotPoint[];
  readonly caseTotal: number;
  readonly mutationTotal: number;
}

interface CNVPlotRequest {
  gene: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
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
          cnvAll: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.available_variation_data",
                  value: ["cnv"],
                },
              },
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change",
                  value: ["Gain", "Loss"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvGain: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.available_variation_data",
                  value: ["cnv"],
                },
              },
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change",
                  value: ["Gain"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvLoss: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.available_variation_data",
                  value: ["cnv"],
                },
              },
              {
                op: "in",
                content: {
                  field: "cnvs.cnv_change",
                  value: ["Loss"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvTested: {
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
          cnvTestedByGene: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.available_variation_data",
                  value: ["cnv"],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          caseFilters: caseFilters,
        };

        return {
          graphQLQuery,
          graphQLFilters,
        };
      },
      transformResponse: (response) => {
        const gain: CNVPlotPoint[] =
          response?.data?.viewer?.explore?.cases?.gain?.project__project_id?.buckets.map(
            (doc: Bucket) => ({ gain: doc.doc_count, project: doc.key }),
          ) || [];
        const loss: CNVPlotPoint[] =
          response?.data?.viewer?.explore?.cases?.loss?.project__project_id?.buckets.map(
            (doc: Bucket) => ({ loss: doc.doc_count, project: doc.key }),
          ) || [];
        const total: CNVPlotPoint[] =
          response?.data?.viewer?.explore?.cases?.cnvTotal?.project__project_id?.buckets.map(
            (doc: Bucket) => ({ total: doc.doc_count, project: doc.key }),
          );

        const merged = total.map((doc) => ({
          ...doc,
          ...gain.find((gain) => gain.project === doc.project),
          ...loss.find((loss) => loss.project === doc.project),
        }));
        return {
          cases: merged,
          mutationTotal: response?.data?.viewer?.explore?.cases?.cnvAll?.total,
          caseTotal:
            response?.data?.viewer?.explore?.cases.cnvTestedByGene?.total,
        };
      },
    }),
  }),
});

export const { useCnvPlotQuery } = cnvPlotSlice;
