import { render } from "test-utils";
import ToggleFacet from "../ToggleFacet";
import { EnumFacetResponse } from "@/features/facets/types";

describe("<ToggleFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("test if ToggleFacet control has expected components", async () => {
    const { getByText, getByTestId } = render(
      <ToggleFacet
        valueLabel="Cases"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        hooks={{
          useGetEnumFacetData: jest.fn((): EnumFacetResponse => {
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

    const ctrl = getByTestId("toggle-facet-value");

    expect(ctrl).toBeInTheDocument();
    expect(ctrl).not.toBeChecked();

    expect(getByText("No data for this field")).toBeInTheDocument();
  });

  it("test when ToggleFacet control has data", async () => {
    const { getByTestId, getByText } = render(
      <ToggleFacet
        valueLabel="Cases"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        hooks={{
          useGetEnumFacetData: jest.fn((): EnumFacetResponse => {
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

    const ctrl = getByTestId("toggle-facet-value");

    expect(ctrl).toBeInTheDocument();
    expect(ctrl).toBeChecked();

    expect(getByText("21,734")).toBeInTheDocument();
  });
});
