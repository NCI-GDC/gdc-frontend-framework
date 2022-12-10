import {
  Cohort,
  addNewCohort,
  updateCohortName,
  setCurrentCohortId,
  selectCurrentCohortId,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  updateCohortFilter,
  removeCohortFilter,
  removeCohort,
  availableCohortsReducer,
  addNewCohortWithFilterAndMessage,
  divideCurrentCohortFilterSetFilterByPrefix,
  divideFilterSetByPrefix,
  buildCaseSetGQLQueryAndVariables,
  buildCaseSetMutationQuery,
  REQUIRES_CASE_SET_FILTERS,
} from "../availableCohortsSlice";
import * as cohortSlice from "../availableCohortsSlice";
import { Dictionary, EntityState } from "@reduxjs/toolkit";
import { MOCK_COHORTS } from "./mockData";
import { FilterSet } from "../filters";
import { getInitialCoreState } from "src/store.unit.test";
import { DataStatus } from "src/dataAccess";

const state = getInitialCoreState();

const INITIAL_IDS = (MOCK_COHORTS as unknown as ReadonlyArray<Cohort>).map(
  (x) => x.id,
);
const INITIAL_ENTITIES = MOCK_COHORTS.reduce((dict, x) => {
  dict[x.id] = x as Cohort;
  return dict;
}, {} as Record<string, Cohort>);

const INITIAL_STATE = {
  ids: INITIAL_IDS,
  entities: INITIAL_ENTITIES,
  currentCohort: "ALL-GDC-COHORT",
  message: undefined,
} as EntityState<Cohort> & {
  currentCohort: string;
  message: string | undefined;
};

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
    ...APP_INITIAL_STATE.cohort,
    availableCohorts: {
      ...APP_INITIAL_STATE.cohort.availableCohorts,
      currentCohort: "0000-0000-1000-0000",
    },
  },
};

const PANCREAS_KRAS_MUTATED = {
  ...APP_INITIAL_STATE,
  cohort: {
    ...APP_INITIAL_STATE.cohort,
    availableCohorts: {
      ...APP_INITIAL_STATE.cohort.availableCohorts,
      currentCohort: "0000-0000-1002-0000",
    },
  },
};

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
    availableCohorts: {
      ...INITIAL_STATE,
      currentCohort: "asdf",
      message: undefined,
    },
    cohortCounts: {
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
      { ...INITIAL_STATE, currentCohort: "asdf", message: undefined },
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
        ...APP_INITIAL_STATE.cohort,
        availableCohorts: {
          ...APP_INITIAL_STATE.cohort.availableCohorts,
          currentCohort: "0000-0000-1000-0000",
        },
      },
    });
    expect(currentCohortFilters).toEqual(MOCK_COHORTS[1].filters);
  });

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
          ...APP_INITIAL_STATE.cohort,
          availableCohorts: {
            ...APP_INITIAL_STATE.cohort.availableCohorts,
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
      { ...INITIAL_STATE, currentCohort: "0000-0000-1001-0000" },
      updateCohortFilter({
        field: "cases.primary_site",
        operation: {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["bronchus and lung"],
        },
      }),
    );
    expect(newState.entities[newState.currentCohort]?.filters).toEqual(
      populatedFilters,
    );
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
    expect(newState.entities[newState.currentCohort]?.filters).toEqual(
      TwoPopulatedFilters,
    );
  });

  test("should not add a duplicate filter to the current cohort", () => {
    const newState = availableCohortsReducer(
      BAILYS_COHORT.cohort.availableCohorts,
      updateCohortFilter({
        field: "cases.primary_site",
        operation: {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast", "bronchus and lung"],
        },
      }),
    );
    expect(newState.entities[newState.currentCohort]?.filters).toEqual({
      mode: "and",
      root: {
        "cases.primary_site": {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast", "bronchus and lung"],
        },
      },
    });
  });

  test("should remove filter from the current cohort", () => {
    const newState = availableCohortsReducer(
      PANCREAS_KRAS_MUTATED.cohort.availableCohorts,
      removeCohortFilter("genes.symbol"),
    );

    const newFilters = selectCurrentCohortFilters({
      ...state,
      cohort: {
        ...state.cohort,
        availableCohorts: newState,
      },
    });

    expect(newFilters).toEqual({
      root: {
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    });
  });
});

