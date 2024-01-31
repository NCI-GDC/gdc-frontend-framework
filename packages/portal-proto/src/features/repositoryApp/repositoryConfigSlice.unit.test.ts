import {
  addFilter,
  removeFilter,
  resetToDefault,
  repositoryConfigReducer,
  selectRepositoryConfig,
} from "./repositoryConfigSlice";
import DownloadFiltersDefault from "./config/filters.json";
import { getInitialAppState } from "./store.unit.test";

const defaultState = {
  label: "Repository Default",
  facets: [
    "files.experimental_strategy",
    "files.wgs_coverage",
    "files.data_category",
    "files.data_type",
    "files.data_format",
    "files.analysis.workflow_type",
    "files.platform",
    "files.access",
  ],
  docType: "files",
  index: "repository",
};

const alteredConfig = {
  label: "Repository Default",
  facets: [
    "file.test_facet",
    "files.experimental_strategy",
    "files.wgs_coverage",
    "files.data_category",
    "files.data_type",
    "files.data_format",
    "files.analysis.workflow_type",
    "files.platform",
    "files.access",
  ],
  docType: "files",
  index: "repository",
};

const removeFacetTestState = {
  label: "Repository Default",
  facets: [
    "files.experimental_strategy",
    "files.wgs_coverage",
    "files.data_category",
    "files.data_type",
    "files.data_format",
    "files.analysis.workflow_type",
    "files.platform",
    "files.access",
    "example.facet_type",
  ],
  docType: "files",
  index: "repository",
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
    expect(state).toEqual(DownloadFiltersDefault);
  });
});

const state = getInitialAppState();

describe("selectRepositoryConfig", () => {
  test("should select the default configuration", () => {
    const builderConfig = selectRepositoryConfig(state);
    expect(builderConfig).toEqual(DownloadFiltersDefault);
  });
});
