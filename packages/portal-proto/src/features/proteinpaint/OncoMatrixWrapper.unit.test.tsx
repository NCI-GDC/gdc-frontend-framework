import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { bindProteinPaint } from "@sjcrh/proteinpaint-client";
import { getExpectedFilter0, getRunppArg } from "./ppTestHelpers";
import { MatrixWrapper, demoFilter } from "./MatrixWrapper";

const expectedFilter0 = getExpectedFilter0();

jest.mock("@gff/core", () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./ppTestHelpers").mockGffCore(),
);

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async () => ({ triggerAbort: jest.fn() })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useIsDemoApp).mockReturnValue(false);
});

test("OncoMatrix arguments", async () => {
  render(<MatrixWrapper chartType="matrix" />);
  const runpparg = await getRunppArg(jest.mocked(bindProteinPaint));
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMatrix).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
});

test("OncoMatrix demo mode uses the demo filter", async () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<MatrixWrapper chartType="matrix" />);
  const runpparg = await getRunppArg(jest.mocked(bindProteinPaint));
  expect(runpparg.filter0).toEqual(demoFilter);
});
