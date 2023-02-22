import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  buildCohortGqlOperator,
  FilterSet,
  filterSetToOperation,
} from "../cohort";
import {
  convertFilterToGqlFilter,
  Intersection,
  Union,
} from "../gdcapi/filters";
import { appendFilterToOperation } from "./utils";
import { GenomicTableProps } from "./types";
import { joinFilters } from "../cohort";
import { Reducer } from "@reduxjs/toolkit";
import { DataStatus } from "src/dataAccess";

const SSMSTableGraphQLQuery = `query SsmsTable(
  $ssmTested: FiltersArgument
$ssmCaseFilter: FiltersArgument
$ssmsTable_size: Int
$consequenceFilters: FiltersArgument
$ssmsTable_offset: Int
$ssmsTable_filters: FiltersArgument
$score: String
$sort: [Sort]
) {
  viewer {
    explore {
      cases {
        hits(first: 0, filters: $ssmTested) {
          total
        }
      }
      filteredCases: cases {
        hits(first: 0, filters: $ssmCaseFilter) {
          total
        }
      }
      ssms {
        hits(first: $ssmsTable_size, offset: $ssmsTable_offset, filters: $ssmsTable_filters, score: $score, sort: $sort) {
          total
          edges {
            node {
              id
              score
              genomic_dna_change
              mutation_subtype
              ssm_id
              consequence {
                hits(first: 1, filters: $consequenceFilters) {
                  edges {
                    node {
                      transcript {
                        is_canonical
                        annotation {
                          vep_impact
                          polyphen_impact
                          polyphen_score
                          sift_score
                          sift_impact
                        }
                        consequence_type
                        gene {
                          gene_id
                          symbol
                        }
                        aa_change
                      }
                      id
                    }
                  }
                }
              }
              filteredOccurences: occurrence {
                hits(first: 0, filters: $ssmCaseFilter) {
                  total
                }
              }
              occurrence {
                hits(first: 0, filters: $ssmTested) {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export interface SSMSConsequence {
  readonly id: string;
  readonly transcript: {
    readonly aa_change: string;
    readonly annotation: {
      readonly polyphen_impact: string;
      readonly polyphen_score: number;
      readonly sift_impact: string;
      readonly sift_score: string;
      readonly vep_impact: string;
      readonly hgvsc?: string;
    };
    readonly consequence_type: string;
    readonly gene: {
      readonly gene_id: string;
      readonly symbol: string;
      readonly gene_strand?: number;
    };
    readonly is_canonical: boolean;
    readonly transcript_id?: string;
  };
}
export interface SSMSData {
  readonly ssm_id: string;
  readonly occurrence: number;
  readonly filteredOccurrences: number;
  readonly id: string;
  readonly score: number;
  readonly genomic_dna_change: string;
  readonly mutation_subtype: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
}

export interface GDCSsmsTable {
  readonly cases: number;
  readonly filteredCases: number;
  readonly ssmsTotal: number;
  readonly ssms: ReadonlyArray<SSMSData>;
  readonly pageSize: number;
  readonly offset: number;
}

export const buildSSMSTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: "or",
      operands: [
        {
          operator: "includes",
          field: "ssms.genomic_dna_change",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "ssms.gene_aa_change",
          operands: [`*${term}*`],
        },
      ],
    };
  }
  return undefined;
};

export interface SsmsTableRequestParameters extends GenomicTableProps {
  readonly geneSymbol?: string;
  isDemoMode: boolean;
  overwritingDemoFilter: FilterSet;
  localPlusCohortFilters: FilterSet;
  currentCohortFilter: FilterSet;
}

interface ssmtableResponse {
  viewer: {
    explore: {
      cases: {
        hits: {
          total: number;
        };
      };
      filteredCases: {
        hits: {
          total: number;
        };
      };
      ssms: {
        hits: {
          edges: ReadonlyArray<{
            node: {
              readonly consequence: {
                hits: {
                  edges: ReadonlyArray<{
                    node: SSMSConsequence;
                  }>;
                };
              };
              filteredOccurences: {
                hits: {
                  total: number;
                };
              };
              genomic_dna_change: string;
              id: string;
              mutation_subtype: string;
              occurrence: {
                hits: {
                  total: number;
                };
              };
              score: number;
              ssm_id: string;
            };
          }>;
          total: number;
        };
      };
    };
  };
}

export interface SsmsTableState {
  readonly ssms: GDCSsmsTable;
  readonly status: DataStatus;
  readonly error?: string;
}

const generateFilter = ({
  pageSize,
  offset,
  searchTerm,
  genomicFilters,
  geneSymbol,
  isDemoMode,
  overwritingDemoFilter,
  currentCohortFilter,
  localPlusCohortFilters,
}: SsmsTableRequestParameters) => {
  const cohortFilters = buildCohortGqlOperator(
    geneSymbol // if gene symbol use all GDC
      ? joinFilters(
          {
            mode: "and",
            root: {
              "genes.symbol": {
                field: "genes.symbol",
                operator: "includes",
                operands: [geneSymbol],
              },
            },
          },
          localPlusCohortFilters,
        )
      : isDemoMode
      ? overwritingDemoFilter
      : currentCohortFilter,
  );
  const cohortFiltersContent = cohortFilters?.content
    ? Object(cohortFilters?.content)
    : [];

  const geneAndCohortFilters = geneSymbol
    ? joinFilters(localPlusCohortFilters, {
        mode: "and",
        root: {
          "genes.symbol": {
            field: "genes.symbol",
            operator: "includes",
            operands: [geneSymbol],
          },
        },
      })
    : localPlusCohortFilters;

  const searchFilters = buildSSMSTableSearchFilters(searchTerm);
  const tableFilters = isDemoMode
    ? convertFilterToGqlFilter(
        appendFilterToOperation(
          filterSetToOperation(
            joinFilters(overwritingDemoFilter, genomicFilters),
          ) as Union | Intersection | undefined,
          searchFilters,
        ),
      )
    : convertFilterToGqlFilter(
        appendFilterToOperation(
          filterSetToOperation(geneAndCohortFilters) as
            | Union
            | Intersection
            | undefined,
          searchFilters,
        ),
      );

  const graphQlFilters = {
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
    ssmCaseFilter: {
      content: [
        ...[
          {
            content: {
              field: "available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
        ],
        ...cohortFiltersContent,
      ],
      op: "and",
    },
    ssmsTable_size: pageSize,
    consequenceFilters: {
      content: [
        {
          content: {
            field: "consequence.transcript.is_canonical",
            value: ["true"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
    ssmsTable_offset: offset,
    ssmsTable_filters: tableFilters ? tableFilters : {},
    score: "occurrence.case.project.project_id",
    sort: [
      {
        field: "_score",
        order: "desc",
      },
      {
        field: "_uid",
        order: "asc",
      },
    ],
  };

  return graphQlFilters;
};

export const smtableslice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getSssmTableData: builder.query({
      query: (request: SsmsTableRequestParameters) => ({
        graphQLQuery: SSMSTableGraphQLQuery,
        graphQLFilters: generateFilter(request),
      }),
      transformResponse: (response: GraphQLApiResponse<ssmtableResponse>) => {
        const data = response.data.viewer.explore;
        const ssmsTotal = data.ssms.hits.total;
        const cases = data.cases.hits.total;
        const filteredCases = data.filteredCases.hits.total;
        const ssms = data.ssms.hits.edges.map(({ node }): SSMSData => {
          return {
            ssm_id: node.ssm_id,
            score: node.score,
            id: node.id,
            mutation_subtype: node.mutation_subtype,
            genomic_dna_change: node.genomic_dna_change,
            occurrence: node.occurrence.hits.total,
            filteredOccurrences: node.filteredOccurences.hits.total,
            consequence: node.consequence.hits.edges.map(({ node }) => {
              const transcript = node.transcript;
              return {
                id: node.id,
                transcript: {
                  aa_change: node.transcript.aa_change,
                  annotation: { ...node.transcript.annotation },
                  consequence_type: transcript.consequence_type,
                  gene: { ...transcript.gene },
                  is_canonical: transcript.is_canonical,
                },
              };
            }),
          };
        });

        return {
          ssmsTotal,
          cases,
          filteredCases,
          ssms,
        };
      },
    }),
  }),
});

export const { useGetSssmTableDataQuery } = smtableslice;
export const ssmsTableReducer: Reducer = smtableslice.reducer as Reducer;
