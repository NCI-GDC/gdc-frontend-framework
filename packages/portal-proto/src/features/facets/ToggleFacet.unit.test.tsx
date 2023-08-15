import { render } from "@testing-library/react";
import ToggleFacet from "./ToggleFacet";
import { EnumFacetResponse } from "@/features/facets/types";

describe("<ToggleFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("test if ToggleFacet control has expected components", async () => {
    const { getByRole, getByText } = render(
      <ToggleFacet
        valueLabel="Cases"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        hooks={{
          useGetFacetData: jest.fn((): EnumFacetResponse => {
            return {
              data: {},
              isSuccess: true,
              enumFilters: undefined,
              isUninitialized: false,
              isError: false,
              isFetching: false,
            };
          }),
          useUpdateFacetFilters: jest.fn(),
          useClearFilter: jest.fn(),
          useTotalCounts: jest.fn(),
        }}
      />,
    );

    const ctrl = getByRole("checkbox", {
      name: "toggle facet value",
    });

    expect(ctrl).toBeInTheDocument();
    expect(ctrl).not.toBeChecked();

    expect(getByText("No data for this field")).toBeInTheDocument();
  });

  it("test when ToggleFacet control has data", async () => {
    const { getByRole, getByText } = render(
      <ToggleFacet
        valueLabel="Cases"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        hooks={{
          useGetFacetData: jest.fn((): EnumFacetResponse => {
            return {
              data: { "1": 21734 },
              isSuccess: true,
              enumFilters: ["true"],
              isUninitialized: false,
              isError: false,
              isFetching: false,
            };
          }),
          useUpdateFacetFilters: jest.fn(),
          useClearFilter: jest.fn(),
          useTotalCounts: jest.fn(),
        }}
      />,
    );

    const ctrl = getByRole("checkbox", {
      name: "toggle facet value",
    });

    expect(ctrl).toBeInTheDocument();
    expect(ctrl).toBeChecked();

    expect(getByText("21,734")).toBeInTheDocument();
  });
});
