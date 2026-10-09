import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { getExpectedFilter0 } from "./ppTestHelpers";
import { CorrelationWrapper, demoFilter } from "./CorrelationWrapper";

let runpparg;

const expectedFilter0 = getExpectedFilter0();

jest.mock("@gff/core", () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./ppTestHelpers").mockGffCore(),
);

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async (arg) => {
    runpparg = Object.assign({}, arg.initArgs, arg.updateArgs || {});
    return { triggerAbort: jest.fn() };
  }),
}));

test("Correlation plot arguments", () => {
  render(<CorrelationWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcCorrelation).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
});

test("Correlation demo mode uses the demo filter", () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<CorrelationWrapper />);
  expect(runpparg.filter0).toEqual(demoFilter);
});