describe("filter by prefix", () => {
  test("should extract all filter prefixed by file", () => {
    const filter = {
      mode: "and",
      root: {
        "cases.diagnoses.tissue_or_organ_of_origin": {
          operator: "includes",
          field: "cases.diagnoses.tissue_or_organ_of_origin",
          operands: ["anterior mediastinum"],
        },
        "files.data_category": {
          operator: "includes",
          field: "files.data_category",
          operands: ["clinical", "proteome profiling"],
        },
      },
    } as FilterSet;

    const localState = {
      ...APP_INITIAL_STATE,
      cohort: {
        ...state.cohort,
        availableCohorts: {
          currentCohort: "000-000-000-1",
          message: "newCohort|New Cohort",
          ids: ["000-000-000-1"],
          entities: {
            "000-000-000-1": {
              name: "New Cohort",
              filters: filter,
              id: "000-000-000-1",
              caseSet: {
                caseSetId: {
                  mode: "and",
                  root: {},
                },
                status: "uninitialized",
              },
              modified_datetime: "2020-11-01T00:00:00.000Z",
              modified: false,
              saved: false,
            },
          } as Dictionary<Cohort>,
        },
      },
    };

    const res = divideCurrentCohortFilterSetFilterByPrefix(localState, [
      "files.",
    ]);
    expect(res).toEqual({
      withPrefix: {
        mode: "and",
        root: {
          "files.data_category": {
            field: "files.data_category",
            operands: ["clinical", "proteome profiling"],
            operator: "includes",
          },
        },
      },
      withoutPrefix: {
        mode: "and",
        root: {
          "cases.diagnoses.tissue_or_organ_of_origin": {
            field: "cases.diagnoses.tissue_or_organ_of_origin",
            operands: ["anterior mediastinum"],
            operator: "includes",
          },
        },
      },
    });
  });
});

