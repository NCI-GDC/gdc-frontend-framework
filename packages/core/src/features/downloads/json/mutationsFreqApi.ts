import { graphqlAPI, GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CoreDispatch } from "src/store";
import { CoreState } from "src/reducers";

export const getMutationsFreqQuery = (): string => {
  return `query MutationsFreqQuery(
  $filters_ssms_tested: FiltersArgument 
  $filters_ssms_cases: FiltersArgument
  $filters_consequence: FiltersArgument
  $filters_ssms_table: FiltersArgument
  $score: String
  $sort: [Sort]
  $offset: Int
  $size: Int
  ) {
    viewer {
      explore {
        cases {
          hits(first: 0, filters: $filters_ssms_tested) {
            total
          }
        }
        filteredCases: cases {
          hits(first: 0, filters: $filters_ssms_cases) {
            total
          }
        }
        ssms {
          hits(first: $size, offset: $offset, filters: $filters_ssms_table, score: $score, sort: $sort) {
            total
            edges {
              node {
                id
                score
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
                filteredOccurences: occurrence {
                  hits(first: 0, filters: $filters_ssms_cases) {
                    total
                  }
                }
                what: occurrence {
                  hits(first: 0, filters: $filters_ssms_tested) {
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

export const getMutationsFreqFilters = (size: number): Record<string, any> => {
  const mutationFreqFilters = {
    size: size,
    offset: 0,
    filters_ssms_tested: {
      content: [
        {
          content: { field: "cases.available_variation_data", value: ["ssm"] },
          op: "in",
        },
      ],
      op: "and",
    },
    filters_ssms_cases: {
      content: [
        {
          content: { field: "available_variation_data", value: ["ssm"] },
          op: "in",
        },
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
    filters_ssms_table: {
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
          content: { field: "genes.is_cancer_gene_census", value: ["true"] },
        },
      ],
    },
    score: "occurrence.case.project.project_id",
    sort: [
      { field: "_score", order: "desc" },
      { field: "_uid", order: "asc" },
    ],
  };
  return mutationFreqFilters;
};

export interface MutationsFreqRequestParameters {
  size: number;
}

export const fetchMutationsFreq = createAsyncThunk<
  GraphQLApiResponse,
  MutationsFreqRequestParameters,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "mutationsFreq/fetchMutationsFreq",
  async ({
    size,
  }: MutationsFreqRequestParameters): Promise<GraphQLApiResponse> => {
    return await graphqlAPI(
      getMutationsFreqQuery(),
      getMutationsFreqFilters(size),
    );
  },
);
