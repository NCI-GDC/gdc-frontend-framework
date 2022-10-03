import { getInitialCoreState } from "../../store.unit.test";
import { COHORTS } from "./cohortFixture";
import { DataStatus } from "../../dataAccess";
//import { FilterSet } from "./filters";
import {
  // selectCurrentCohortFiltersByName,
  // updateCohortFilter,
  // removeCohortFilter,
  Cohort,
  setCurrentCohortId,
  selectCurrentCohortId,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  updateCohortFilter,
} from "./availableCohortsSlice";
// import {
//   clearCurrentCohort,
//   selectCurrentCohort,
//   setCurrentCohort,
//   cohortNameReducer,
// } from "./availableCohortsSlice";
import {
  availableCohortsReducer,
  // addNewCohort,
} from "./availableCohortsSlice";
import { EntityState } from "@reduxjs/toolkit";

const state = getInitialCoreState();

const INITIAL_IDS = (COHORTS as unknown as ReadonlyArray<Cohort>).map(
  (x) => x.id,
);
const INITIAL_ENTITIES = COHORTS.reduce((dict, x) => {
  dict[x.id] = x as Cohort;
  return dict;
}, {} as Record<string, Cohort>);

const INITIAL_STATE = {
  ids: INITIAL_IDS,
  entities: INITIAL_ENTITIES,
  currentCohort: "ALL-GDC-COHORT",
} as EntityState<Cohort> & { currentCohort: string };

const APP_INITIAL_STATE = {
  ...state,
  cohort: {
    ...state.cohort,
    availableCohorts: INITIAL_STATE,
  },
};

const BAILYS_COHORT = {
  ...APP_INITIAL_STATE,
  cohort: {
    ...state.cohort,
    availableCohorts: {
      ...state.cohort.availableCohorts,
      currentCohort: "0000-0000-1000-0000",
    },
  },
};

// const PANCREAS_KRAS_MUTATED = {
//   ...APP_INITIAL_STATE,
//   cohort: {
//     ...state.cohort,
//     availableCohorts: {
//       ...state.cohort.availableCohorts,
//       currentCohort: "0000-0000-1002-0000"}
//   }
// }

// const initialFilters = { mode: "and", root: {} };
const populatedFilters = {
  mode: "and",
  root: {
    "cases.primary_site": {
      operator: "includes",
      field: "cases.primary_site",
      operands: ["bronchus and lung"],
    },
  },
};

const TwoPopulatedFilters = {
  mode: "and",
  root: {
    "cases.primary_site": {
      operator: "includes",
      field: "cases.primary_site",
      operands: ["breast", "bronchus and lung"],
    },
    disease_type: {
      operator: "includes",
      field: "disease_type",
      operands: ["ductal and lobular neoplasms"],
    },
  },
};

describe("availableCohortsReducer reducer: currentCohort test", () => {
  test("should return the default state for unknown actions", () => {
    const state = availableCohortsReducer(INITIAL_STATE, { type: "asdf" });
    expect(state).toEqual(INITIAL_STATE);
  });

  test("setCurrentCohort action should set the current cohort id", () => {
    const state = availableCohortsReducer(
      INITIAL_STATE,
      setCurrentCohortId("0000-0000-1001-0000"),
    );
    expect(state.currentCohort).toEqual("0000-0000-1001-0000");
  });
});

describe("test setting/getting currentCohortId", () => {
  const INITIAL_STATE = {
    ids: INITIAL_IDS,
    entities: INITIAL_ENTITIES,
  } as EntityState<Cohort>;
  const cohortState = {
    availableCohorts: { ...INITIAL_STATE, currentCohort: "asdf" },
    counts: {
      counts: {
        caseCounts: -1,
        fileCounts: -1,
        genesCounts: -1,
        mutationCounts: -1,
      },
      status: "uninitialized" as DataStatus,
    },
    comparisonCohorts: [],
    builderConfig: {},
  };

  test("should return the current cohort id when it's defined", () => {
    const currentCohortId = selectCurrentCohortId({
      ...state,
      cohort: cohortState,
    });
    expect(currentCohortId).toEqual("asdf");
  });

  test("should set the current cohort id", () => {
    const newState = availableCohortsReducer(
      { ...INITIAL_STATE, currentCohort: "asdf" },
      setCurrentCohortId("1111-2222-3333-4444"),
    );
    const currentCohortId = selectCurrentCohortId({
      ...state,
      cohort: {
        ...state.cohort,
        availableCohorts: newState,
      },
    });
    expect(currentCohortId).toEqual("1111-2222-3333-4444");
  });
});

