import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { buildCohortGqlOperator } from "../cohort";
import { GenomicTableProps } from "./types";

const GeneMutationFrequencyQuery = `
    query GeneMutationFrequencyChart (
      $geneCaseFilter: FiltersArgument
      $geneFrequencyChart_filters: FiltersArgument
      $geneFrequencyChart_size: Int
      $geneFrequencyChart_offset: Int
      $score: String
    ) {
      geneFrequencyChartViewer: viewer {
        explore {
          cases {
            hits(first: 0, case_filters: $geneCaseFilter) {
              total
            }
          }
          genes {
            hits(first: $geneFrequencyChart_size, offset: $geneFrequencyChart_offset, case_filters: $geneCaseFilter, filters: $geneFrequencyChart_filters, score: $score) {
              total
              edges {
                node {
                  id
                  numCases: score
                  symbol
                  name
                  biotype
                  gene_id
                  is_cancer_gene_census
                }
              }
            }
          }
        }
      }
    }
`;

interface GeneFrequencyEntry {
  readonly gene_id: string;
  readonly numCases: number;
  readonly symbol: string;
}

export interface GenesFrequencyChart {
  readonly geneCounts: ReadonlyArray<GeneFrequencyEntry>;
  readonly casesTotal: number;
  readonly genesTotal: number;
}

const geneFrequencyChartSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    geneFrequencyChart: builder.query<GenesFrequencyChart, GenomicTableProps>({
      query: ({ cohortFilters, genomicFilters, pageSize = 20, offset = 0 }) => {
        const caseFilters = buildCohortGqlOperator(cohortFilters);
        const cohortFiltersContent = caseFilters?.content
          ? Object(caseFilters?.content)
          : [];

        const graphQlVariables = {
          geneFrequencyChart_filters:
            buildCohortGqlOperator(genomicFilters) ?? {},
          geneFrequencyChart_size: pageSize,
          geneFrequencyChart_offset: offset,
          geneCaseFilter: {
            content: [
              {
                content: {
                  field: "cases.available_variation_data",
                  value: ["ssm"],
                },
                op: "in",
              },
              ...cohortFiltersContent,
            ],
            op: "and",
          },
          score: "case.project.project_id",
        };

        return {
          graphQLFilters: graphQlVariables,
          graphQLQuery: GeneMutationFrequencyQuery,
        };
      },
      transformResponse: (response) => {
        const data = response.data.geneFrequencyChartViewer.explore;
        return {
          casesTotal: data.cases.hits.total,
          genesTotal: data.genes.hits.total,
          geneCounts: data.genes.hits.edges.map(
            ({ node }: { node: GeneFrequencyEntry }) => ({
              gene_id: node.gene_id,
              numCases: node.numCases,
              symbol: node.symbol,
            }),
          ),
        };
      },
    }),
  }),
});

export const { useGeneFrequencyChartQuery } = geneFrequencyChartSlice;
