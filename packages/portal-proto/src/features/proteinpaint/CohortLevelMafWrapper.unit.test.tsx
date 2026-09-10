import { render } from "test-utils";
import { CohortLevelMafWrapper } from "./CohortLevelMafWrapper";

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

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("Cohort Level MAF UI", () => {
  render(<CohortLevelMafWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMaf).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
});
