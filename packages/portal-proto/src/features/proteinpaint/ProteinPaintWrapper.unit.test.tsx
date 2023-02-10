import { render } from "@testing-library/react";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

let filter, runpparg, userDetails;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  selectCurrentCohortFilterSet: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  useUserDetails: jest.fn(() => userDetails),
  useCoreDispatch: jest.fn(() => {}),
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
  const { unmount } = render(<ProteinPaintWrapper />);
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.genome).toEqual("hg38");
  expect(runpparg.tracks).toEqual([
    {
      type: "mds3",
      dslabel: "GDC",
      filter0: { abc: "xyz" },
      allow2selectSamples: {
        buttonText: "Create Cohort",
        attributes: ["case.case_id"],
        callback: runpparg.tracks[0]?.allow2selectSamples?.callback,
      },
    },
  ]);
  expect(runpparg.geneSearch4GDCmds3).toEqual(true);
  unmount();
});
