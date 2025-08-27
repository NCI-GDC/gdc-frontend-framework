import { render } from "@testing-library/react";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";
import { MantineProvider } from "@mantine/core";

const filter = { abc: "xyz" };
let runpparg,
  userDetails,
  isDemoMode = false;

const resultsCreateCaseSet = { data: "test-pp-caseSet", isSuccess: true };
const nullFunction = () => null;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  useAddCohortMutation: jest.fn(() => [() => null, { isSuccess: true }]),
  useFetchUserDetailsQuery: jest.fn(() => userDetails),
  useCoreDispatch: jest.fn(() => nullFunction()),
  setActiveCohort: jest.fn(() => null),
  PROTEINPAINT_API: "host:port/basepath",
  useCreateCaseSetFromValuesMutation: () => [
    nullFunction,
    resultsCreateCaseSet,
  ],
  useLazyGetCohortsByContextIdQuery: jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({ unwrap: jest.fn() }),
    {
      isSuccess: true,
      isLoading: false,
    },
  ] as any),
  useLazyGetCohortByIdQuery: jest.fn().mockReturnValue([jest.fn()]),
  useCreateCaseSetFromFiltersMutation: jest.fn().mockReturnValue([jest.fn()]),
}));

jest.mock("@/hooks/useIsDemoApp", () => ({
  useIsDemoApp: jest.fn(() => isDemoMode),
}));

jest.mock("@gff/portal-components");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async (arg) => {
    runpparg = Object.assign({}, arg.initArgs, arg.updateArgs || {});
    return {};
  }),
}));

test("CNV Segment arguments", () => {
  userDetails = { data: { username: "test" } };
  const { unmount, rerender } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <ProteinPaintWrapper hardcodeCnvOnly={true} />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.filter0).toEqual(filter);
  expect(runpparg.allow2selectSamples).toEqual({
    buttonText: "Create Cohort",
    attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
    callback: runpparg.allow2selectSamples?.callback,
  });
  expect(runpparg.geneSearch4GDCmds3).toEqual({ hardcodeCnvOnly: true });
  isDemoMode = true;
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
  unmount();
});