describe("get/set current cohort filters", () => {
  test("should return the current cohort filters", () => {
    const currentCohortFilters = selectCurrentCohortFilters({
      ...APP_INITIAL_STATE,
      cohort: {
        ...state.cohort,
        availableCohorts: {
          ...state.cohort.availableCohorts,
          currentCohort: "0000-0000-1000-0000",
        },
      },
    });
    expect(currentCohortFilters).toEqual(COHORTS[1].filters);
  });

  // test("should return initial filters when the current cohort is not set", () => {
  //   const currentCohortFilters = selectCurrentCohortFilters({
  //     ...APP_INITIAL_STATE,
  //       cohort: {
  //       ...APP_INITIAL_STATE.cohort,
  //           availableCohorts: { currentCohort: undefined },
  //   },
  //   });
  //   expect(currentCohortFilters).toEqual(initialFilters);
  // });

  test("should return a field's filters", () => {
    const expected = {
      mode: "and",
      root: {
        "cases.primary_site": {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast", "bronchus and lung"],
        },
      },
    };

    const currentCohortFilters = selectCurrentCohortFiltersByName(
      {
        ...APP_INITIAL_STATE,
        cohort: {
          ...state.cohort,
          availableCohorts: {
            ...state.cohort.availableCohorts,
            currentCohort: "0000-0000-1000-0000",
          },
        },
      },
      "cases.primary_site",
    );
    expect(currentCohortFilters).toEqual(expected.root["cases.primary_site"]);
  });
});

describe("addFilter", () => {
  test("should add a filter to the current cohort", () => {
    const newState = availableCohortsReducer(
      INITIAL_STATE,
      updateCohortFilter({
        field: "cases.primary_site",
        operation: {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["bronchus and lung"],
        },
      }),
    );
    expect(newState.entities[newState.currentCohort]?.filters).toEqual({
      filters: populatedFilters,
    });
  });

  test("should add another filter to the current cohort", () => {
    const newState = availableCohortsReducer(
      BAILYS_COHORT.cohort.availableCohorts,
      updateCohortFilter({
        field: "disease_type",
        operation: {
          operator: "includes",
          field: "disease_type",
          operands: ["ductal and lobular neoplasms"],
        },
      }),
    );
    expect(newState.entities[newState.currentCohort]?.filters).toEqual({
      filters: TwoPopulatedFilters,
    });
  });
});
//
//   test("should not add a duplicate filter to the current cohort", () => {
//     const currentCohortFilters = cohortFilterReducer(
//       { filters: populatedFilters as FilterSet },
//       updateCohortFilter({
//         field: "primary_site",
//         operation: {
//           operator: "includes",
//           field: "primary_site",
//           operands: ["bronchus and lung"],
//         },
//       }),
//     );
//     expect(currentCohortFilters).toEqual({ filters: populatedFilters });
//   });
//
//   test("should remove filter from the current cohort", () => {
//     const currentCohortFilters = cohortFilterReducer(
//       { filters: TwoPopulatedFilters as FilterSet },
//       removeCohortFilter("disease_type"),
//     );
//     expect(currentCohortFilters).toEqual({ filters: populatedFilters });
//   });
// });
//
// describe("add, update, and remove cohort", () => {
//   test("should add new cohort to available cohorts", () => {
//     const availableCohorts = availableCohortsReducer(
//       { ids: [], entities: {} },
//       addNewCohort("000-000-000-1"),
//     );
//     expect(availableCohorts).toEqual({
//       ids: ["000-000-000-1"],
//       entities: {
//         "000-000-000-1": {
//           name: "cohort1",
//           filters: { mode: "and", root: {} },
//           id: "000-000-000-1",
//         },
//       },
//     });
//   });
//
//   test("should update cohort with new name", () => {
//     const availableCohorts = availableCohortsReducer(
//       {
//         ids: ["000-000-000-1"],
//         entities: {
//           "000-000-000-1": {
//             name: "cohort1",
//             filters: { mode: "and", root: {} },
//             id: "000-000-000-1",
//           },
//         },
//       },
//       updateCohort({ id: "000-000-000-1", changes: { name: "cohort2" } }),
//     );
//     expect(availableCohorts).toEqual({
//       ids: ["000-000-000-1"],
//       entities: {
//         "000-000-000-1": {
//           name: "cohort2",
//           filters: { mode: "and", root: {} },
//           id: "000-000-000-1",
//         },
//       },
//     });
//   });
//
//   test("should update cohort with new filter", () => {
//     const availableCohorts = availableCohortsReducer(
//       {
//         ids: ["000-000-000-1"],
//         entities: {
//           "000-000-000-1": {
//             name: "cohort1",
//             filters: { mode: "and", root: {} },
//             id: "000-000-000-1",
//           },
//         },
//       },
//       updateCohort({
//         id: "000-000-000-1",
//         changes: { filters: TwoPopulatedFilters as FilterSet },
//       }),
//     );
//     expect(availableCohorts).toEqual({
//       ids: ["000-000-000-1"],
//       entities: {
//         "000-000-000-1": {
//           name: "cohort1",
//           filters: TwoPopulatedFilters as FilterSet,
//           id: "000-000-000-1",
//         },
//       },
//     });
//   });
// });
//
//
