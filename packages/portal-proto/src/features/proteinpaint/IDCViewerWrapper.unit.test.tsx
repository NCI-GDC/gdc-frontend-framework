import { render } from "@testing-library/react";
import * as coreAdapter from "./coreAdapter";
import { IDCViewerWrapperPP } from "./IDCViewerWrapperPP";
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
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
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

test("IDCViewerWrapperPP arguments", () => {
  const { unmount, rerender } = render(
    <MantineProvider theme={theme}>
      <IDCViewerWrapperPP />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchIdc).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  expect(typeof runpparg.GDC_API).toEqual("string");
  isDemoMode = true;
  rerender(
    <MantineProvider theme={theme}>
      <IDCViewerWrapperPP />
    </MantineProvider>,
  );
  // there should be only one runpp instance when switching to this tool,
  // so the arg key-values should not change on rerender
  // expect(runpparg.filter0).toEqual(demoFilter);
  unmount();
});
