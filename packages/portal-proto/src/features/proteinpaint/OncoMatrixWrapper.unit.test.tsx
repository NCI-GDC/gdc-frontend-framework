import { render } from "@testing-library/react";
import { OncoMatrixWrapper } from "./OncoMatrixWrapper";

const filter = {};
let runpparg,
  userDetails,
  isDemoMode = false;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  selectCurrentCohortFilterSet: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  addNewCohortWithFilterAndMessage: jest.fn(() => null),
  useUserDetails: jest.fn(() => userDetails),
  useCoreDispatch: jest.fn(() => () => null),
  PROTEINPAINT_API: "host:port/basepath",
  useCreateCaseSetFromValuesMutation: jest.fn(() => [
    () => null,
    { isSuccess: true },
  ]),
}));

jest.mock("@/hooks/useIsDemoApp", () => ({
  useIsDemoApp: jest.fn(() => isDemoMode),
}));

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("OncoMatrix arguments", () => {
  const { unmount, rerender } = render(<OncoMatrixWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.launchGdcMatrix).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  isDemoMode = true;
  rerender(<OncoMatrixWrapper />);
  expect(runpparg.filter0).not.toEqual(filter);
  unmount();
});
