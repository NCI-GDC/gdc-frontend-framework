import {
  updateRepositoryFilter,
  removeRepositoryFilter,
  clearRepositoryFilters,
} from "@/features/repositoryApp/repositoryFiltersSlice";
import {
  repositoryFiltersReducer,
  RepositoryFiltersSlice,
} from "./repositoryFiltersSlice";

const initialFilters: RepositoryFiltersSlice = {
  filters: { mode: "and", root: {} },
};

const populatedFilters = {
  filters: {
    mode: "and",
    root: {
      "files.data_type": {
        field: "files.data_type",
        operands: ["Transcript Fusion"],
        operator: "includes",
      },
    },
  },
};

describe("repository filter reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = repositoryFiltersReducer(undefined, { type: "asdf" });
    expect(state).toEqual(initialFilters);
  });

  test("add file filter", () => {
    const state = repositoryFiltersReducer(
      initialFilters,
      updateRepositoryFilter({
        field: "files.data_type",
        operation: {
          operator: "includes",
          field: "files.data_type",
          operands: ["Transcript Fusion"],
        },
      }),
    );

    expect(state).toEqual(populatedFilters);
  });

  test("add same file filter, state should not change", () => {
    const state = repositoryFiltersReducer(
      populatedFilters as RepositoryFiltersSlice,
      updateRepositoryFilter({
        field: "files.data_type",
        operation: {
          operator: "includes",
          field: "files.data_type",
          operands: ["Transcript Fusion"],
        },
      }),
    );

    expect(state).toEqual(populatedFilters);
  });

  test("remove file filter", () => {
    const state = repositoryFiltersReducer(
      populatedFilters as RepositoryFiltersSlice,
      removeRepositoryFilter("files.data_type"),
    );

    expect(state).toEqual(initialFilters);
  });

  test("remove unknown filter, state should remain unchanged", () => {
    const state = repositoryFiltersReducer(
      populatedFilters as RepositoryFiltersSlice,
      removeRepositoryFilter("files.data_bear"),
    );

    expect(state).toEqual(populatedFilters);
  });

  test("reset to default state should be initialFilters", () => {
    const state = repositoryFiltersReducer(
      populatedFilters as RepositoryFiltersSlice,
      clearRepositoryFilters(),
    );

    expect(state).toEqual(initialFilters);
  });
});
