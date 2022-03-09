import { fetchGdcEntities, GdcApiResponse } from "../gdcapi/gdcapi";

export const fetchCases = async (genes: string[]) : Promise<GdcApiResponse> => {
  return fetchGdcEntities("analysis/top_mutated_cases_by_gene", {
    fields: [
      "demographic.days_to_death",
      "diagnoses.age_at_diagnosis",
      "demographic.vital_status",
      "demographic.gender",
      "demographic.race",
      "demographic.ethnicity",
      "case_id",
      "submitter_id",
      "project.project_id",
      "summary.data_categories.file_count",
      "summary.data_categories.data_category",
    ],
    size: 200,
    filters: {
      op: "and",
      content: [
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
  });
};
