import { graphqlAPI, GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";

export const getMutatedGenesFreqQuery = (size: number) => {
  return `
query MutatedGenesFreq(
  $genesTable_offset: Int
  $score: String
) {
  viewer {
    explore {
      genes {
        hits(
          first: ${`${size}`}
          offset: $genesTable_offset
          score: $score
        ) {
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
};

export interface MutatedGenesFreqResponse {
  viewer: {
    explore: {
      genes: {
        hits: {
          edges: Array<{
            node: {
              symbol: string;
              name: string;
              cytoband: string[];
              biotype: string;
              gene_id: string;
            };
          }>;
        };
      };
    };
  };
}

export const fetchMutatedGenesFreqQuery = async ({
  genomic_filters,
}: {
  genomic_filters: any;
}): Promise<GraphQLApiResponse<MutatedGenesFreqResponse>> => {
  const graphQlFilters = genomic_filters ? { filters: genomic_filters } : {};
  return await graphqlAPI(getMutatedGenesFreqQuery(1000), {
    graphQlFilters,
  });
};
