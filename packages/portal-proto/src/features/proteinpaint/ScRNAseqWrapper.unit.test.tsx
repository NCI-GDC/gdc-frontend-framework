import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { getExpectedFilter0, getRunppArg } from "./ppTestHelpers";
import { ScRNAseqWrapper } from "./ScRNAseqWrapper";

const expectedFilter0 = getExpectedFilter0();

jest.mock("@gff/core", () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./ppTestHelpers").mockGffCore(),
);

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async () => ({})),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useIsDemoApp).mockReturnValue(false);
});

test("single cell RNAseq arguments", async () => {
  render(<ScRNAseqWrapper />);
  const runpparg = await getRunppArg(jest.mocked(runproteinpaint));
  expect(typeof runpparg).toBe("object");
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.launchGdcScApp).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
});

test("single cell demo filter0", async () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<ScRNAseqWrapper />);
  const runpparg = await getRunppArg(jest.mocked(runproteinpaint));
  expect(runpparg.state?.plots?.[0]).toEqual({
    sample: "2409",
    chartType: "sc",
    experimentID: "9f155433-3c2e-4b67-a452-eb32f06c93f7",
    activeTab: 2,
  });
});
