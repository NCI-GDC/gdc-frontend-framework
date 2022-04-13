import { fetchGdcEntities, GdcApiResponse } from "../gdcapi/gdcapi";
import { Gene } from "./types";
import { GqlOperation } from "../gdcapi/filters";

export const fetchGenes = (
  consequenceTypeFilters: string[],
  contextFilters?: GqlOperation,
): Promise<GdcApiResponse<Gene>> => {
  const caseAndGenomicFilters = contextFilters?.content ? Object(contextFilters?.content) : [];
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
        ...caseAndGenomicFilters
      ],
    },
  });
};
