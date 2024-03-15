import { render } from "@testing-library/react";
import { GeneExpressionWrapper } from "./GeneExpressionWrapper";
import { MantineProvider } from "@mantine/core";

const filter = {};
let runpparg,
  userDetails,
  isDemoMode = false;

const resultsCreateCaseSet = { data: "test-pp-caseSet", isSuccess: true };
const nullFunction = () => null;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  selectCurrentCohortFilterSet: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  useAddCohortMutation: jest.fn(() => [() => null, { isSuccess: true }]),
  useFetchUserDetailsQuery: jest.fn(() => userDetails),
  useCoreDispatch: jest.fn(() => nullFunction()),
  PROTEINPAINT_API: "host:port/basepath",
  useCreateCaseSetFromValuesMutation: () => [
    nullFunction,
    resultsCreateCaseSet,
  ],
  useLazyGetCohortByIdQuery: jest.fn().mockReturnValue([jest.fn()]),
  useGetCohortsByContextIdQuery: jest.fn().mockReturnValue([jest.fn()]),
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

test("GeneExpression arguments", () => {
  const { unmount, rerender } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        },
      }}
    >
      <GeneExpressionWrapper />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcHierCluster).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  isDemoMode = true;
  rerender(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        },
      }}
    >
      <GeneExpressionWrapper />
    </MantineProvider>,
  );
  // there should be only one runpp instance when switching to this tool,
  // so the arg key-values should not change on rerender
  expect(runpparg.filter0).toEqual(filter);
  unmount();
});

test("GeneExpression demo filter0", () => {
  isDemoMode = true;
  const { unmount } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        },
      }}
    >
      <GeneExpressionWrapper />
    </MantineProvider>,
  );
  expect(runpparg.filter0).not.toEqual(filter);
  unmount();
});
