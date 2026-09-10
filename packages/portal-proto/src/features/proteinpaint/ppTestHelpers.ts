// Shared fixtures + core-module mock for the ProteinPaint wrapper unit tests.
//
// Usage in a test file:
//
//   jest.mock("@gff/core", () => require("./ppTestHelpers").mockGffCore());
//   const expectedFilter0 = getExpectedFilter0();
//
// The mock is required INSIDE the jest.mock factory (not imported at the top)
// so the hoisted jest.mock does not depend on import order. Per-test needs are
// passed as overrides, e.g.
//   jest.mock("@gff/core", () =>
//     require("./ppTestHelpers").mockGffCore({ GDC_API: "..." }));

// A realistic "current cohort" as held in the store. Private to this module:
// only mockGffCore's selectCurrentCohortFilters uses it, so the tests never see
// it. Returns a fresh copy each call so nothing is shared/mutated across tests.
// The real buildCohortGqlOperator() runs on this in the wrappers - it is never
// mocked - producing getExpectedFilter0().
const currentCohortFilters = () => ({
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["FM-AD"],
    },
  },
});

// What buildCohortGqlOperator(currentCohortFilters()) produces - the value the
// wrappers pass to proteinpaint as filter0 in non-demo mode. A fresh copy each
// call so assertions never share a mutable object.
export const getExpectedFilter0 = () => ({
  op: "and",
  content: [
    {
      op: "in",
      content: { field: "cases.project.project_id", value: ["FM-AD"] },
    },
  ],
});

// Builds the core mock: the real module, with only API access and the store's
// cohort selector replaced. Pass `overrides` to tweak per test.
export const mockGffCore = (overrides: Record<string, unknown> = {}) => {
  // One cohort object per mockGffCore() call (i.e. per test file): fresh across
  // files, but a STABLE reference within a render. react-redux warns if a
  // selector returns a new reference for the same state, so the selector must
  // not build a new object on each call.
  const cohortFilters = currentCohortFilters();
  return {
    ...jest.requireActual("@gff/core"),
    // API interactions:
    useFetchUserDetailsQuery: jest.fn(() => ({ data: { username: "test" } })),
    useCreateCaseSetFromValuesMutation: () => [
      jest.fn(),
      { data: "test-pp-caseSet", isSuccess: true },
    ],
    PROTEINPAINT_API: "host:port/basepath",
    // "existing state" of the store:
    selectCurrentCohortFilters: jest.fn(() => cohortFilters),
    ...overrides,
  };
};
