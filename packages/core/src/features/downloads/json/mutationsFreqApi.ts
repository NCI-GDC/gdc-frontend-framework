import { FilterSet } from "src";
import { graphqlAPI, GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CoreDispatch } from "src/store";
import { CoreState } from "src/reducers";
import {
  selectCurrentCohortFilters,
  mergeGenomicAndCohortFilters,
} from "@gff/core";

export const getMutationsFreqQuery = (size: number) => {
  return `query MutationsFreq(
        $ssmTested: FiltersArgument
        $ssmCaseFilter: FiltersArgument
        $consequenceFilters: FiltersArgument
        $ssmsTable_offset: Int
        $ssmsTable_filters: FiltersArgument
        $sort: [Sort]
        ) {
        viewer {
          explore {
            ssms {
              hits(first:  ${`${size}`}, offset: $ssmsTable_offset, filters: $ssmsTable_filters, score: $score, sort: $sort) {
                edges {
                  node {
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
                                sift_impact
                              }
                              consequence_type
                              gene {
                                gene_id
                                symbol
                              }
                              aa_change
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`;
};

export interface MutationsFreqResponse {
  viewer: {
    explore: {
      ssms: {
        hits: {
          edges: Array<{
            node: {
              genomic_dna_change: string;
              mutation_subtype: string;
              consequence: {
                edges: Array<{
                  node: {
                    transcript: {
                      is_canonical: boolean;
                      annotation: {
                        vep_impact: string;
                        polyphen_impact: string;
                        sift_impact: string;
                      };
                      consequence_type: string;
                      gene: {
                        gene_id: string;
                        symbol: string;
                      };
                      aa_change: string;
                    };
                  };
                }>;
              };
              biotype: string;
              gene_id: string;
            };
          }>;
        };
      };
    };
  };
}

export const getMutationsFreqFilters = (cohortFilters: object) => {
  const mutationsFreqFilters = {
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
        ...[cohortFilters],
      ],
      op: "and",
    },
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
  return mutationsFreqFilters;
};

export interface MutationsFreqRequestParameters {
  size: number;
  genomicFilters: FilterSet;
}

export const fetchMutationsFreq = createAsyncThunk<
  GraphQLApiResponse,
  MutationsFreqRequestParameters,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "mutationsFreq/fetchMutationsFreq",
  async (
    { size, genomicFilters }: MutationsFreqRequestParameters,
    thunkAPI,
  ): Promise<GraphQLApiResponse> => {
    const cohortFilters = selectCurrentCohortFilters(
      thunkAPI.getState() as any,
    );
    // const cohortFiltersContent = cohortFilters?.content
    //   ? Object(cohortFilters?.content)
    //   : [];
    const geneAndCohortFilters = mergeGenomicAndCohortFilters(
      cohortFilters as any,
      genomicFilters,
    );
    const graphQlFilters = getMutationsFreqFilters(geneAndCohortFilters);

    return await graphqlAPI(getMutationsFreqQuery(size), graphQlFilters);
  },
);
