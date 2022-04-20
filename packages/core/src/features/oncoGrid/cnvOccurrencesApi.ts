import { fetchGdcEntities, GdcApiResponse } from "../gdcapi/gdcapi";
import { CNVOccurrence } from "./types";
import { GqlOperation } from "../gdcapi/filters";

export const fetchCNVOccurrences = async (
  genes: string[],
  cases: string[],
  cnvFilters: string[],
  contextFilters?: GqlOperation,
): Promise<GdcApiResponse<CNVOccurrence>> => {
  const caseAndGenomicFilters = contextFilters?.content
    ? Object(contextFilters?.content)
    : [];
  return fetchGdcEntities(
    "cnv_occurrences",
    {
      fields: [
        "cnv_occurrence_id",
        "case.case_id",
        "cnv.consequence.gene.gene_id",
        "cnv.cnv_change",
      ],
      from: 0,
      size: 10000,
      filters: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.case_id",
              value: cases,
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "cnv.cnv_change",
              value: cnvFilters,
            },
          },
          {
            content: {
              field: "genes.gene_id",
              value: genes,
            },
            op: "in",
          },
          ...caseAndGenomicFilters,
        ],
      },
    },
    true,
  );
};
