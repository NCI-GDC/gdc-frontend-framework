import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { getExpectedFilter0 } from "./ppTestHelpers";
import { MatrixWrapper, demoFilter } from "./MatrixWrapper";

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

test("OncoMatrix arguments", () => {
  render(<MatrixWrapper chartType="matrix" />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMatrix).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
});

test("OncoMatrix demo mode uses the demo filter", () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<MatrixWrapper chartType="matrix" />);
  expect(runpparg.filter0).toEqual(demoFilter);
});
