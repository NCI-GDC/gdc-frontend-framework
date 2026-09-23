import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { getExpectedFilter0 } from "./ppTestHelpers";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

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

test("CNV Segment arguments", () => {
  // test-utils render() wraps the component in the real CoreProvider + Mantine.
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(runpparg.allow2selectSamples).toEqual({
    buttonText: "Create Cohort",
    attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
    callback: runpparg.allow2selectSamples?.callback,
  });
  expect(runpparg.geneSearch4GDCmds3).toEqual({ hardcodeCnvOnly: true });
});

test("CNV Segment demo mode ignores the cohort filter", () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);
  expect(runpparg.filter0).toBeNull();
});
