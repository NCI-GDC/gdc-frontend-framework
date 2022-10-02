import { getInitialCoreState } from "../../store.unit.test";
import {
  FilterSet,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  updateCohortFilter,
  removeCohortFilter,
  cohortFilterReducer,
} from "./cohortFilterSlice";
import {
  clearCurrentCohort,
  selectCurrentCohort,
  setCurrentCohort,
  cohortNameReducer,
} from "./cohortNameSlice";
import {
  availableCohortsReducer,
  addNewCohort,
  updateCohort,
} from "./availableCohortsSlice";

const state = getInitialCoreState();

const initialFilters = { mode: "and", root: {} };
const populatedFilters = {
  mode: "and",
  root: {
    primary_site: {
      operator: "includes",
      field: "primary_site",
      operands: ["bronchus and lung"],
    },
  },
};

const TwoPopulatedFilters = {
  mode: "and",
  root: {
    primary_site: {
      operator: "includes",
      field: "primary_site",
      operands: ["bronchus and lung"],
    },
    disease_type: {
      operator: "includes",
      field: "disease_type",
      operands: ["ductal and lobular neoplasms"],
    },
  },
};

describe("cohortSlice reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = cohortNameReducer(undefined, { type: "asdf" });
    expect(state).toEqual({ currentCohort: "New Custom Cohort" });
  });

  test("setCurrentCohort action should set the current cohort", () => {
    const state = cohortNameReducer(undefined, setCurrentCohort("my-cohort-1"));
    expect(state.currentCohort).toEqual("my-cohort-1");
  });

  test("clearCurrentCohort action should unset the current cohort", () => {
    const state = cohortNameReducer(
      { currentCohort: "cohort-2" },
      clearCurrentCohort(),
    );
    expect(state.currentCohort).toBeUndefined();
  });
});

describe("selectCurrentCohort", () => {
  test("should return the current cohort when it's defined", () => {
    const currentCohort = selectCurrentCohort({
      ...state,
      cohort: {
        currentCohort: { currentCohort: "asdf" },
        currentFilters: { filters: initialFilters },
        counts: {
          counts: {
            caseCounts: -1,
            fileCounts: -1,
            genesCounts: -1,
            mutationCounts: -1,
          },
          status: "uninitialized",
        },
        availableCohorts: { ids: [], entities: {} },
        comparisonCohorts: [],
        builderConfig: {},
        caseSet: {
          status: "uninitialized",
          caseSetId: { mode: "and", root: {} },
        },
      },
    });
    expect(currentCohort).toEqual("asdf");
  });

  test("should return undefined when the current cohort is not set", () => {
    const currentCohort = selectCurrentCohort({
      ...state,
      cohort: {
        currentCohort: { currentCohort: undefined },
        currentFilters: { filters: initialFilters },
        counts: {
          counts: {
            caseCounts: -1,
            fileCounts: -1,
            genesCounts: -1,
            mutationCounts: -1,
          },
          status: "uninitialized",
        },
        availableCohorts: { ids: [], entities: {} },
        comparisonCohorts: [],
        builderConfig: {},
        caseSet: {
          status: "uninitialized",
          caseSetId: { mode: "and", root: {} },
        },
      },
    });
    expect(currentCohort).toBeUndefined();
  });
});

