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


const state = getInitialCoreState();

const initialFilters = { mode: "and", root: {} };
const populatedFilters =
{
  mode: "and",
  root: {
    primary_site: {
        operator: "includes",
        field: "primary_site",
        operands: [
          "bronchus and lung",
        ],
    },
  },
};

const TwoPopulatedFilters =
  {
    mode: "and",
    root: {
      primary_site: {
        operator: "includes",
        field: "primary_site",
        operands: [
          "bronchus and lung",
        ],
      },
      disease_type: {
        operator: "includes",
        field: 'disease_type',
        operands: [
          'ductal and lobular neoplasms'
        ]
      },
    },
  };

describe("cohortSlice reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = cohortNameReducer(undefined, { type: "asdf" });
    expect(state).toEqual({ currentCohort: "New Cohort" });
  });

  test("setCurrentCohort action should set the current cohort", () => {
    const state = cohortNameReducer(undefined, setCurrentCohort("my-cohort-1"));
    expect(state.currentCohort).toEqual("my-cohort-1");
  });

  test("clearCurrentCohort action should unset the current cohort", () => {
    const state = cohortNameReducer({ currentCohort: "cohort-2" },
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
        currentCohort: { currentCohort: "asdf"} ,
        currentFilters: { currentFilters: initialFilters },
        counts: {
          counts: {
              caseCounts: -1,
              fileCounts: -1,
              genesCounts: -1,
              mutationCounts: -1,
            },
            status: "uninitialized"
          }
        },
    });
    expect(currentCohort).toEqual("asdf");
  });

  test("should return undefined when the current cohort is not set", () => {
    const currentCohort = selectCurrentCohort({ ...state,
      cohort: {
       currentCohort: {currentCohort: undefined},
        currentFilters: { currentFilters: initialFilters },
        counts: {
          counts: {
            caseCounts: -1,
            fileCounts: -1,
            genesCounts: -1,
            mutationCounts: -1,
          },
          status: "uninitialized"
        }
      }
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
        currentFilters: { currentFilters: populatedFilters as FilterSet },
        counts: {
          counts: {
            caseCounts: -1,
            fileCounts: -1,
            genesCounts: -1,
            mutationCounts: -1,
          },
          status: "uninitialized"
        }
      }
    });
    expect(currentCohortFilters).toEqual(populatedFilters);
  });

  test("should return initial filters when the current cohort is not set", () => {
    const currentCohortFilters = selectCurrentCohortFilters({ ...state});
    expect(currentCohortFilters).toEqual( initialFilters );
  });

  test("should return a field's filters", () => {
    const currentCohortFilters = selectCurrentCohortFiltersByName({ ...state,
      cohort: {
        currentCohort: { currentCohort: "asdf" },
        currentFilters: {
          currentFilters: populatedFilters as FilterSet
        },
        counts: {
          counts: {
            caseCounts: -1,
            fileCounts: -1,
            genesCounts: -1,
            mutationCounts: -1,
          },
          status: "uninitialized"
        }
    }
    }, 'primary_site');
    expect(currentCohortFilters).toEqual( populatedFilters.root.primary_site );
  });

});

describe("addFilter", () => {
  test("should add a filter to the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer({ currentFilters: initialFilters },
      updateCohortFilter(
      { field: "primary_site", operation : {
          operator: "includes",
          field: "primary_site",
          operands: [
            "bronchus and lung",
          ]
        }
      }
    ));
    expect(currentCohortFilters).toEqual({ currentFilters: populatedFilters });
  });
  test("should add another filter to the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer({ currentFilters: populatedFilters as FilterSet },
      updateCohortFilter(
        {
          field: "disease_type", operation: {
            operator: "includes",
            field: "disease_type",
            operands: [
              "ductal and lobular neoplasms",
            ]
          }
        }
      ));
    expect(currentCohortFilters).toEqual({ currentFilters: TwoPopulatedFilters });
  });

  test("should remove filter from the current cohort", () => {
    const currentCohortFilters = cohortFilterReducer({ currentFilters: TwoPopulatedFilters as FilterSet },
      removeCohortFilter("disease_type"));
    expect(currentCohortFilters).toEqual({ currentFilters: populatedFilters });
  });

});

