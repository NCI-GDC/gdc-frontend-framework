import { fetchGdcEntities } from "../gdcapi/gdcapi";

export const fetchSSMOccurrences = async (genes: string[], cases: string[]) => {
  return fetchGdcEntities("ssm_occurrences", {
    fields: [
      "ssm.consequence.transcript.consequence_type",
      "ssm.consequence.transcript.annotation.vep_impact",
      "ssm.consequence.transcript.is_canonical",
      "ssm.consequence.transcript.gene.gene_id",
      "ssm.ssm_id,case.case_id",
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
          content: {
            field: "genes.is_cancer_gene_census",
            value: ["true"],
          },
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
            value: [
              "missense_variant",
              "frameshift_variant",
              "start_lost",
              "stop_lost",
              "stop_gained",
            ],
          },
        },
      ],
    },
  }, true);
};
