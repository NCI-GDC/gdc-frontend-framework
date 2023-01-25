import { graphqlAPI, GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";

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

export const fetchMutationsFreqQuery = async ({
  currentFilters,
  size,
}: {
  currentFilters: any;
  size: number;
}): Promise<GraphQLApiResponse<MutationsFreqResponse>> => {
  const graphQlFilters = currentFilters ? { filters: currentFilters } : {};
  return await graphqlAPI(getMutationsFreqQuery(size), {
    graphQlFilters,
  });
};
