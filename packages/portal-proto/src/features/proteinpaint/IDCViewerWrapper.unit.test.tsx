// Use non-hoisted, virtual mocks so Jest doesn't try to resolve/hoist or parse ESM-only modules
jest.doMock(
  "hyparquet-compressors",
  () => ({
    compressors: {}, // adjust shape as needed by the component during tests
  }),
  { virtual: true },
);

jest.doMock(
  "hyparquet",
  () => ({
    // provide the named export used by the component
    parquetReadObjects: async () => {
      // return an empty array (or shape expected by the component)
      return [];
    },
  }),
  { virtual: true },
);

// Provide a virtual mock for @gff/core so react-redux selectors inside the real package
// don't run and cause "store" undefined errors in the test environment.
// Export the minimal functions used by the component.
jest.doMock(
  "@gff/core",
  () => ({
    // API used by the component
    fetchGdcCases: async (/* args */) => {
      return { data: { hits: [] } };
    },
    // hooks used by the component
    useCurrentCohortFilters: () => undefined,
    useCurrentCohortCounts: () => undefined,
    // small helpers used by the component
    filterSetToOperation: (_fs: any) => undefined,
    convertFilterToGqlFilter: (op: any) => op,
    // placeholder types/values (not required at runtime but exported)
    GqlOperation: undefined,
    SortBy: undefined,
  }),
  { virtual: true },
);

import { render } from "@testing-library/react";
import IDCViewerWrapper from "./IDCViewerWrapper";
import { MantineProvider } from "@mantine/core";

test("IDCViewerWrapper render test", () => {
  const { unmount } = render(
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
  unmount();
});
