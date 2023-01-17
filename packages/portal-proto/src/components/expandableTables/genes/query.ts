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

export const dlMutatedGenesJSONQuery = `
query GenesTable(
  $genesTable_size: Int
  $genesTable_offset: Int
  $score: String
) {
  genesTableDownloadViewer: viewer {
    explore {
      genes {
        hits(
          first: $genesTable_size
          offset: $genesTable_offset
          score: $score
        ) {
          total
          edges {
            node {
              symbol
              name
              cytoband
              biotype
              gene_id
            }
          }
        }
      }
    }
  }
}
`;

// todo: add aggregations
export const dlMutatedGenesTSVQuery = `
query GenesTable(
  $genesTable_size: Int
  $genesTable_offset: Int
  $score: String
) {
  genesTableDownloadViewer: viewer {
    explore {
      genes {
        hits(
          first: $genesTable_size
          offset: $genesTable_offset
          score: $score
        ) {
          total
          edges {
            node {
              symbol
              name
              cytoband
              biotype
              gene_id
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

export const fetchedMutatedGenesTSV = createAsyncThunk<
  GraphQLApiResponse,
  GenomicTableDownloadProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/mutatedGenes/tsv",
  async (
    { totalCount, genomicFilters }: GenomicTableDownloadProps,
    thunkAPI,
  ): Promise<GraphQLApiResponse> => {
    const geneAndCohortFilters = joinFilters(
      selectCurrentCohortFilterOrCaseSet(thunkAPI.getState()),
      genomicFilters,
    );
    const filters = buildCohortGqlOperator(geneAndCohortFilters);
    const filtersContent = filters?.content ? Object(filters?.content) : [];
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
          ...filtersContent,
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
          ...filtersContent,
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
          ...filtersContent,
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
          ...filtersContent,
        ],
      },
    };
    const results: GraphQLApiResponse<any> = await graphqlAPI(
      dlMutatedGenesTSVQuery,
      graphQLFilters,
    );
    console.log("results", results);
    debugger;
    return results;
  },
);

export const fetchedMutatedGenesJSON = createAsyncThunk<
  GraphQLApiResponse,
  GenomicTableDownloadProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genes/mutatedGenes/json",
  async (
    { totalCount, genomicFilters }: GenomicTableDownloadProps,
    thunkAPI,
  ): Promise<GraphQLApiResponse> => {
    const geneAndCohortFilters = joinFilters(
      selectCurrentCohortFilterOrCaseSet(thunkAPI.getState()),
      genomicFilters,
    );
    const filters = buildCohortGqlOperator(geneAndCohortFilters);
    const filtersContent = filters?.content ? Object(filters?.content) : [];
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
          ...filtersContent,
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
          ...filtersContent,
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
          ...filtersContent,
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
          ...filtersContent,
        ],
      },
    };
    const results: GraphQLApiResponse<any> = await graphqlAPI(
      dlMutatedGenesJSONQuery,
      graphQLFilters,
    );
    console.log("results", results);
    debugger;
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
