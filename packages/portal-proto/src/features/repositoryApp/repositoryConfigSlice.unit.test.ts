import {
  addFilter,
  removeFilter,
  resetToDefault,
  repositoryConfigReducer,
} from "./repositoryConfigSlice";

const defaultState = {
  customFacets: [
    "files.experimental_strategy",
    "files.wgs_coverage",
    "files.data_category",
    "files.data_type",
    "files.data_format",
    "files.analysis.workflow_type",
    "files.platform",
    "files.access",
    "cases.samples.tissue_type",
    "cases.samples.tumor_descriptor",
    "cases.samples.specimen_type",
    "cases.samples.preservation_method",
  ],
};

const alteredConfig = {
  customFacets: [
    "file.test_facet",
    "files.experimental_strategy",
    "files.wgs_coverage",
    "files.data_category",
    "files.data_type",
    "files.data_format",
    "files.analysis.workflow_type",
    "files.platform",
    "files.access",
    "cases.samples.tissue_type",
    "cases.samples.tumor_descriptor",
    "cases.samples.specimen_type",
    "cases.samples.preservation_method",
  ],
};

const removeFacetTestState = {
  customFacets: [
    "files.experimental_strategy",
    "files.wgs_coverage",
    "files.data_category",
    "files.data_type",
    "files.data_format",
    "files.analysis.workflow_type",
    "files.platform",
    "files.access",
    "cases.samples.tissue_type",
    "cases.samples.tumor_descriptor",
    "cases.samples.specimen_type",
    "cases.samples.preservation_method",
    "example.facet_type",
  ],
};

describe("repository config reduce", () => {
  test("should return the default state for unknown actions", () => {
    const state = repositoryConfigReducer(defaultState, { type: "noop" });
    expect(state).toEqual(defaultState);
  });

  test("addFilter action should add a facet filters", () => {
    const state = repositoryConfigReducer(
      defaultState,
      addFilter({
        facetName: "file.test_facet",
      }),
    );
    expect(state).toEqual(alteredConfig);
  });

  test("addFilter that exists should be ignored", () => {
    const state = repositoryConfigReducer(
      alteredConfig,
      addFilter({
        facetName: "file.test_facet",
      }),
    );
    expect(state).toEqual(alteredConfig);
  });

  test("removeFilterFromCohortBuilder action should add a facetName to the config category", () => {
    const state = repositoryConfigReducer(
      removeFacetTestState,
      removeFilter({
        facetName: "example.facet_type",
      }),
    );
    expect(state).toEqual(defaultState);
  });

  test("resetCohortBuilderToDefault action should return builderConfig to the default configuration", () => {
    const state = repositoryConfigReducer(alteredConfig, resetToDefault());
    expect(state).toEqual({ customFacets: [] });
  });
});
