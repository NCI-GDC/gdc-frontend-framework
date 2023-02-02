import { FilterSet, Intersection, Union } from "src";
import { graphqlAPI, GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CoreDispatch } from "src/store";
import { CoreState } from "src/reducers";
import {
  // selectCurrentCohortFilters,
  mergeGenomicAndCohortFilters,
  // filterSetToOperation,
  // convertFilterToGqlFilter,
  // buildCohortGqlOperator,
} from "@gff/core";

export const getMutationsFreqQuery = (size: number) => {
  //         $filters_ssms: FiltersArgument
  return `query MutationsFreq(
        $filters_ssms_case: FiltersArgument
        $filters_consequence: FiltersArgument
        $sort: [Sort]
        ) {
        viewer {
          explore {
            ssms {
              hits(first: ${`${size}`}, filters: $filters_ssms_case sort: $sort) {
                edges {
                  node {
                    genomic_dna_change
                    mutation_subtype
                    ssm_id
                    consequence {
                      hits(first: 1, filters: $filters_consequence) {
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

export const getMutationsFreqFilters = () => {
  const mutationsFreqFilters = {
    filters_ssms: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.case_id",
            value: ["set_id:genes-ALL-GDC-COHORT"],
          },
        },
        {
          op: "in",
          content: {
            field: "genes.is_cancer_gene_census",
            value: ["true"],
          },
        },
      ],
    },
    filters_ssms_case: {
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
        {
          op: "in",
          content: {
            field: "cases.case_id",
            value: ["set_id:genes-ALL-GDC-COHORT"],
          },
        },
      ],
      op: "and",
    },
    filters_consequence: {
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
    console.log("genomic", genomicFilters);
    console.log("hmm", thunkAPI.getState());
    // const graphQlFilters = convertFilterToGqlFilter(geneAndCohortFilters);
    // const cohortFiltersContent = cohortFilters?.content
    //   ? Object(cohortFilters?.content)
    //   : [];

    return await graphqlAPI(
      getMutationsFreqQuery(size),
      getMutationsFreqFilters(),
    );
  },
);
