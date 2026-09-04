import { render } from "@testing-library/react";
import * as coreAdapter from "./coreAdapter";
import { ScRNAseqWrapper } from "./ScRNAseqWrapper";
import { MantineProvider } from "@mantine/core";

const filter = {};
let runpparg, userDetails;
let isDemoMode = false;

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

test("single cell RNAseq arguments", () => {
  userDetails = { data: { username: "test" } };
  const { unmount } = render(
    <MantineProvider theme={theme}>
      <ScRNAseqWrapper />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.launchGdcScApp).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);

  unmount();
});

test("single cell demo filter0", () => {
  isDemoMode = true;
  const { unmount } = render(
    <MantineProvider theme={theme}>
      <ScRNAseqWrapper />
    </MantineProvider>,
  );
  expect(runpparg.state?.plots?.[0]).toEqual({
    sample: "2409",
    chartType: "sc",
    experimentID: "9f155433-3c2e-4b67-a452-eb32f06c93f7",
    activeTab: 2,
  });
  unmount();
});
