import { calculatePercentageAsNumber, sortByPropertyAsc } from "@/utils/index";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PercentageLabel } from "@/components/PercentageLabel";

export const caseSummaryFields = [
  "files.access",
  "files.acl",
  "files.data_type",
  "files.file_name",
  "files.file_size",
  "files.file_id",
  "files.data_format",
  "files.state",
  "files.created_datetime",
  "files.updated_datetime",
  "files.submitter_id",
  "files.data_category",
  "files.type",
  "files.md5sum",
  "case_id",
  "submitter_id",
  "project.name",
  "disease_type",
  "project.project_id",
  "primary_site",
  "project.program.name",
  "summary.file_count",
  "summary.data_categories.file_count",
  "summary.data_categories.data_category",
  "summary.experimental_strategies.experimental_strategy",
  "summary.experimental_strategies.file_count",
  "demographic.ethnicity",
  "demographic.demographic_id",
  "demographic.gender",
  "demographic.race",
  "demographic.submitter_id",
  "demographic.days_to_birth",
  "demographic.days_to_death",
  "demographic.vital_status",
  "diagnoses.submitter_id",
  "diagnoses.diagnosis_id",
  "diagnoses.classification_of_tumor",
  "diagnoses.age_at_diagnosis",
  "diagnoses.days_to_last_follow_up",
  "diagnoses.days_to_last_known_disease_status",
  "diagnoses.days_to_recurrence",
  "diagnoses.last_known_disease_status",
  "diagnoses.morphology",
  "diagnoses.primary_diagnosis",
  "diagnoses.prior_malignancy",
  "diagnoses.synchronous_malignancy",
  "diagnoses.progression_or_recurrence",
  "diagnoses.site_of_resection_or_biopsy",
  "diagnoses.tissue_or_organ_of_origin",
  "diagnoses.tumor_grade",
  "diagnoses.treatments.days_to_treatment_start",
  "diagnoses.treatments.submitter_id",
  "diagnoses.treatments.therapeutic_agents",
  "diagnoses.treatments.treatment_id",
  "diagnoses.treatments.treatment_intent_type",
  "diagnoses.treatments.treatment_or_therapy",
  "exposures.alcohol_history",
  "exposures.alcohol_intensity",
  "exposures.exposure_id",
  "exposures.tobacco_smoking_status",
  "exposures.submitter_id",
  "exposures.pack_years_smoked",
  "family_histories.family_history_id",
  "family_histories.relationship_age_at_diagnosis",
  "family_histories.relationship_gender",
  "family_histories.relationship_primary_diagnosis",
  "family_histories.relationship_type",
  "family_histories.relative_with_cancer_history",
  "family_histories.submitter_id",
  "follow_ups.follow_up_id",
  "follow_ups.submitter_id",
  "follow_ups.days_to_follow_up",
  "follow_ups.comorbidity",
  "follow_ups.risk_factor",
  "follow_ups.progression_or_recurrence_type",
  "follow_ups.progression_or_recurrence",
  "follow_ups.disease_response",
  "follow_ups.bmi",
  "follow_ups.height",
  "follow_ups.weight",
  "follow_ups.ecog_performance_status",
  "follow_ups.karnofsky_performance_status",
  "follow_ups.progression_or_recurrence_anatomic_site",
  "follow_ups.reflux_treatment_type",
  "follow_ups.molecular_tests.aa_change",
  "follow_ups.molecular_tests.antigen",
  "follow_ups.molecular_tests.biospecimen_type",
  "follow_ups.molecular_tests.chromosome",
  "follow_ups.molecular_tests.gene_symbol",
  "follow_ups.molecular_tests.molecular_test_id",
  "follow_ups.molecular_tests.submitter_id",
  "follow_ups.molecular_tests.laboratory_test",
  "follow_ups.molecular_tests.mismatch_repair_mutation",
  "follow_ups.molecular_tests.molecular_analysis_method",
  "follow_ups.molecular_tests.molecular_test_id",
  "follow_ups.molecular_tests.second_gene_symbol",
  "follow_ups.molecular_tests.test_result",
  "follow_ups.molecular_tests.test_units",
  "follow_ups.molecular_tests.test_value",
  "follow_ups.molecular_tests.variant_type",
];

export const getSlideCountFromCaseSummary = (
  experimental_strategies: Array<{
    experimental_strategy: string;
    file_count: number;
  }>,
): number => {
  const slideTypes = ["Diagnostic Slide", "Tissue Slide"];
  return (experimental_strategies || []).reduce(
    (slideCount, { file_count, experimental_strategy }) =>
      slideTypes.includes(experimental_strategy)
        ? slideCount + file_count
        : slideCount,
    0,
  );
};

export const formatDataForDataCateogryTable = (
  data_categories: {
    readonly data_category: string;
    readonly file_count: number;
  }[],
  filesCountTotal: number,
): {
  data: {
    readonly data_category: string;
    readonly file_count: number;
  }[];
  columns: ColumnDef<
    {
      readonly data_category: string;
      readonly file_count: number;
    },
    unknown
  >[];
} => {
  const sortedDataCategories = sortByPropertyAsc(
    data_categories,
    "data_category",
  );

  const dataCategoryTableColumnHelper =
    createColumnHelper<typeof sortedDataCategories[0]>();

  const dataCategoryTableColumns = [
    dataCategoryTableColumnHelper.display({
      id: "data_category",
      header: () => <div className="text-sm leading-[18px]">Data Category</div>,
      cell: ({ row }) => row.original.data_category,
    }),
    dataCategoryTableColumnHelper.display({
      id: "file_count",
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal text-sm leading-[18px]">
            (n={filesCountTotal.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const fileCountPercentage = calculatePercentageAsNumber(
          row.original.file_count,
          filesCountTotal,
        );
        return (
          <PercentageLabel
            count={row.original.file_count}
            countPercentage={fileCountPercentage}
          />
        );
      },
    }),
  ];

  return { data: sortedDataCategories, columns: dataCategoryTableColumns };
};

export const formatDataForExpCateogryTable = (
  experimental_strategies: {
    readonly experimental_strategy: string;
    readonly file_count: number;
  }[],
  filesCountTotal: number,
): {
  data: {
    readonly experimental_strategy: string;
    readonly file_count: number;
  }[];
  columns: ColumnDef<
    {
      readonly experimental_strategy: string;
      readonly file_count: number;
    },
    unknown
  >[];
} => {
  const sortedExpCategories = sortByPropertyAsc(
    experimental_strategies,
    "experimental_strategy",
  );

  const expCategoryTableColumnHelper =
    createColumnHelper<typeof sortedExpCategories[0]>();

  const expCategoryTableColumns = [
    expCategoryTableColumnHelper.display({
      id: "data_category",
      header: () => (
        <div className="text-sm leading-[18px]">Experimental Strategy</div>
      ),
      cell: ({ row }) => row.original.experimental_strategy,
    }),
    expCategoryTableColumnHelper.display({
      id: "file_count",
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal text-sm leading-[18px]">
            (n={filesCountTotal.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const fileCountPercentage = calculatePercentageAsNumber(
          row.original.file_count,
          filesCountTotal,
        );
        return (
          <PercentageLabel
            count={row.original.file_count}
            countPercentage={fileCountPercentage}
          />
        );
      },
    }),
  ];

  return { data: sortedExpCategories, columns: expCategoryTableColumns };
};
