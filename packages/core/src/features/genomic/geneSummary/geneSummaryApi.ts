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

export const fetchGenesSummaryQuery = async ({
  gene_id,
}: {
  gene_id: string;
}): Promise<GraphQLApiResponse> => {
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

  const results: GraphQLApiResponse<any> = await graphqlAPI(geneSummary_query, {
    filters,
  });

  return results;
};