describe("selectCurrentCohortFilters", () => {
  test("should return the current cohort filters", () => {
    const currentCohortFilters = selectCurrentCohortFilters({
      ...state,
      cohort: {
        currentCohort: { currentCohort: "asdf" },
        currentFilters: { filters: populatedFilters as FilterSet },
        counts: {
          counts: {
            caseCounts: -1,
            fileCounts: -1,
            genesCounts: -1,
            mutationCounts: -1,
          },
          status: "uninitialized",
        },
        availableCohorts: { ids: [], entities: {} },
        comparisonCohorts: [],
        builderConfig: {},
        caseSet: {
          status: "uninitialized",
          caseSetId: { mode: "and", root: {} },
        },
      },
    });
    expect(currentCohortFilters).toEqual(populatedFilters);
  });

  test("should return initial filters when the current cohort is not set", () => {
    const currentCohortFilters = selectCurrentCohortFilters({ ...state });
    expect(currentCohortFilters).toEqual(initialFilters);
  });

  test("should return a field's filters", () => {
    const currentCohortFilters = selectCurrentCohortFiltersByName(
      {
        ...state,
        cohort: {
          currentCohort: { currentCohort: "asdf" },
          currentFilters: {
            filters: populatedFilters as FilterSet,
          },
          counts: {
            counts: {
              caseCounts: -1,
              fileCounts: -1,
              genesCounts: -1,
              mutationCounts: -1,
            },
            status: "uninitialized",
          },
          availableCohorts: { ids: [], entities: {} },
          comparisonCohorts: [],
          builderConfig: {},
          caseSet: {
            status: "uninitialized",
            caseSetId: { mode: "and", root: {} },
          },
        },
      },
      "primary_site",
    );
    expect(currentCohortFilters).toEqual(populatedFilters.root.primary_site);
  });
});

describe("addFilter", () => {
  test("should add a filter to the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer(
      { filters: initialFilters },
      updateCohortFilter({
        field: "primary_site",
        operation: {
          operator: "includes",
          field: "primary_site",
          operands: ["bronchus and lung"],
        },
      }),
    );
    expect(currentCohortFilters).toEqual({ filters: populatedFilters });
  });
  test("should add another filter to the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer(
      { filters: populatedFilters as FilterSet },
      updateCohortFilter({
        field: "disease_type",
        operation: {
          operator: "includes",
          field: "disease_type",
          operands: ["ductal and lobular neoplasms"],
        },
      }),
    );
    expect(currentCohortFilters).toEqual({ filters: TwoPopulatedFilters });
  });

  test("should not add a duplicate filter to the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer(
      { filters: populatedFilters as FilterSet },
      updateCohortFilter({
        field: "primary_site",
        operation: {
          operator: "includes",
          field: "primary_site",
          operands: ["bronchus and lung"],
        },
      }),
    );
    expect(currentCohortFilters).toEqual({ filters: populatedFilters });
  });

  test("should remove filter from the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer(
      { filters: TwoPopulatedFilters as FilterSet },
      removeCohortFilter("disease_type"),
    );
    expect(currentCohortFilters).toEqual({ filters: populatedFilters });
  });
});

describe("add, update, and remove cohort", () => {
  test("should add new cohort to available cohorts", () => {
    const availableCohorts = availableCohortsReducer(
      { ids: [], entities: {} },
      addNewCohort("000-000-000-1"),
    );
    expect(availableCohorts).toEqual({
      ids: ["000-000-000-1"],
      entities: {
        "000-000-000-1": {
          name: "cohort1",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
        },
      },
    });
  });

  test("should update cohort with new name", () => {
    const availableCohorts = availableCohortsReducer(
      {
        ids: ["000-000-000-1"],
        entities: {
          "000-000-000-1": {
            name: "cohort1",
            filters: { mode: "and", root: {} },
            id: "000-000-000-1",
          },
        },
      },
      updateCohort({ id: "000-000-000-1", changes: { name: "cohort2" } }),
    );
    expect(availableCohorts).toEqual({
      ids: ["000-000-000-1"],
      entities: {
        "000-000-000-1": {
          name: "cohort2",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
        },
      },
    });
  });

  test("should update cohort with new filter", () => {
    const availableCohorts = availableCohortsReducer(
      {
        ids: ["000-000-000-1"],
        entities: {
          "000-000-000-1": {
            name: "cohort1",
            filters: { mode: "and", root: {} },
            id: "000-000-000-1",
          },
        },
      },
      updateCohort({
        id: "000-000-000-1",
        changes: { filters: TwoPopulatedFilters as FilterSet },
      }),
    );
    expect(availableCohorts).toEqual({
      ids: ["000-000-000-1"],
      entities: {
        "000-000-000-1": {
          name: "cohort1",
          filters: TwoPopulatedFilters as FilterSet,
          id: "000-000-000-1",
        },
      },
    });
  });
});
