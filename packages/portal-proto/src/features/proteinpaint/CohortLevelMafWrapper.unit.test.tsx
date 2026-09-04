import { render } from "@testing-library/react";
import * as coreAdapter from "./coreAdapter";
import { CohortLevelMafWrapper } from "./CohortLevelMafWrapper";

let filter, runpparg, userDetails;

// Replace the single @gff/core seam with its manual mock. The real @gff/core
// barrel (and its Redux store) never loads, and this test names no @gff/core
// export — so GFF changes to @gff/core cannot break it.
jest.mock("./coreAdapter");

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

const mockedCore = jest.mocked(coreAdapter);

test("Cohort Level MAF UI", () => {
  userDetails = { data: { data: { username: "test" } } };
  filter = { test: 1 };
  mockedCore.buildCohortGqlOperator.mockReturnValue(filter);
  mockedCore.useFetchUserDetailsQuery.mockReturnValue(userDetails);

  const { unmount } = render(<CohortLevelMafWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMaf).toEqual(true);
  expect(runpparg.filter0).toEqual({ test: 1 });
  unmount();
});
