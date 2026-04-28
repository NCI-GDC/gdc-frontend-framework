import { render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import React from "react";

// mutable containers adjusted per-test
let parquetRows: any[] = [];
let gdcHits: any[] = [];

// module-level virtual mocks that read the mutable containers above
jest.mock(
  "hyparquet-compressors",
  () => ({
    compressors: {},
  }),
  { virtual: true },
);

jest.mock(
  "hyparquet",
  () => ({
    parquetReadObjects: async () => parquetRows,
  }),
  { virtual: true },
);

jest.mock(
  "@/features/cases/CasesView/utils",
  () => ({
    buildCasesTableSearchFilters: (_term?: string) => undefined,
  }),
  { virtual: true },
);

jest.mock(
  "@gff/core",
  () => ({
    useGetCasesQuery: (arg?: any, options?: { skip?: boolean }) => {
      if (options?.skip) {
        return { data: undefined, isLoading: false, isError: false };
      }
      return {
        data: { hits: gdcHits, pagination: {} },
        isLoading: false,
        isError: false,
      };
    },
    useCurrentCohortFilters: () => undefined,
    useCurrentCohortCounts: () => undefined,
    filterSetToOperation: (_fs: any) => undefined,
    convertFilterToGqlFilter: (op: any) => op,
    appendFilterToOperation: (a: any, b: any) => {
      if (!a) return b;
      if (!b) return a;
      return { operator: "and", operands: [a, b] };
    },
    GqlOperation: undefined,
    SortBy: undefined,
  }),
  { virtual: true },
);

// import component after mocks so mocks are used
import IDCViewerWrapper from "./IDCViewerWrapper";

beforeEach(() => {
  // reset test data and provide a harmless fetch implementation
  parquetRows = [];
  gdcHits = [];
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: async () => new ArrayBuffer(8),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

it("Render IDC table columns", async () => {
  // provide one parquet row and one matching GDC case
  parquetRows = [
    {
      PatientID: "CASE123",
      StudyInstanceUID: "STUDY1",
      StudyDate: "2020-01-01",
      StudyDescription: "Test study",
      study_type: "M",
      gdc_case_id: "CASE123",
    },
  ];
  gdcHits = [
    {
      submitter_id: "CASE123",
      project: { program: { name: "TestProgram" } },
      samples: [],
    },
  ];

  const { findByText } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <IDCViewerWrapper />
    </MantineProvider>,
  );

  const gdcCaseIDEl = await findByText("GDC Case ID");
  expect(gdcCaseIDEl).toBeInTheDocument();

  const programEl = await findByText("Program");
  expect(programEl).toBeInTheDocument();
});

it("shows no-idc message when no idc images for selected cohort", async () => {
  // leave parquetRows and gdcHits empty (handled by beforeEach)

  const { findByText } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <IDCViewerWrapper />
    </MantineProvider>,
  );

  const msg = await findByText("No idc images for selected cohort.");
  expect(msg).toBeInTheDocument();
});
