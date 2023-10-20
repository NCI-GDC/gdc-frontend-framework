import { FilterSet } from "@gff/core";
import { DataDimension } from "./types";

export const DEMO_COHORT_FILTERS: FilterSet = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["TCGA-LGG"],
    },
  },
};

export const DEFAULT_FIELDS = [
  "demographic.gender",
  "demographic.race",
  "demographic.ethnicity",
  "diagnoses.age_at_diagnosis",
  "diagnoses.primary_diagnosis",
];

export const CONTINUOUS_FACET_TYPES = [
  "year",
  "years",
  "age",
  "numeric",
  "integer",
  "percent",
  "long",
  "double",
];

export const HIDE_QQ_BOX_FIELDS = [
  "demographic.year_of_birth",
  "demographic.year_of_death",
  "diagnoses.year_of_diagnosis",
  "exposures.tobacco_smoking_onset_year",
  "exposures.tobacco_smoking_quit_year",
];

export const COLOR_MAP = {
  demographic: "nci-blue",
  diagnoses: "nci-orange",
  treatments: "nci-green",
  exposures: "nci-purple",
};

export const CAPITALIZED_TERMS = [
  "ajcc",
  "uicc",
  "cog",
  "figo",
  "inss",
  "iss",
  "icd",
  "igcccg",
];

export const SPECIAL_CASE_FIELDS = {
  icd_10_code: "ICD-10 Code",
};

export const FACET_SORT = {
  demographic: [
    "gender",
    "race",
    "ethnicity",
    "vital_status",
    "cause_of_death",
    "premature_at_birth",
    "days_to_death",
    "days_to_birth",
    "year_of_birth",
    "year_of_death",
    "age_at_index",
    "age_is_obfuscated",
  ],
  diagnoses: [
    "age_at_diagnosis",
    "year_of_diagnosis",
    "ajcc_clinical_stage",
    "ajcc_clinical_t",
    "ajcc_clinical_n",
    "ajcc_clinical_m",
    "ajcc_pathologic_stage",
    "ajcc_pathologic_t",
    "ajcc_pathologic_n",
    "ajcc_pathologic_m",
    "ajcc_staging_system_edition",
    "uicc_clinical_stage",
    "uicc_clinical_t",
    "uicc_clinical_n",
    "uicc_clinical_m",
    "uicc_pathologic_stage",
    "uicc_pathologic_t",
    "uicc_pathologic_n",
    "uicc_pathologic_m",
    "classification_of_tumor",
    "method_of_diagnosis",
    "primary_diagnosis",
    "prior_malignancy",
    "prior_treatment",
    "synchronous_malignancy",
    "ann_arbor_clinical_stage",
    "ann_arbor_pathologic_stage",
    "ann_arbor_extranodal_involvement",
    "ann_arbor_b_symptoms",
    "burkitt_lymphoma_clinical_variant",
    "cog_renal_stage",
    "esophageal_columnar_dysplasia_degree",
    "esophageal_columnar_metaplasia_present",
    "figo_stage",
    "inss_stage",
    "iss_stage",
    "metastasis_at_diagnosis",
    "metastasis_at_diagnosis_site",
    "morphology",
    "tumor_grade",
    "tissue_or_organ_of_origin",
    "site_of_resection_or_biopsy",
    "laterality",
    "gastric_esophageal_junction_involvement",
    "progression_or_recurrence",
    "residual_disease",
    "days_to_diagnosis",
    "days_to_last_follow_up",
    "days_to_last_known_disease_status",
    "days_to_recurrence",
    "figo_staging_edition_year",
    "goblet_cells_columnar_mucosa_present",
    "icd_10_code",
    "igcccg_stage",
    "international_prognostic_index",
    "last_known_disease_status",
    "masaoka_stage",
    "pregnant_at_diagnosis",
    "primary_gleason_grade",
    "secondary_gleason_grade",
  ],
  treatments: [
    "days_to_treatment_start",
    "days_to_treatment_end",
    "therapeutic_agents",
    "initial_disease_status",
    "treatment_anatomic_site",
    "treatment_effect",
    "treatment_intent_type",
    "treatment_or_therapy",
    "treatment_outcome",
    "treatment_type",
    "chemo_concurrent_to_radiation",
    "number_of_cycles",
    "regimen_or_line_of_therapy",
    "treatment_dose",
    "treatment_frequency",
  ],
  exposures: [
    "alcohol_history",
    "alcohol_intensity",
    "tobacco_smoking_status",
    "alcohol_days_per_week",
    "cigarettes_per_day",
    "pack_years_smoked",
    "tobacco_smoking_onset_year",
    "tobacco_smoking_quit_year",
  ],
};

export const DATA_DIMENSIONS: Record<
  string,
  { unit: DataDimension; toggleValue?: DataDimension }
> = {
  "diagnoses.age_at_diagnosis": {
    unit: "Days",
    toggleValue: "Years",
  },
  "demographic.days_to_birth": { unit: "Days", toggleValue: "Years" },
  "demographic.days_to_death": { unit: "Days", toggleValue: "Years" },
  "diagnoses.days_to_diagnosis": { unit: "Days", toggleValue: "Years" },
  "diagnoses.days_to_last_follow_up": { unit: "Days", toggleValue: "Years" },
  "diagnoses.days_to_last_known_disease_status": {
    unit: "Days",
    toggleValue: "Years",
  },
  "diagnoses.days_to_recurrence": { unit: "Days", toggleValue: "Years" },
  "diagnoses.treatments.days_to_treatment_end": {
    unit: "Days",
    toggleValue: "Years",
  },
  "diagnoses.treatments.days_to_treatment_start": {
    unit: "Days",
    toggleValue: "Years",
  },
  "diagnoses.year_of_diagnosis": { unit: "Years" },
};

export const TABS = {
  demographic: "Demographic",
  diagnoses: "Diagnosis",
  treatments: "Treatment",
  exposures: "Exposures",
};

export const SURVIVAL_PLOT_MIN_COUNT = 10;
export const BUCKETS_MAX_COUNT = 500;
export const MISSING_KEY = "_missing";
