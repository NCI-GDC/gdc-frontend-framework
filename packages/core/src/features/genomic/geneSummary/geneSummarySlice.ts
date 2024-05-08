import { GraphQLApiResponse, graphqlAPISlice } from "../../gdcapi/gdcgraphql";

const geneSummary_query = `
query GeneSummary($filters: FiltersArgument) {
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

interface GeneSummaryResponse {
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

export interface GeneSummaryData {
  symbol: string;
  name: string;
  synonyms: Array<string>;
  biotype: string;
  gene_chromosome: string;
  gene_start: number;
  gene_end: number;
  gene_strand: number;
  description: string;
  is_cancer_gene_census: boolean;
  civic?: string;
  gene_id: string;
  external_db_ids: {
    entrez_gene: string[];
    uniprotkb_swissprot: string[];
    hgnc: string[];
    omim_gene: string[];
  };
}

const geneSummarySlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    geneSummary: builder.query<
      GeneSummaryData | undefined,
      { gene_id: string }
    >({
      query: ({ gene_id }) => {
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

        return {
          graphQLQuery: geneSummary_query,
          graphQLFilters: { filters },
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<GeneSummaryResponse>,
      ) => {
        const edges = response.data.viewer.explore.genes.hits.edges;
        if (edges.length === 0) return undefined;

        const summary = edges.map((gene) => ({
          symbol: gene.node.symbol,
          name: gene.node.name,
          synonyms: gene.node.synonyms,
          biotype: gene.node.biotype,
          gene_chromosome: gene.node.gene_chromosome,
          gene_start: gene.node.gene_start,
          gene_end: gene.node.gene_end,
          gene_strand: gene.node.gene_strand,
          description: gene.node.description,
          is_cancer_gene_census: gene.node.is_cancer_gene_census,
          gene_id: gene.node.gene_id,
          external_db_ids: {
            entrez_gene: gene.node.external_db_ids.entrez_gene,
            uniprotkb_swissprot: gene.node.external_db_ids.uniprotkb_swissprot,
            hgnc: gene.node.external_db_ids.hgnc,
            omim_gene: gene.node.external_db_ids.omim_gene,
          },
        }))[0];

        const civic = response.data.viewer.explore.ssms?.aggregations
          ?.clinical_annotations__civic__gene_id?.buckets[0]?.key
          ? response.data.viewer.explore.ssms?.aggregations
              ?.clinical_annotations__civic__gene_id?.buckets[0]?.key
          : undefined;

        return { ...summary, civic };
      },
    }),
  }),
});

export const { useGeneSummaryQuery } = geneSummarySlice;
