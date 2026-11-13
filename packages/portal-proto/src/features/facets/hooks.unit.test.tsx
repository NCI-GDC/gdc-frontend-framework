import { renderHook } from "@testing-library/react";
import {
  useCoreDispatch,
  useCurrentCohortFilters,
  selectCohortBuilderConfig,
  selectFacetDefinition,
} from "@gff/core";
import { useAllEnumFacets } from "./hooks";

let userAuthChangeCount = 0;

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useCoreSelector: jest.fn((selector) => selector({})),
  useCurrentCohortFilters: jest.fn(),
  selectCohortBuilderConfig: jest.fn(),
  selectFacetDefinition: jest.fn(),
}));

jest.mock("@/hooks/useUserAuthChangeCount", () => ({
  useUserAuthChangeCount: () => userAuthChangeCount,
}));

describe("useAllEnumFacets", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    userAuthChangeCount = 0;
    dispatch.mockClear();
    jest.mocked(useCoreDispatch).mockReturnValue(dispatch);
    jest
      .mocked(useCurrentCohortFilters)
      .mockReturnValue({ mode: "and", root: {} });
    jest.mocked(selectCohortBuilderConfig).mockReturnValue({
      general: {
        facets: ["cases.primary_site"],
        queryOptions: { docType: "cases", indexType: "explore" },
      },
    } as any);
    jest.mocked(selectFacetDefinition).mockReturnValue({
      data: {
        "cases.primary_site": {
          field: "cases.primary_site",
          facet_type: "enum",
        },
      },
    } as any);
  });

  test("refetches every tab's enum facets once when the user changes", () => {
    const { rerender } = renderHook(() => useAllEnumFacets());
    expect(dispatch).toHaveBeenCalledTimes(1);

    rerender();
    expect(dispatch).toHaveBeenCalledTimes(1);

    userAuthChangeCount = 1;
    rerender();
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
