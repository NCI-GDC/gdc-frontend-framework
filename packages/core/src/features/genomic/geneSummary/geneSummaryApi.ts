import { GraphQLApiResponse, graphqlAPI } from "../../gdcapi/gdcgraphql";

const geneSummary_query = `
query GeneSummary_relayQuery($filters: FiltersArgument) {
  viewer {
    explore {
      genes {
        hits(first: 1, filters: $filters) {
          edges {
            node {
              description
              gene_id
              symbol
              name
              synonyms
              biotype
              gene_chromosome
              gene_start
              gene_end
              gene_strand
              is_cancer_gene_census
              external_db_ids {
                entrez_gene
                uniprotkb_swissprot
                hgnc
                omim_gene
              }
            }
          }
        }
      }
      ssms{
        aggregations(filters: $filters) {
          clinical_annotations__civic__gene_id{
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  }
}
`;

export interface GeneSummaryResponse {
  viewer: {
    explore: {
      genes: {
        hits: {
          edges: Array<{
            node: {
              description: string;
              gene_id: string;
              symbol: string;
              name: string;
              synonyms: Array<string>;
              biotype: string;
              gene_chromosome: string;
              gene_start: number;
              gene_end: number;
              gene_strand: number;
              is_cancer_gene_census: boolean;
              external_db_ids: {
                entrez_gene: Array<string>;
                uniprotkb_swissprot: Array<string>;
                hgnc: Array<string>;
                omim_gene: Array<string>;
              };
            };
          }>;
        };
      };
      ssms: {
        aggregations: {
          clinical_annotations__civic__gene_id: {
            buckets: Array<{
              doc_count: number;
              key: string;
            }>;
          };
        };
      };
    };
  };
}

export const fetchGenesSummaryQuery = async ({
  gene_id,
}: {
  gene_id: string;
}): Promise<GraphQLApiResponse<GeneSummaryResponse>> => {
  const filters = {
    op: "and",
    content: [
      {
        op: "in",
        content: {
          field: "genes.gene_id",
          value: [gene_id],
        },
      },
    ],
  };

  return await graphqlAPI(geneSummary_query, {
    filters,
  });
};
