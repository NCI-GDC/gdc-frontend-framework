import { render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import * as coreAdapter from "./coreAdapter";
import { MatrixWrapper, demoFilter } from "./MatrixWrapper";

const filter = {};
let runpparg,
  userDetails,
  isDemoMode = false;

// (1) The single @gff/core seam for the wrapper's OWN core imports.
jest.mock("./coreAdapter");

// (2) Out-of-dir code the wrapper renders that reaches @gff/core on its own.
jest.mock("@gff/portal-components", () => ({
  SaveCohortModal: () => null,
}));
jest.mock("../cohortBuilder/CohortManager/cohortActionHooks", () => ({
  cohortActionsHooks: {},
}));
jest.mock("../cohortBuilder/utils", () => ({
  INVALID_COHORT_NAMES: [],
}));
jest.mock("@/components/Modals/SetModals/GeneSetModal", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/hooks/useIsDemoApp", () => ({
  useIsDemoApp: jest.fn(() => isDemoMode),
}));

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async (arg) => {
    runpparg = Object.assign({}, arg.initArgs, arg.updateArgs || {});
    return {};
  }),
}));

const mockedCore = jest.mocked(coreAdapter);
mockedCore.buildCohortGqlOperator.mockImplementation(() => filter as any);
mockedCore.useFetchUserDetailsQuery.mockImplementation(() => userDetails);
mockedCore.useGetGenesQuery.mockReturnValue({
  data: { hits: [] },
  isFetching: false,
  requestId: "abc123",
} as any);

const theme = {
  colors: {
    primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
} as const;

test("OncoMatrix arguments", () => {
  const { unmount, rerender } = render(
    <MantineProvider theme={theme}>
      <MatrixWrapper chartType="matrix" />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMatrix).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  isDemoMode = true;
  rerender(
    <MantineProvider theme={theme}>
      <MatrixWrapper chartType="matrix" />
    </MantineProvider>,
  );
  // there should be only one runpp instance when switching to this tool,
  // so the arg key-values should not change on rerender
  expect(runpparg.filter0).toEqual(demoFilter);
  unmount();
});

test("OncoMatrix demo filter0", () => {
  isDemoMode = true;
  const { unmount } = render(
    <MantineProvider theme={theme}>
      <MatrixWrapper chartType="matrix" />
    </MantineProvider>,
  );
  expect(runpparg.filter0).not.toEqual(filter);
  unmount();
});
