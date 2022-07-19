import {
  addFilterToCohortBuilder,
  removeFilterFromCohortBuilder,
  resetCohortBuilderToDefault,
  cohortBuilderConfigReducer,
  selectCohortBuilderConfig,
  selectCohortBuilderConfigCategory,
  selectCohortBuilderConfigFilters,
} from "./cohortBuilderConfigSlice";
import CohortBuilderDefaultConfig from "./data/cohort_builder.json";
import { getInitialCoreState } from "../../store.unit.test";

const defaultState = {
  general: {
    label: "General",
    facets: [
      "demographic.gender",
      "demographic.race",
      "demographic.ethnicity",
      "diagnoses.age_at_diagnosis",
      "diagnoses.vital_status",
    ],
    docType: "cases",
    index: "repository",
  },
};

const alteredConfig = {
  general: {
    label: "General",
    facets: [
      "demographic.gender",
      "demographic.race",
      "demographic.ethnicity",
      "diagnoses.age_at_diagnosis",
      "diagnoses.vital_status",
      "case.test_facet",
    ],
    docType: "cases",
    index: "repository",
  },
};

const removeFacetTestState = {
  general: {
    label: "General",
    facets: [
      "demographic.gender",
      "demographic.race",
      "demographic.ethnicity",
      "diagnoses.age_at_diagnosis",
      "diagnoses.vital_status",
      "example.facet_type",
    ],
    docType: "cases",
    index: "repository",
  },
  additional: {
    label: "General",
    facets: ["example.facet_type", "case.test_facet"],
    docType: "cases",
    index: "repository",
  },
};

// const state = getInitialCoreState();

describe("cohortConfig reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = cohortBuilderConfigReducer(defaultState, { type: "noop" });
    expect(state).toEqual(defaultState);
  });

  test("addFilterToCohortBuilder action should add a facetName to the config category", () => {
    const state = cohortBuilderConfigReducer(
      defaultState,
      addFilterToCohortBuilder({
        category: "general",
        facetName: "case.test_facet",
      }),
    );
    expect(state).toEqual(alteredConfig);
  });

  test("addFilterToCohortBuilder with bad category should do nothing", () => {
    const state = cohortBuilderConfigReducer(
      defaultState,
      addFilterToCohortBuilder({
        category: "none",
        facetName: "case.test_facet",
      }),
    );
    expect(state).toEqual(defaultState);
  });

  test("removeFilterFromCohortBuilder action should add a facetName to the config category", () => {
    const expected = {
      general: {
        label: "General",
        facets: [
          "demographic.gender",
          "demographic.race",
          "demographic.ethnicity",
          "diagnoses.age_at_diagnosis",
          "diagnoses.vital_status",
          "example.facet_type",
        ],
        docType: "cases",
        index: "repository",
      },
      additional: {
        label: "General",
        facets: ["case.test_facet"],
        docType: "cases",
        index: "repository",
      },
    };

    const state = cohortBuilderConfigReducer(
      removeFacetTestState,
      removeFilterFromCohortBuilder({
        category: "additional",
        facetName: "example.facet_type",
      }),
    );
    expect(state).toEqual(expected);
  });

  test("resetCohortBuilderToDefault action should return builderConfig to the default configuration", () => {
    const state = cohortBuilderConfigReducer(
      alteredConfig,
      resetCohortBuilderToDefault(),
    );
    expect(state).toEqual(CohortBuilderDefaultConfig.config);
  });
});

const state = getInitialCoreState();

describe("selectBuilderConfig", () => {
  test("should select the default configuration", () => {
    const builderConfig = selectCohortBuilderConfig(state);
    expect(builderConfig).toEqual(CohortBuilderDefaultConfig.config);
  });
  test("should select the 'common' configuration", () => {
    const expected = {
      label: "General",
      facets: ["cases.project.program.name", "cases.project.project_id"],
      docType: "cases",
      index: "repository",
    };
    const builderCommonConfig = selectCohortBuilderConfigCategory(
      state,
      "general",
    );
    expect(builderCommonConfig).toEqual(expected);
  });

  test("should flatten all facets in config into an array", () => {
    const expected = [
      "cases.project.program.name",
      "cases.project.project_id",
      "cases.demographic.gender",
      "cases.demographic.race",
      "cases.demographic.ethnicity",
      "cases.diagnoses.age_at_diagnosis",
      "cases.demographic.vital_status",
      "cases.primary_site",
      "cases.disease_type",
      "cases.diagnoses.primary_diagnosis",
      "cases.diagnoses.year_of_diagnosis",
      "cases.diagnoses.tissue_or_organ_of_origin",
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
      "cases.diagnoses.cog_liver_stage",
      "cases.diagnoses.cog_renal_stage",
      "cases.diagnoses.enneking_msts_stage",
      "cases.diagnoses.figo_stage",
      "cases.diagnoses.igcccg_stage",
      "cases.diagnoses.inrg_stage",
      "cases.diagnoses.inss_stage",
      "cases.diagnoses.irs_stage",
      "cases.diagnoses.iss_stage",
      "cases.diagnoses.iss_stage",
      "cases.diagnoses.masaoka_stage",
      "cases.diagnoses.gleason_grade_group",
      "cases.diagnoses.inpc_grade",
      "cases.diagnoses.who_cns_grade",
      "cases.diagnoses.who_nte_grade",
      "cases.diagnoses.child_pugh_classification",
      "cases.diagnoses.cog_neuroblastoma_risk_group",
      "cases.diagnoses.cog_rhabdomyosarcoma_risk_group",
      "cases.diagnoses.eln_risk_classification",
      "cases.diagnoses.international_prognostic_index",
      "cases.diagnoses.ishak_fibrosis_score",
      "cases.diagnoses.medulloblastoma_molecular_classification",
      "cases.diagnoses.weiss_assessment_score",
      "cases.diagnoses.wilms_tumor_histologic_subtype",
      "cases.samples.sample_type",
      "cases.samples.tissue_type",
      "cases.samples.biospecimen_anatomic_site",
      "cases.samples.composition",
      "cases.samples.preservation_method",
      "cases.samples.tumor_code",
      "cases.samples.tumor_descriptor",
      "cases.samples.portions.analytes.aliquots.analyte_type",
      "files.data_category",
      "files.data_type",
      "files.experimental_strategy",
      "files.analysis.workflow_type",
      "files.data_format",
      "files.platform",
      "files.access",
    ];
    const usedFacets = selectCohortBuilderConfigFilters(state);
    expect(usedFacets).toEqual(expected);
  });

  test("should return undefined", () => {
    const builderCommonConfig = selectCohortBuilderConfigCategory(
      state,
      "none",
    );
    expect(builderCommonConfig).toBeUndefined();
  });
});
