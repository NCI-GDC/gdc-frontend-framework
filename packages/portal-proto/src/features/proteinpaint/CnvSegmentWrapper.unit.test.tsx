import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

let runpparg;
const resultsCreateCaseSet = { data: "test-pp-caseSet", isSuccess: true };

jest.mock("@gff/core", () => ({
  // This line makes it so we are not mocking out the entire module, causing the "cascade of mocks"
  ...jest.requireActual("@gff/core"),
  useFetchUserDetailsQuery: jest.fn(() => ({ data: { username: "test" } })),
  useCreateCaseSetFromValuesMutation: () => [jest.fn(), resultsCreateCaseSet],
  PROTEINPAINT_API: "host:port/basepath",
  // We should mock out the function pulling information from the store, not buildCohortGqlOperator
  selectCurrentCohortFilters: jest.fn().mockReturnValue({
    mode: "and",
    root: {
      "cases.project.project_id": {
        operator: "includes",
        field: "cases.project.project_id",
        operands: ["FM-AD"],
      },
    },
    isLoggedIn: true,
  }),
}));

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async (arg) => {
    runpparg = Object.assign({}, arg.initArgs, arg.updateArgs || {});
    return {};
  }),
}));

test("CNV Segment arguments", () => {
  // We have a test util function that handles wrapping the component in the needed providers
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);

  useIsDemoApp.mockReturnValue(true);

  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.filter0).toEqual({
    op: "and",
    content: [
      {
        op: "in",
        content: {
          field: "cases.project.project_id",
          value: ["FM-AD"],
        },
      },
    ],
    isLoggedIn: true,
  });
  expect(runpparg.allow2selectSamples).toEqual({
    buttonText: "Create Cohort",
    attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
    callback: runpparg.allow2selectSamples?.callback,
  });
  expect(runpparg.geneSearch4GDCmds3).toEqual({ hardcodeCnvOnly: true });

  // I would move all of this to a seperate test
  /*
  rerender(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <ProteinPaintWrapper />
    </MantineProvider>,
  );
  expect(runpparg.filter0).not.toEqual(filter);
  */
});
