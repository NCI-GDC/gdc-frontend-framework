import { render } from "@testing-library/react";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

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

test("SSM lolliplot arguments", () => {
  userDetails = { data: { username: "test" } };
  filter = { abc: "xyz" };
  const { unmount } = render(<ProteinPaintWrapper track="lollipop" />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.genome).toEqual("hg38");
  expect(runpparg.tracks).toEqual([
    { type: "mds3", dslabel: "GDC", filter0: { abc: "xyz" } },
  ]);
  expect(runpparg.geneSearch4GDCmds3).toEqual(true);
  unmount();
});

test("Sequence Read arguments - logged in", () => {
  userDetails = { data: { username: "test" } };
  filter = { test: 1 };
  const { unmount, queryByText } = render(<ProteinPaintWrapper track="bam" />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.gdcbamslice).toEqual({ hideTokenInput: true });
  expect(runpparg.filter0).toEqual({ test: 1 });
  expect(queryByText("Access alert")).not.toBeInTheDocument();
  unmount();
});

// make this the last test so that userDetails
test("Sequence Read arguments - not logged in", () => {
  userDetails = { data: { username: null } };
  filter = { test: 1 };
  const { unmount, queryByText } = render(<ProteinPaintWrapper track="bam" />);
  expect(queryByText("Access alert")).toBeInTheDocument();
  unmount();
});
