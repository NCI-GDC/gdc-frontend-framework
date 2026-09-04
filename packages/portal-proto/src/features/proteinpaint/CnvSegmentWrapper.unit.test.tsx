import { render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import * as coreAdapter from "./coreAdapter";
import { ProteinPaintWrapper } from "./ProteinPaintWrapper";

const filter = { abc: "xyz" };
let runpparg,
  userDetails,
  isDemoMode = false;

// (1) The single @gff/core seam for the wrapper's OWN core imports.
jest.mock("./coreAdapter");

// (2) Out-of-dir code the wrapper renders that reaches @gff/core on its own.
jest.mock("@gff/portal-components", () => ({
  SaveCohortModal: () => null,
}));
jest.mock("../cohortBuilder/CohortManager/cohortActionHooks", () => ({
  cohortActionsHooks: {},
}));
jest.mock("../cohortBuilder/utils", () => ({
  INVALID_COHORT_NAMES: [],
}));

jest.mock("@/hooks/useIsDemoApp", () => ({
  useIsDemoApp: jest.fn(() => isDemoMode),
}));

jest.mock("@sjcrh/proteinpaint-client", () => ({
  __esModule: true,
  bindProteinPaint: jest.fn(async (arg) => {
    runpparg = Object.assign({}, arg.initArgs, arg.updateArgs || {});
    return {};
  }),
}));

const mockedCore = jest.mocked(coreAdapter);
mockedCore.buildCohortGqlOperator.mockImplementation(() => filter as any);
mockedCore.useFetchUserDetailsQuery.mockImplementation(() => userDetails);

const theme = {
  colors: {
    primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
} as const;

test("CNV Segment arguments", () => {
  userDetails = { data: { username: "test" } };
  const { unmount, rerender } = render(
    <MantineProvider theme={theme}>
      <ProteinPaintWrapper hardcodeCnvOnly={true} />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(runpparg.filter0).toEqual(filter);
  expect(runpparg.allow2selectSamples).toEqual({
    buttonText: "Create Cohort",
    attributes: [{ from: "sample_id", to: "cases.case_id", convert: true }],
    callback: runpparg.allow2selectSamples?.callback,
  });
  expect(runpparg.geneSearch4GDCmds3).toEqual({ hardcodeCnvOnly: true });
  isDemoMode = true;
  rerender(
    <MantineProvider theme={theme}>
      <ProteinPaintWrapper />
    </MantineProvider>,
  );
  expect(runpparg.filter0).not.toEqual(filter);
  unmount();
});