describe("add, update, and remove cohort", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  jest
    .spyOn(cohortSlice, "createCohortId")
    .mockReturnValueOnce("000-000-000-1")
    .mockReturnValueOnce("000-000-000-2")
    .mockReturnValueOnce("000-000-000-3");
  jest
    .spyOn(cohortSlice, "createCohortName")
    .mockReturnValueOnce("New Cohort")
    .mockReturnValueOnce("New Cohort 2")
    .mockReturnValueOnce("New Cohort 3");
  const mockedDate = new Date("2020-11-01T00:00:00.000Z");
  // Override the correct Date function, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42067#issuecomment-643674689
  type PatchedGlobal = {
    Date: new (...args: ConstructorParameters<DateConstructor>) => Date;
  };

  jest
    .spyOn(global as PatchedGlobal, "Date")
    .mockImplementation(() => mockedDate);

  test("should add new cohort to available cohorts", () => {
    const availableCohorts = availableCohortsReducer(
      { ids: [], entities: {}, currentCohort: "", message: undefined },
      addNewCohort(),
    );
    expect(availableCohorts).toEqual({
      currentCohort: "000-000-000-1",
      message: "newCohort|New Cohort|000-000-000-1",
      ids: ["000-000-000-1"],
      entities: {
        "000-000-000-1": {
          name: "New Cohort",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified_datetime: "2020-11-01T00:00:00.000Z",
          modified: false,
          saved: false,
        },
      },
    });
  });

  test("should add new cohort with filter and message", () => {
    const availableCohorts = availableCohortsReducer(
      {
        currentCohort: "000-000-000-1",
        message: undefined,
        ids: ["000-000-000-1"],
        entities: {
          "000-000-000-1": {
            name: "New Cohort",
            filters: { mode: "and", root: {} },
            id: "000-000-000-1",
            caseSet: {
              status: "uninitialized",
            },
            modified: false,
            modified_datetime: new Date().toISOString(),
          },
        },
      },
      addNewCohortWithFilterAndMessage({
        filters: {
          mode: "and",
          root: {
            "cases.primary_site": {
              operator: "includes",
              field: "cases.primary_site",
              operands: ["breast", "bronchus and lung"],
            },
          },
        },
        message: "newProjectsCohort",
      }),
    );
    expect(availableCohorts).toEqual({
      currentCohort: "000-000-000-1",
      message: "newProjectsCohort|New Cohort 2|000-000-000-2",
      ids: ["000-000-000-1", "000-000-000-2"],
      entities: {
        "000-000-000-1": {
          name: "New Cohort",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified: false,
          modified_datetime: "2020-11-01T00:00:00.000Z",
        },
        "000-000-000-2": {
          filters: {
            mode: "and",
            root: {
              "cases.primary_site": {
                field: "cases.primary_site",
                operands: ["breast", "bronchus and lung"],
                operator: "includes",
              },
            },
          },
          id: "000-000-000-2",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified: false,
          modified_datetime: "2020-11-01T00:00:00.000Z",
          name: "New Cohort 2",
          saved: false,
        },
      },
    });
  });

  test("should add new cohort to available cohorts when we have existing cohorts", () => {
    const availableCohorts = availableCohortsReducer(
      {
        currentCohort: "000-000-000-1",
        message: undefined,
        ids: ["000-000-000-1"],
        entities: {
          "000-000-000-1": {
            name: "New Cohort",
            filters: { mode: "and", root: {} },
            id: "000-000-000-1",
            caseSet: {
              status: "uninitialized",
            },
            modified: false,
            modified_datetime: "2020-11-01T00:00:00.000Z",
          },
        },
      },
      addNewCohort(),
    );
    expect(availableCohorts).toEqual({
      currentCohort: "000-000-000-3",
      message: "newCohort|New Cohort 3|000-000-000-3",
      ids: ["000-000-000-1", "000-000-000-3"],
      entities: {
        "000-000-000-1": {
          name: "New Cohort",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified: false,
          modified_datetime: "2020-11-01T00:00:00.000Z",
        },
        "000-000-000-3": {
          filters: { mode: "and", root: {} },
          id: "000-000-000-3",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified: false,
          modified_datetime: "2020-11-01T00:00:00.000Z",
          name: "New Cohort 3",
          saved: false,
        },
      },
    });
  });

  test("should update cohort with new name", () => {
    const availableCohorts = availableCohortsReducer(
      {
        currentCohort: "000-000-000-1",
        message: undefined,
        ids: ["000-000-000-1"],
        entities: {
          "000-000-000-1": {
            name: "cohort1",
            filters: { mode: "and", root: {} },
            id: "000-000-000-1",
            caseSet: {
              status: "uninitialized",
            },
            modified: false,
            modified_datetime: new Date().toISOString(),
          },
        },
      },
      updateCohortName("cohort2"),
    );
    expect(availableCohorts).toEqual({
      currentCohort: "000-000-000-1",
      ids: ["000-000-000-1"],
      entities: {
        "000-000-000-1": {
          name: "cohort2",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified: false,
          modified_datetime: "2020-11-01T00:00:00.000Z",
        },
      },
      message: undefined,
    });
  });

  test("should remove the current cohort", () => {
    const availableCohorts = availableCohortsReducer(
      {
        currentCohort: "000-000-000-2",
        message: undefined,
        ids: ["ALL-GDC-COHORT", "000-000-000-2"],
        entities: {
          "ALL-GDC-COHORT": {
            name: "All GDC",
            filters: { mode: "and", root: {} },
            id: "ALL-GDC-COHORT",
            caseSet: {
              status: "uninitialized",
            },
            modified: false,
            modified_datetime: new Date().toISOString(),
          },
          "000-000-000-2": {
            name: "New Cohort 2",
            filters: { mode: "and", root: {} },
            id: "000-000-000-2",
            caseSet: {
              status: "uninitialized",
            },
            modified: false,
            modified_datetime: new Date().toISOString(),
          },
        },
      },
      removeCohort({ shouldShowMessage: true }),
    );
    expect(availableCohorts).toEqual({
      currentCohort: "ALL-GDC-COHORT",
      message: "deleteCohort|New Cohort 2|000-000-000-2",
      ids: ["ALL-GDC-COHORT"],
      entities: {
        "ALL-GDC-COHORT": {
          name: "All GDC",
          filters: { mode: "and", root: {} },
          id: "ALL-GDC-COHORT",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized",
          },
          modified: false,
          modified_datetime: "2020-11-01T00:00:00.000Z",
        },
      },
    });
  });

  test("should not remove the first cohort", () => {
    const removeState = {
      currentCohort: "ALL-GDC-COHORT",
      message: "deleteCohort|New Cohort 2|000-000-000-1",
      ids: ["ALL-GDC-COHORT", "000-000-000-1"],
      entities: {
        "ALL-GDC-COHORT": {
          name: "All GDC",
          filters: { mode: "and", root: {} },
          id: "ALL-GDC-COHORT",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized" as DataStatus,
          },
          modified: false,
          modified_datetime: new Date().toISOString(),
        },
        "000-000-000-1": {
          name: "New Cohort",
          filters: { mode: "and", root: {} },
          id: "000-000-000-1",
          caseSet: {
            caseSetId: {
              mode: "and",
              root: {},
            },
            status: "uninitialized" as DataStatus,
          },
          modified: false,
          modified_datetime: new Date().toISOString(),
        },
      },
    };

    const availableCohorts = availableCohortsReducer(
      removeState,
      removeCohort({ shouldShowMessage: true }),
    );
    expect(availableCohorts).toEqual(removeState);
  });
});

