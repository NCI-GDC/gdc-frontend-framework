import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { ScRNAseqWrapper } from "./ScRNAseqWrapper";

let runpparg;

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
  PROTEINPAINT_API: "host:port/basepath",
  selectCurrentCohortFilters: jest.fn(() => cohortFilters),
}));

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("single cell RNAseq arguments", () => {
  render(<ScRNAseqWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.launchGdcScApp).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
});

test("single cell demo filter0", () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<ScRNAseqWrapper />);
  expect(runpparg.state?.plots?.[0]).toEqual({
    sample: "2409",
    chartType: "sc",
    experimentID: "9f155433-3c2e-4b67-a452-eb32f06c93f7",
    activeTab: 2,
  });
});
