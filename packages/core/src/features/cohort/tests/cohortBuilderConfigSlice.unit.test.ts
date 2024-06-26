import { getInitialCoreState } from "src/store.unit.test";
import {
  addFilterToCohortBuilder,
  removeFilterFromCohortBuilder,
  resetCohortBuilderToDefault,
  cohortBuilderConfigReducer,
  selectCohortBuilderConfig,
  selectCohortBuilderConfigCategory,
  selectCohortBuilderConfigFilters,
} from "../cohortBuilderConfigSlice";
import CohortBuilderDefaultConfig from "../data/cohort_builder.json";

const defaultState = {
  customFacets: [
    "demographic.gender",
    "demographic.race",
    "demographic.ethnicity",
    "diagnoses.age_at_diagnosis",
    "diagnoses.vital_status",
  ],
};

const alteredConfig = {
  customFacets: [
    "demographic.gender",
    "demographic.race",
    "demographic.ethnicity",
    "diagnoses.age_at_diagnosis",
    "diagnoses.vital_status",
    "case.test_facet",
  ],
};

const state = getInitialCoreState();

const stateWithCustomFacets = {
  ...state,
  cohort: {
    ...state.cohort,
    builderConfig: {
      customFacets: [
        "demographic.country_of_residence_at_enrollment",
        "demographic.education_level",
      ],
    },
  },
};

describe("cohortConfig reducer", () => {
  test("addFilterToCohortBuilder action should remove field", () => {
    const state = cohortBuilderConfigReducer(
      defaultState,
      addFilterToCohortBuilder({
        facetName: "case.test_facet",
      }),
    );

    expect(state).toEqual(alteredConfig);
  });

  test("addFilter that exists should be ignored", () => {
    const state = cohortBuilderConfigReducer(
      alteredConfig,
      addFilterToCohortBuilder({
        facetName: "case.test_facet",
      }),
    );
    expect(state).toEqual(alteredConfig);
  });

  test("removeFilterFromCohortBuilder action should remove field", () => {
    const expected = {
      customFacets: [
        "demographic.gender",
        "demographic.race",
        "demographic.ethnicity",
        "diagnoses.age_at_diagnosis",
      ],
    };

    const state = cohortBuilderConfigReducer(
      defaultState,
      removeFilterFromCohortBuilder({
        facetName: "diagnoses.vital_status",
      }),
    );
    expect(state).toEqual(expected);
  });

  test("resetCohortBuilderToDefault action should return builderConfig to the default configuration", () => {
    const state = cohortBuilderConfigReducer(
      alteredConfig,
      resetCohortBuilderToDefault(),
    );
    expect(state).toEqual({ customFacets: [] });
  });

  test("should select the default configuration", () => {
    const builderConfig = selectCohortBuilderConfig(state);
    expect(builderConfig).toEqual(CohortBuilderDefaultConfig.config);
  });

  test("should select the 'common' configuration", () => {
    const expected = {
      label: "General",
      facets: [
        "cases.project.program.name",
        "cases.project.project_id",
        "cases.disease_type",
        "cases.diagnoses.primary_diagnosis",
        "cases.primary_site",
        "cases.diagnoses.tissue_or_organ_of_origin",
        "cases.upload.case_id",
      ],
      docType: "cases",
      index: "explore",
    };
    const builderCommonConfig = selectCohortBuilderConfigCategory(
      state,
      "general",
    );
    expect(builderCommonConfig).toEqual(expected);
  });

  test("should select the 'custom' configuration", () => {
    const expected = {
      label: "Custom Filters",
      facets: [
        "demographic.country_of_residence_at_enrollment",
        "demographic.education_level",
      ],
      docType: "cases",
      index: "explore",
    };

    const builderCommonConfig = selectCohortBuilderConfigCategory(
      stateWithCustomFacets,
      "custom",
    );
    expect(builderCommonConfig).toEqual(expected);
  });

  test("should flatten all facets in config into an array", () => {
    const expected = [
      "cases.project.program.name",
      "cases.project.project_id",
      "cases.disease_type",
      "cases.diagnoses.primary_diagnosis",
      "cases.primary_site",
      "cases.diagnoses.tissue_or_organ_of_origin",
      "cases.upload.case_id",
      "cases.demographic.gender",
      "cases.demographic.race",
      "cases.demographic.ethnicity",
      "cases.diagnoses.age_at_diagnosis",
      "cases.demographic.vital_status",
      "cases.diagnoses.morphology",
      "cases.diagnoses.year_of_diagnosis",
      "cases.diagnoses.site_of_resection_or_biopsy",
      "cases.diagnoses.sites_of_involvement",
      "cases.diagnoses.laterality",
      "cases.diagnoses.prior_malignancy",
      "cases.diagnoses.prior_treatment",
      "cases.diagnoses.synchronous_malignancy",
      "cases.diagnoses.progression_or_recurrence",
      "cases.diagnoses.residual_disease",
      "cases.diagnoses.ajcc_clinical_stage",
      "cases.diagnoses.ajcc_pathologic_stage",
      "cases.diagnoses.ann_arbor_clinical_stage",
      "cases.diagnoses.ann_arbor_pathologic_stage",
      "cases.diagnoses.cog_renal_stage",
      "cases.diagnoses.enneking_msts_stage",
      "cases.diagnoses.figo_stage",
      "cases.diagnoses.igcccg_stage",
      "cases.diagnoses.inss_stage",
      "cases.diagnoses.iss_stage",
      "cases.diagnoses.masaoka_stage",
      "cases.diagnoses.inpc_grade",
      "cases.diagnoses.tumor_grade",
      "cases.diagnoses.who_cns_grade",
      "cases.diagnoses.cog_neuroblastoma_risk_group",
      "cases.diagnoses.cog_rhabdomyosarcoma_risk_group",
      "cases.diagnoses.eln_risk_classification",
      "cases.diagnoses.international_prognostic_index",
      "cases.diagnoses.wilms_tumor_histologic_subtype",
      "cases.diagnoses.treatments.therapeutic_agents",
      "cases.diagnoses.treatments.treatment_intent_type",
      "cases.diagnoses.treatments.treatment_outcome",
      "cases.diagnoses.treatments.treatment_type",
      "cases.diagnoses.best_overall_response",
      "cases.exposures.alcohol_history",
      "cases.exposures.alcohol_intensity",
      "cases.exposures.tobacco_smoking_status",
      "cases.exposures.cigarettes_per_day",
      "cases.exposures.pack_years_smoked",
      "cases.exposures.tobacco_smoking_onset_year",
      "cases.samples.tissue_type",
      "cases.samples.biospecimen_anatomic_site",
      "cases.samples.composition",
      "cases.samples.preservation_method",
      "cases.samples.tumor_code",
      "cases.samples.tumor_descriptor",
      "cases.samples.portions.analytes.aliquots.analyte_type",
      "genes.gene_id",
      "ssms.ssm_id",
      "files.data_category",
      "files.data_type",
      "files.experimental_strategy",
      "files.analysis.workflow_type",
      "files.data_format",
      "files.platform",
      "files.access",
      "demographic.country_of_residence_at_enrollment",
      "demographic.education_level",
    ];
    const usedFacets = selectCohortBuilderConfigFilters(stateWithCustomFacets);
    expect(usedFacets).toEqual(expected);
  });
});
