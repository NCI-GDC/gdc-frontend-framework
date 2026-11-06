import { render } from "test-utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { bindProteinPaint } from "@sjcrh/proteinpaint-client";
import { getExpectedFilter0, getRunppArg } from "./ppTestHelpers";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

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

test("CNV Segment arguments", async () => {
  // test-utils render() wraps the component in the real CoreProvider + Mantine.
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);
  const runpparg = await getRunppArg(jest.mocked(bindProteinPaint));
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(runpparg.allow2selectSamples).toEqual({
    buttonText: "Create Cohort",
    attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
    callback: expect.any(Function),
  });
  expect(runpparg.geneSearch4GDCmds3).toEqual({ hardcodeCnvOnly: true });
});

test("CNV Segment demo mode ignores the cohort filter", async () => {
  jest.mocked(useIsDemoApp).mockReturnValue(true);
  render(<ProteinPaintWrapper hardcodeCnvOnly={true} />);
  const runpparg = await getRunppArg(jest.mocked(bindProteinPaint));
  expect(runpparg.filter0).toBeNull();
});
