import { render } from "test-utils";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { getExpectedFilter0, getRunppArg } from "./ppTestHelpers";
import { CohortLevelMafWrapper } from "./CohortLevelMafWrapper";

const expectedFilter0 = getExpectedFilter0();

jest.mock("@gff/core", () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./ppTestHelpers").mockGffCore(),
);

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async () => ({})),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("Cohort Level MAF UI", async () => {
  render(<CohortLevelMafWrapper />);
  const runpparg = await getRunppArg(jest.mocked(runproteinpaint));
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMaf).toEqual(true);
  expect(runpparg.filter0).toEqual(expectedFilter0);
});
