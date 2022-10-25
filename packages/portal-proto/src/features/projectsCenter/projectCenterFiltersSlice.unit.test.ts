import {
  updateProjectFilter,
  removeProjectFilter,
  clearProjectFilters,
} from "@/features/projectsCenter/projectCenterFiltersSlice";
import {
  projectCenterFiltersReducer,
  ProjectCenterFiltersState,
} from "./projectCenterFiltersSlice";

const initialFilters: ProjectCenterFiltersState = {
  filters: { mode: "and", root: {} },
};

const populatedFilters = {
  filters: {
    mode: "and",
    root: {
      "projects.program.name": {
        field: "projects.program.name",
        operands: ["TCGA"],
        operator: "includes",
      },
    },
  },
};

describe("project center filter reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = projectCenterFiltersReducer(undefined, { type: "no-op" });
    expect(state).toEqual(initialFilters);
  });

  test("add project filter", () => {
    const state = projectCenterFiltersReducer(
      initialFilters,
      updateProjectFilter({
        field: "projects.program.name",
        operation: {
          operator: "includes",
          field: "projects.program.name",
          operands: ["TCGA"],
        },
      }),
    );

    expect(state).toEqual(populatedFilters);
  });

  test("add same file filter, state should not change", () => {
    const state = projectCenterFiltersReducer(
      populatedFilters as ProjectCenterFiltersState,
      updateProjectFilter({
        field: "projects.program.name",
        operation: {
          operator: "includes",
          field: "projects.program.name",
          operands: ["TCGA"],
        },
      }),
    );

    expect(state).toEqual(populatedFilters);
  });

  test("remove file filter", () => {
    const state = projectCenterFiltersReducer(
      populatedFilters as ProjectCenterFiltersState,
      removeProjectFilter("projects.program.name"),
    );

    expect(state).toEqual(initialFilters);
  });

  test("remove unknown filter, state should remain unchanged", () => {
    const state = projectCenterFiltersReducer(
      populatedFilters as ProjectCenterFiltersState,
      removeProjectFilter("projects.program.owner"),
    );

    expect(state).toEqual(populatedFilters);
  });

  test("reset to default state should be initialFilters", () => {
    const state = projectCenterFiltersReducer(
      populatedFilters as ProjectCenterFiltersState,
      clearProjectFilters(),
    );

    expect(state).toEqual(initialFilters);
  });
});
