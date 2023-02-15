import { render } from "@testing-library/react";
import { OncoMatrixWrapper } from "./OncoMatrixWrapper";

let filter, runpparg, userDetails;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  selectCurrentCohortFilterSet: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  useUserDetails: jest.fn(() => userDetails),
  PROTEINPAINT_API: "host:port/basepath",
}));

jest.mock("@stjude/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("OncoMatrix arguments", () => {
  const { unmount } = render(<OncoMatrixWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMatrix).toEqual(true);
  unmount();
});
