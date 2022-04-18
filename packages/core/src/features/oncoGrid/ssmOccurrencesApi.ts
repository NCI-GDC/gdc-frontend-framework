import { fetchGdcEntities, GdcApiResponse } from "../gdcapi/gdcapi";
import { SSMOccurrence } from "./types";
import { GqlOperation } from "../gdcapi/filters";

export const fetchSSMOccurrences = async (
  genes: string[],
  cases: string[],
  consequenceTypeFilters: string[],
  contextFilters?: GqlOperation,
): Promise<GdcApiResponse<SSMOccurrence>> => {
  const caseAndGenomicFilters = contextFilters?.content ? Object(contextFilters?.content) : [];
  return fetchGdcEntities(
    "ssm_occurrences",
    {
      fields: [
        "ssm.consequence.transcript.consequence_type",
        "ssm.consequence.transcript.annotation.vep_impact",
        "ssm.consequence.transcript.is_canonical",
        "ssm.consequence.transcript.gene.gene_id",
        "ssm.ssm_id",
        "case.case_id",
      ],
      from: 0,
      size: 10000,
      filters: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.case_id",
              value: cases,
            },
          },
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: genes,
            },
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
    },
    true,
  );
};
