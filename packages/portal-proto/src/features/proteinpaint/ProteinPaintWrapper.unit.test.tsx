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
  useGetCohortsByContextIdQuery: jest
    .fn()
    .mockReturnValue({ data: [], isSuccess: true, isLoading: false }),
  useLazyGetCohortByIdQuery: jest.fn().mockReturnValue([jest.fn()]),
}));

jest.mock("@/hooks/useIsDemoApp", () => ({
  useIsDemoApp: jest.fn(() => isDemoMode),
}));

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("SSM lolliplot arguments", () => {
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
      <ProteinPaintWrapper />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.genome).toEqual("hg38");
  expect(runpparg.tracks).toEqual([
    {
      type: "mds3",
      dslabel: "GDC",
      filter0: { abc: "xyz" },
      allow2selectSamples: {
        buttonText: "Create Cohort",
        attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
        callback: runpparg.tracks[0]?.allow2selectSamples?.callback,
      },
    },
  ]);
  expect(runpparg.geneSearch4GDCmds3).toEqual(true);
  expect(runpparg.tracks?.[0].filter0).toEqual(filter);
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
  expect(runpparg.tracks?.[0].filter0).not.toEqual(filter);
  unmount();
});
