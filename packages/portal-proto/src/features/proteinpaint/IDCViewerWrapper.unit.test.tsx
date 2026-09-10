import { render } from "test-utils";
import { IDCViewerWrapperPP } from "./IDCViewerWrapperPP";

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
  PROTEINPAINT_API: "protocol://host:port/basepath",
  GDC_API: "protocol://host/basepath",
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

test("IDCViewerWrapperPP arguments", () => {
  render(<IDCViewerWrapperPP />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchIdc).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(typeof runpparg.GDC_API).toEqual("string");
});
