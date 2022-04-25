import { fetchGdcEntities, GdcApiResponse } from "../gdcapi/gdcapi";
import { OncoGridDonor } from "./types";
import { GqlOperation } from "../gdcapi/filters";

export const fetchCases = async (
  genes: string[],
  consequenceTypeFilters: string[],
  contextFilters?: GqlOperation,
): Promise<GdcApiResponse<OncoGridDonor>> => {
  const caseAndGenomicFilters = contextFilters?.content
    ? Object(contextFilters?.content)
    : [];
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
        ...caseAndGenomicFilters,
      ],
    },
  });
};
