import { render } from "test-utils";
import { getExpectedFilter0 } from "./ppTestHelpers";
import { IDCViewerWrapperPP } from "./IDCViewerWrapperPP";

let runpparg;

const expectedFilter0 = getExpectedFilter0();

jest.mock("@gff/core", () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./ppTestHelpers").mockGffCore({
    PROTEINPAINT_API: "protocol://host:port/basepath",
    GDC_API: "protocol://host/basepath",
  }),
);

jest.mock("@/hooks/useIsDemoApp");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("IDCViewerWrapperPP arguments", () => {
  render(<IDCViewerWrapperPP />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchIdc).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(typeof runpparg.GDC_API).toEqual("string");
});
