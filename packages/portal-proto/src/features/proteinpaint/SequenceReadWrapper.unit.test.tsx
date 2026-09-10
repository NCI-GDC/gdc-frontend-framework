import { render } from "test-utils";
import { useFetchUserDetailsQuery } from "@gff/core";
import { SequenceReadWrapper } from "./SequenceReadWrapper";

let runpparg;

const cohortFilters = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["FM-AD"],
    },
  },
};
const expectedFilter0 = {
  op: "and",
  content: [
    {
      op: "in",
      content: { field: "cases.project.project_id", value: ["FM-AD"] },
    },
  ],
};

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  // this wrapper reads userDetails.data.data.username to gate its UI
  useFetchUserDetailsQuery: jest.fn(() => ({
    data: { data: { username: "test" } },
  })),
  PROTEINPAINT_API: "host:port/basepath",
  selectCurrentCohortFilters: jest.fn(() => cohortFilters),
}));

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  runproteinpaint: jest.fn(async (arg) => {
    runpparg = arg;
    return {};
  }),
}));

test("Sequence Read arguments - logged in", () => {
  const { container } = render(<SequenceReadWrapper />);
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
  expect(runpparg.filter0).toEqual(expectedFilter0);
  expect(container.querySelector(".sjpp-wrapper-alert-div")).toHaveStyle(
    `display: none`,
  );
  expect(container.querySelector(".sjpp-wrapper-root-div")).toHaveStyle(
    `display: block`,
  );
});

test("Sequence Read arguments - not logged in", () => {
  jest.mocked(useFetchUserDetailsQuery).mockReturnValue({
    data: { data: { username: null } },
  } as any);
  const { container } = render(<SequenceReadWrapper />);
  expect(container.querySelector(".sjpp-wrapper-alert-div")).toHaveStyle(
    `display: block`,
  );
  expect(container.querySelector(".sjpp-wrapper-root-div")).toHaveStyle(
    `display: none`,
  );
});
