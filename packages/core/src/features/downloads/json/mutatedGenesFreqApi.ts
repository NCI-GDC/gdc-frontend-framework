import { GraphQLApiResponse, graphqlAPI } from "../../gdcapi/gdcgraphql";

export const mutatedGenesFreqQuery = `
query MutatedGenesFreq(
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
  return await graphqlAPI(mutatedGenesFreqQuery, {
    graphQlFilters,
  });
};
