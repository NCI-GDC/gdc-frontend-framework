import { render } from "@testing-library/react";
import { SequenceReadWrapper } from "./SequenceReadWrapper";

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

test("Sequence Read arguments - logged in", () => {
  userDetails = { data: { data: { username: "test" } } };
  filter = { test: 1 };
  const { unmount, container } = render(<SequenceReadWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.gdcbamslice).toEqual({
    hideTokenInput: true,
    stream2download: false,
  });
  expect(runpparg.filter0).toEqual({ test: 1 });
  expect(container.querySelector(".sjpp-wrapper-alert-div")).toHaveStyle(
    `display: none`,
  );
  expect(container.querySelector(".sjpp-wrapper-root-div")).toHaveStyle(
    `display: block`,
  );
  unmount();
});

// make this the last test so that userDetails
test("Sequence Read arguments - not logged in", () => {
  userDetails = { data: { data: { username: null } } };
  filter = { test: 1 };
  const { unmount, container } = render(<SequenceReadWrapper />);
  expect(container.querySelector(".sjpp-wrapper-alert-div")).toHaveStyle(
    `display: block`,
  );
  expect(container.querySelector(".sjpp-wrapper-root-div")).toHaveStyle(
    `display: none`,
  );
  unmount();
});
