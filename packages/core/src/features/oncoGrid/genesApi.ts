import { fetchGdcEntities, GdcApiResponse } from "../gdcapi/gdcapi";

interface Gene {
  readonly gene_id: string;
  readonly is_cancer_gene_census: boolean;
  readonly symbol: string;
  readonly _score: number;
}

export const fetchGenes = (
  consequenceTypeFilters: string[],
): Promise<GdcApiResponse<Gene>> => {
  return fetchGdcEntities("analysis/top_mutated_genes_by_project", {
    fields: ["gene_id", "symbol", "is_cancer_gene_census"],
    size: 50,
    filters: {
      op: "and",
      content: [
        {
          content: { field: "genes.is_cancer_gene_census", value: ["true"] },
          op: "in",
        },
        {
          op: "not",
          content: {
            field: "ssms.consequence.transcript.annotation.vep_impact",
            value: "missing",
          },
        },
        {
          op: "in",
          content: {
            field: "ssms.consequence.transcript.consequence_type",
            value: consequenceTypeFilters,
          },
        },
      ],
    },
  });
};
