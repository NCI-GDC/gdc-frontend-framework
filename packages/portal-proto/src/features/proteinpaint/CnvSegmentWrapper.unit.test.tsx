import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

let runpparg;
const resultsCreateCaseSet = { data: "test-pp-caseSet", isSuccess: true };

// A realistic "current cohort" as it would be held in the store. The real
// buildCohortGqlOperator() runs on this — we do not mock that transform.
const cohortFilters = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["FM-AD"],
    },
  },
};
const expectedFilter0 = {
  op: "and",
  content: [
    {
      op: "in",
      content: { field: "cases.project.project_id", value: ["FM-AD"] },
    },
  ],
};

jest.mock("@gff/core", () => ({
  // Keep the real module so we only mock API access and store state, not logic.
  ...jest.requireActual("@gff/core"),
  // API interactions:
  useFetchUserDetailsQuery: jest.fn(() => ({ data: { username: "test" } })),
  useCreateCaseSetFromValuesMutation: () => [jest.fn(), resultsCreateCaseSet],
  PROTEINPAINT_API: "host:port/basepath",
  // "existing state" of the store:
  selectCurrentCohortFilters: jest.fn(() => cohortFilters),
}));

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async (arg) => {
    runpparg = Object.assign({}, arg.initArgs, arg.updateArgs || {});
    return { triggerAbort: jest.fn() };
  }),
}));

test("CNV Segment arguments", () => {
  // test-utils render() wraps the component in the real CoreProvider + Mantine.
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(runpparg.allow2selectSamples).toEqual({
    buttonText: "Create Cohort",
    attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
    callback: runpparg.allow2selectSamples?.callback,
  });
  expect(runpparg.geneSearch4GDCmds3).toEqual({ hardcodeCnvOnly: true });
});

test("CNV Segment demo mode ignores the cohort filter", () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);
  expect(runpparg.filter0).toBeNull();
});
