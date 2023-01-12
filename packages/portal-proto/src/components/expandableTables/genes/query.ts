import {
  buildCohortGqlOperator,
  CoreDispatch,
  CoreState,
  selectCurrentCohortFilters,
  selectCurrentCohortFilterOrCaseSet,
  joinFilters,
  FilterSet,
  graphqlAPI,
} from "@gff/core";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLApiResponse } from "@gff/core";
import { fetchSmsAggregations } from "../../../../../core/src/features/genomic/smsAggregationsApi";

export const genesTableDownloadQuery = `
query GenesTable(
  $genesTable_size: Int
  $genesTable_offset: Int
  $score: String
  $ssmCase: FiltersArgument
  $geneCaseFilter: FiltersArgument
  $ssmTested: FiltersArgument
  $cnvTested: FiltersArgument
  $cnvGainFilters: FiltersArgument
  $cnvLossFilters: FiltersArgument
  $sort: [Sort]
) {
  genesTableDownloadViewer: viewer {
    explore {
      cases {
        hits(first: 0, filters: $ssmTested) {
          total
        }
      }
      filteredCases: cases {
        hits(first: 0, filters: $geneCaseFilter) {
          total
        }
      }
      cnvCases: cases {
        hits(first: 0, filters: $cnvTested) {
          total
        }
      }
      genes {
        hits(
          first: $genesTable_size
          offset: $genesTable_offset
          score: $score
          sort: $sort
        ) {
          total
          edges {
            node {
              id
              numCases: score
              symbol
              name
              cytoband
              biotype
              gene_id
              is_cancer_gene_census
              ssm_case: case {
                hits(first: 0, filters: $ssmCase) {
                  total
                }
              }
              cnv_case: case {
                hits(first: 0, filters: $cnvTested) {
                  total
                }
              }
              case_cnv_gain: case {
                hits(first: 0, filters: $cnvGainFilters) {
                  total
                }
              }
              case_cnv_loss: case {
                hits(first: 0, filters: $cnvLossFilters) {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

interface GenomicTableDownloadProps {
  totalCount: number;
  genomicFilters: FilterSet;
}

export const fetchGTableDL = createAsyncThunk<
  GraphQLApiResponse,
  GenomicTableDownloadProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/genesTable/download",
  async (
    { totalCount, genomicFilters }: GenomicTableDownloadProps,
    thunkAPI,
  ): Promise<GraphQLApiResponse> => {
    const cohortFilters = buildCohortGqlOperator(
      selectCurrentCohortFilters(thunkAPI.getState()),
    );
    const cohortFiltersContent = cohortFilters?.content
      ? Object(cohortFilters?.content)
      : [];
    const geneAndCohortFilters = joinFilters(
      selectCurrentCohortFilterOrCaseSet(thunkAPI.getState()),
      genomicFilters,
    );
    const filters = buildCohortGqlOperator(geneAndCohortFilters);
    const filterContents = filters?.content ? Object(filters?.content) : [];
    const graphQLFilters = {
      genesTable_size: totalCount,
      genesTable_offset: 0,
      score: "case.project.project_id",
      ssmCase: {
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
              field: "genes.case.ssm.observation.observation_id",
              value: "MISSING",
            },
          },
        ],
      },
      geneCaseFilter: {
        content: [
          ...[
            {
              content: {
                field: "cases.available_variation_data",
                value: ["ssm"],
              },
              op: "in",
            },
          ],
          ...cohortFiltersContent,
        ],
        op: "and",
      },
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
      cnvTested: {
        op: "and",
        content: [
          ...[
            {
              content: {
                field: "cases.available_variation_data",
                value: ["cnv"],
              },
              op: "in",
            },
          ],
          ...cohortFiltersContent,
        ],
      },
      cnvGainFilters: {
        op: "and",
        content: [
          ...[
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
          ],
          ...cohortFiltersContent,
        ],
      },
      cnvLossFilters: {
        op: "and",
        content: [
          ...[
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
          ],
          ...cohortFiltersContent,
        ],
      },
    };
    const results: GraphQLApiResponse<any> = await graphqlAPI(
      genesTableDownloadQuery,
      graphQLFilters,
    );
    // if (!results.errors) {
    //   // extract the gene ids and user it for the call to
    //   const geneIds =
    //     results.data.genesTableDownloadViewer.explore.genes.hits.edges.map(
    //       ({ node }: Record<string, any>) => node.gene_id,
    //     );
    //   const counts = await fetchSmsAggregations({
    //     ids: geneIds,
    //     filters: filterContents,
    //   });
    //   if (!counts.errors) {
    //     const countsData =
    //       counts.data.ssmsAggregationsViewer.explore.ssms.aggregations
    //         .consequence__transcript__gene__gene_id;
    //     results.data.genesTableDownloadViewer["mutationCounts"] =
    //       countsData.buckets.reduce(
    //         (
    //           counts: Record<string, number>,
    //           apiBucket: Record<string, any>,
    //         ) => {
    //           counts[apiBucket.key] = apiBucket.doc_count.toLocaleString();
    //           return counts;
    //         },
    //         {} as Record<string, number>,
    //       );
    //   }
    // }
    console.log("results", results);
    return results;
  },
);

// todo: add this to transform response

// const body = dataFromHook
//   .map({
//   symbol,
//   name,
//   numCases,
//   filteredCases,
//   ssm_case,
//   cases,
//   cnvCases,
//   case_cnv_gain,
//   case_cnv_loss,
//   mutationCounts,
//   gene_id
//   is_cancer_gene_census
//  }) =>
//     [
//       symbol,
//       name,
//       `{ numCases } / { filteredCases } ( ... )`,
//       `{ ssm_case } / { cases } ( ... )`,
//       cnvCases > 0 ? `${case_cnv_gain.toLocaleString()} / ${cnvCases.toLocaleString()}
//       (${((100 * case_cnv_gain) / cnvCases).toFixed(2)}%)`,
//       : `--`,
//       cnvCases > 0 ? `${case_cnv_loss.toLocaleString()} / ${cnvCases.toLocaleString()}
//       (${((100 * case_cnv_loss) / cnvCases).toFixed(2)}%)`
//       : `--`,
//       mutationCounts[gene_id],
//       is_cancer_genus,
//     ].join("\t"),
//   )
//   .join("\n");

// body -> data

// const tsv = [headers.join("\t"), data].join("\n");
// const blob = new Blob([tsv], { type: "text/csv" });

// saveAs(blob, `${fileName}.{dl}`);
