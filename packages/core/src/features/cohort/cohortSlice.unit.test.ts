import { getInitialCoreState } from "../../store.unit.test";
import {
  FilterSet,
  clearCurrentCohort,
  cohortReducer,
  selectCurrentCohort,
  setCurrentCohort,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  updateCohortFilter,
  removeCohortFilter,
} from "./cohortSlice";

const state = getInitialCoreState();

const initialFilters = { mode: "and", root: {} };
const populatedFilters =
{
  mode: "and",
  root: {
    primary_site: {
      type: "enum",
      op: "in",
      field: "primary_site",
      values: [
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
        type: "enum",
        op: "in",
        field: "primary_site",
        values: [
          "bronchus and lung",
        ],
      },
      disease_type: {
        type: 'enum',
        op: 'in',
        field: 'disease_type',
        values: [
          'ductal and lobular neoplasms'
        ]
      },
    },
  };

describe("cohortSlice reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = cohortReducer(undefined, { type: "asdf" });
    expect(state).toEqual({ currentFilters: initialFilters });
  });

  test("setCurrentCohort action should set the current cohort", () => {
    const state = cohortReducer({ currentFilters: initialFilters }, setCurrentCohort("my-cohort-1"));
    expect(state.currentCohort).toEqual("my-cohort-1");
  });

  test("clearCurrentCohort action should unset the current cohort", () => {
    const state = cohortReducer(
      { currentCohort: "cohort-2", currentFilters: initialFilters },
      clearCurrentCohort(),
    );
    expect(state.currentCohort).toBeUndefined();
  });
});

describe("selectCurrentCohort", () => {
  test("should return the current cohort when it's defined", () => {
    const currentCohort = selectCurrentCohort({
      ...state,
      cohort: { currentCohort: "asdf", currentFilters: initialFilters },
    });
    expect(currentCohort).toEqual("asdf");
  });

  test("should return undefined when the current cohort is not set", () => {
    const currentCohort = selectCurrentCohort({ ...state, cohort: { currentFilters: initialFilters } });
    expect(currentCohort).toBeUndefined();
  });
});

describe("selectCurrentCohortFilters", () => {
  test("should return the current cohort filters", () => {
    const currentCohortFilters = selectCurrentCohortFilters({
      ...state,
      cohort: { currentCohort: "asdf", currentFilters: populatedFilters as FilterSet },
    });
    expect(currentCohortFilters).toEqual(populatedFilters);
  });

  test("should return initial filters when the current cohort is not set", () => {
    const currentCohortFilters = selectCurrentCohortFilters({ ...state});
    expect(currentCohortFilters).toEqual( initialFilters );
  });

  test("should return a field's filters", () => {
    const currentCohortFilters = selectCurrentCohortFiltersByName({ ...state,
      cohort: { currentCohort: "asdf", currentFilters: populatedFilters as FilterSet }
    }, 'primary_site');
    expect(currentCohortFilters).toEqual( populatedFilters.root.primary_site );
  });

});

describe("addFilter", () => {
  test("should add a filter to the current cohort", () => {
    const currentCohortFilters = cohortReducer({ currentFilters: initialFilters },
      updateCohortFilter(
      {
          type: "enum",
          op: "in",
          field: "primary_site",
          values: [
            "bronchus and lung",
          ]
      }
    ));
    expect(currentCohortFilters).toEqual({ currentFilters: populatedFilters });
  });
  test("should add another filter to the current cohort", () => {
    const currentCohortFilters = cohortReducer({ currentFilters: populatedFilters as FilterSet },
      updateCohortFilter(
        {
          type: "enum",
          op: "in",
          field: "disease_type",
          values: [
            "ductal and lobular neoplasms",
          ]
        }
      ));
    expect(currentCohortFilters).toEqual({ currentFilters: TwoPopulatedFilters });
  });

  test("should remove filter from the current cohort", () => {
    const currentCohortFilters = cohortReducer({ currentFilters: TwoPopulatedFilters as FilterSet },
      removeCohortFilter("disease_type"));
    expect(currentCohortFilters).toEqual({ currentFilters: populatedFilters });
  });

});

