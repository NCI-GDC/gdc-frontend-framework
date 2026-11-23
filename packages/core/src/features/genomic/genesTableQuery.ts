import { buildSsmsAggregationsFilters } from "./ssmsAggregationsApi";
import { GenomicTableProps } from "./types";
import {
  buildCohortGqlOperator,
  extractFiltersWithPrefixFromFilterSet,
  filterSetToOperation,
} from "../cohort";
import {
  convertFilterToGqlFilter,
  UnionOrIntersection,
} from "../gdcapi/filters";

export const GenesTableGraphQLQuery = `
          query GenesTable(
            $caseFilters: FiltersArgument
            $genesTable_filters: FiltersArgument
            $genesTable_size: Int
            $genesTable_offset: Int
            $score: String
            $ssmCase: FiltersArgument
            $geneCaseFilter: FiltersArgument
            $ssmTested: FiltersArgument
            $cnvTested: FiltersArgument
            $cnvGainFilters: FiltersArgument
            $cnvLossFilters: FiltersArgument
            $cnvAmplificationFilters: FiltersArgument
            $cnvHomozygousDeletionFilters: FiltersArgument
            $sort: [Sort]
          ) {
            genesTableViewer: viewer {
              explore {
                cases {
                  hits(first: 0, case_filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(first: 0, case_filters: $geneCaseFilter) {
                    total
                  }
                }
                cnvCases: cases {
                  hits(first: 0, case_filters: $cnvTested) {
                    total
                  }
                }
                genes {
                  hits(
                    first: $genesTable_size
                    offset: $genesTable_offset
                    filters: $genesTable_filters
                    case_filters: $caseFilters
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
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvTested) {
                            total
                          }
                        }
                        case_cnv_gain: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvGainFilters) {
                            total
                          }
                        }
                        case_cnv_loss: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvLossFilters) {
                            total
                          }
                        }
                        case_cnv_amplification: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvAmplificationFilters) {
                            total
                          }
                        }
                        case_cnv_homozygous_deletion: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvHomozygousDeletionFilters) {
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

export const buildGenesTableFilters = ({
  pageSize,
  offset,
  genesTableFilters,
  genomicFilters,
  cohortFilters,
}: GenomicTableProps): Record<string, unknown> => {
  const caseFilters = buildCohortGqlOperator(cohortFilters);
  const cohortFiltersContent = caseFilters?.content
    ? Object(caseFilters?.content)
    : [];
  const genesTable_filters = buildCohortGqlOperator(genesTableFilters);

  /**
   * Only apply "genes." filters to the genes table's CNV gain and loss filters.
   */
  const onlyGenesFilters = buildCohortGqlOperator(
    extractFiltersWithPrefixFromFilterSet(genomicFilters, "genes."),
  );

  return {
    caseFilters: caseFilters ? caseFilters : {},
    genesTable_filters: genesTable_filters ? genesTable_filters : {},
    genesTable_size: pageSize,
    genesTable_offset: offset,
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
              field: "cnvs.cnv_change_5_category",
              value: ["Gain"],
            },
            op: "in",
          },
        ],
        ...(onlyGenesFilters?.content ? Object(onlyGenesFilters?.content) : []),
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
              field: "cnvs.cnv_change_5_category",
              value: ["Loss"],
            },
            op: "in",
          },
        ],
        ...(onlyGenesFilters?.content ? Object(onlyGenesFilters?.content) : []),
      ],
    },
    cnvAmplificationFilters: {
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
              field: "cnvs.cnv_change_5_category",
              value: ["Amplification"],
            },
            op: "in",
          },
        ],
        ...(onlyGenesFilters?.content ? Object(onlyGenesFilters?.content) : []),
      ],
    },
    cnvHomozygousDeletionFilters: {
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
              field: "cnvs.cnv_change_5_category",
              value: ["Homozygous Deletion"],
            },
            op: "in",
          },
        ],
        ...(onlyGenesFilters?.content ? Object(onlyGenesFilters?.content) : []),
      ],
    },
  };
};

export const buildGenesMutationCountsFilters = (
  { genomicFilters, cohortFilters }: GenomicTableProps,
  geneIds: ReadonlyArray<string>,
): Record<string, unknown> => {
  const baseFilters = filterSetToOperation(genomicFilters) as
    | UnionOrIntersection
    | undefined;

  const rawFilterContents =
    baseFilters && convertFilterToGqlFilter(baseFilters)?.content;
  const filterContents = rawFilterContents ? Object(rawFilterContents) : [];

  return buildSsmsAggregationsFilters({
    ids: geneIds,
    filters: filterContents,
    caseFilters: buildCohortGqlOperator(cohortFilters),
  });
};
