import {
  addFilterToCohortBuilder,
  removeFilterFromCohortBuilder,
  resetCohortBuilderToDefault,
  cohortBuilderConfigReducer,
  selectCohortBuilderConfig,
  selectCohortBuilderConfigCategory,
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

  test("addFilter that exists should be ignored", () => {
    const state = cohortBuilderConfigReducer(
      alteredConfig,
      addFilterToCohortBuilder({
        category: "general",
        facetName: "file.test_facet",
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

  test("should return undefined", () => {
    const builderCommonConfig = selectCohortBuilderConfigCategory(
      state,
      "none",
    );
    expect(builderCommonConfig).toBeUndefined();
  });
});
