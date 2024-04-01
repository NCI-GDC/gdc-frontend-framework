import { render } from "@testing-library/react";
import { CohortLevelMafWrapper } from "./CohortLevelMafWrapper";

let filter, runpparg, userDetails;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  selectCurrentCohortFilterSet: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  useFetchUserDetailsQuery: jest.fn(() => userDetails),
  PROTEINPAINT_API: "host:port/basepath",
}));

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("Cohort Level MAF UI", () => {
  userDetails = { data: { data: { username: "test" } } };
  filter = { test: 1 };
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
