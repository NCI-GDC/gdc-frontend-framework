import { render } from "@testing-library/react";
import * as coreAdapter from "./coreAdapter";
import { CorrelationWrapper, demoFilter } from "./CorrelationWrapper";
import { MantineProvider } from "@mantine/core";

const filter = {};
let runpparg,
  userDetails,
  isDemoMode = false;

// The single @gff/core seam, replaced by its manual mock. This test names no
// @gff/core export, so GFF changes to @gff/core cannot break it.
jest.mock("./coreAdapter");

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

const theme = {
  colors: {
    primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
} as const;

test("Correlation plot arguments", () => {
  const { unmount, rerender } = render(
    <MantineProvider theme={theme}>
      <CorrelationWrapper />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcCorrelation).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  isDemoMode = true;
  rerender(
    <MantineProvider theme={theme}>
      <CorrelationWrapper />
    </MantineProvider>,
  );
  // there should be only one runpp instance when switching to this tool,
  // so the arg key-values should not change on rerender
  expect(runpparg.filter0).toEqual(demoFilter);
  unmount();
});

test("Correlation demo filter0", () => {
  isDemoMode = true;
  const { unmount } = render(
    <MantineProvider theme={theme}>
      <CorrelationWrapper />
    </MantineProvider>,
  );
  expect(runpparg.filter0).not.toEqual(filter);
  unmount();
});