describe("caseSet creation", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const cohortFilters: FilterSet = {
    mode: "and",
    root: {
      "genes.symbol": {
        field: "genes.symbol",
        operands: ["KRAS"],
        operator: "includes",
      },
      "ssms.ssm_id": {
        field: "ssms.ssm_id",
        operands: ["84aef48f-31e6-52e4-8e05-7d5b9ab15087"],
        operator: "includes",
      },
      "cases.primary_site": {
        field: "cases.primary_site",
        operands: ["pancreas"],
        operator: "includes",
      },
    },
  };

  test("divide the cohort filters", () => {
    const dividedFilters = divideFilterSetByPrefix(
      cohortFilters,
      REQUIRES_CASE_SET_FILTERS,
    );

    const expected = {
      withPrefix: {
        mode: "and",
        root: {
          "genes.symbol": {
            field: "genes.symbol",
            operands: ["KRAS"],
            operator: "includes",
          },
          "ssms.ssm_id": {
            field: "ssms.ssm_id",
            operands: ["84aef48f-31e6-52e4-8e05-7d5b9ab15087"],
            operator: "includes",
          },
        },
      },
      withoutPrefix: {
        mode: "and",
        root: {
          "cases.primary_site": {
            field: "cases.primary_site",
            operands: ["pancreas"],
            operator: "includes",
          },
        },
      },
    };
    expect(dividedFilters).toEqual(expected);
  });

  test("build the createSetQuery", () => {
    const dividedFilters = divideFilterSetByPrefix(
      cohortFilters,
      REQUIRES_CASE_SET_FILTERS,
    );
    const { query, parameters, variables } = buildCaseSetGQLQueryAndVariables(
      dividedFilters.withPrefix,
      "2394944y3",
    );

    expect(query).toEqual(
      "genesCases : case (input: $inputgenes) { set_id size }," +
        "ssmsCases : case (input: $inputssms) { set_id size }",
    );

    const expected = {
      inputgenes: {
        filters: {
          content: [
            {
              content: {
                field: "genes.symbol",
                value: ["KRAS"],
              },
              op: "in",
            },
          ],
          op: "and",
        },
        set_id: "2394944y3-g",
      },
      inputssms: {
        filters: {
          content: [
            {
              content: {
                field: "ssms.ssm_id",
                value: ["84aef48f-31e6-52e4-8e05-7d5b9ab15087"],
              },
              op: "in",
            },
          ],
          op: "and",
        },
        set_id: "2394944y3-s",
      },
    };

    expect(variables).toEqual(expected);
    const graphQL = buildCaseSetMutationQuery(parameters, query);
    expect(graphQL).toEqual(`
mutation mutationsCreateRepositoryCaseSetMutation(
   $inputgenes: CreateSetInput, $inputssms: CreateSetInput
) {
  sets {
    create {
      explore {
       genesCases : case (input: $inputgenes) { set_id size },ssmsCases : case (input: $inputssms) { set_id size }
    }
  }
 }
}`);
  });
});
