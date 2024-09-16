import { render } from "@testing-library/react";
import { ScRNAseqWrapper } from "./ScRNAseqWrapper";
import { MantineProvider } from "@mantine/core";

const filter = {};
let runpparg,
  userDetails,
  isDemoMode = false;

const nullFunction = () => null;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
  useFetchUserDetailsQuery: jest.fn(() => userDetails),
  useCoreDispatch: jest.fn(() => nullFunction()),
  setActiveCohort: jest.fn(() => null),
  PROTEINPAINT_API: "host:port/basepath",
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

test("single cell RNAseq arguments", () => {
  userDetails = { data: { username: "test" } };
  const { unmount, rerender } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <ScRNAseqWrapper />
    </MantineProvider>,
  );
  expect(typeof runpparg).toBe("object");
  expect(runpparg.holder instanceof HTMLElement).toBe(true);
  expect(typeof runpparg.host).toBe("string");
  expect(runpparg.launchGdcScRNAseq).toEqual(true);
  expect(runpparg.filter0).toEqual(filter);
  expect(runpparg.noheader).toEqual(true);
  expect(runpparg.nobox).toEqual(true);
  expect(runpparg.hide_dsHandles).toEqual(true);

  unmount();
});
