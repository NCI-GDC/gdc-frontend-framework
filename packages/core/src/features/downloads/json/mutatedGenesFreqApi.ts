import { graphqlAPI, GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";

export const getMutatedGenesFreqQuery = (size: number): string => {
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
    }`;
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
  currentFilters,
  size,
}: {
  currentFilters: any;
  size: number;
}): Promise<GraphQLApiResponse<MutatedGenesFreqResponse>> => {
  const graphQlFilters = currentFilters ? { filters: currentFilters } : {};
  return await graphqlAPI(getMutatedGenesFreqQuery(size), {
    graphQlFilters,
  });
};
