import { render } from "@testing-library/react";
import { MatrixWrapper, demoFilter } from "./MatrixWrapper";
import { MantineProvider } from "@mantine/core";

const filter = {};
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
  PROTEINPAINT_API: "host:port/basepath",
  useCreateCaseSetFromValuesMutation: () => [
    nullFunction,
    resultsCreateCaseSet,
  ],
  useLazyGetCohortByIdQuery: jest.fn().mockReturnValue([jest.fn()]),
  useLazyGetCohortsByContextIdQuery: jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({ unwrap: jest.fn() }),
    {
      isSuccess: false,
      isLoading: false,
    },
  ] as any),
  useCreateCaseSetFromFiltersMutation: jest.fn().mockReturnValue([jest.fn()]),
  useGetGenesQuery: jest.fn().mockReturnValue({
    data: {
      hits: [],
    },
    isFetching: false,
    requestId: "abc123",
  }),
  showModal: jest.fn(() => nullFunction()),
  hideModal: jest.fn(() => nullFunction()),
  Modals: jest.fn().mockReturnValue({}),
  selectCurrentModal: jest.fn(() => nullFunction()),
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

test("GeneExpression arguments", () => {
  const { unmount, rerender } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <MatrixWrapper chartType="hierCluster" />
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
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <MatrixWrapper chartType="hierCluster" />
    </MantineProvider>,
  );
  // there should be only one runpp instance when switching to this tool,
  // so the arg key-values should not change on rerender
  expect(runpparg.filter0).toEqual(demoFilter);
  unmount();
});

test("GeneExpression demo filter0", () => {
  isDemoMode = true;
  const { unmount } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <MatrixWrapper chartType="hierCluster" />
    </MantineProvider>,
  );
  expect(runpparg.filter0).not.toEqual(filter);
  unmount();
});
