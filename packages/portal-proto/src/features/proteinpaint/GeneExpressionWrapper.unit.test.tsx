import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { MatrixWrapper, demoFilter } from "./MatrixWrapper";

let runpparg;
const resultsCreateCaseSet = { data: "test-pp-caseSet", isSuccess: true };

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
  ...jest.requireActual("@gff/core"),
  useFetchUserDetailsQuery: jest.fn(() => ({ data: { username: "test" } })),
  useCreateCaseSetFromValuesMutation: () => [jest.fn(), resultsCreateCaseSet],
  PROTEINPAINT_API: "host:port/basepath",
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

test("GeneExpression arguments", () => {
  render(<MatrixWrapper chartType="hierCluster" />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcHierCluster).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
});

test("GeneExpression demo mode uses the demo filter", () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<MatrixWrapper chartType="hierCluster" />);
  expect(runpparg.filter0).toEqual(demoFilter);
});
