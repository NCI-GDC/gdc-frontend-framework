import React from "react";
import { render } from "@testing-library/react";
import ToggleFacet from "../ToggleFacet";
import { MantineProvider } from "@mantine/core";

describe("<ToggleFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("test if ToggleFacet control has expected components", async () => {
    const { getByText, getByTestId } = render(
      <MantineProvider>
        <ToggleFacet
          valueLabel="Cases"
          field="gene.is_cancer_gene_census"
          hooks={{
            useGetEnumFacetData: jest.fn(() => {
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
            useFieldNameToTitle: jest.fn(),
            useGetFacetFilters: jest.fn(),
          }}
          facetName="Is Cancer Gene Census"
        />
        ,
      </MantineProvider>,
    );

    const ctrl = getByTestId("toggle-facet-value");

    expect(ctrl).toBeInTheDocument();
    expect(ctrl).not.toBeChecked();

    expect(getByText("No data for this field")).toBeInTheDocument();
  });

  it("test when ToggleFacet control has data", async () => {
    const { getByTestId, getByText } = render(
      <MantineProvider>
        <ToggleFacet
          valueLabel="Cases"
          field="gene.is_cancer_gene_census"
          hooks={{
            useGetEnumFacetData: jest.fn(() => {
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
            useFieldNameToTitle: jest.fn().mockReturnValue(jest.fn()),
            useGetFacetFilters: jest.fn().mockReturnValue({
              field: "genes.is_cancer_gene_census",
              operands: ["true"],
              operator: "includes",
            }),
          }}
          facetName="Is Cancer Gene Census"
        />
        ,
      </MantineProvider>,
    );

    const ctrl = getByTestId("toggle-facet-value");

    expect(ctrl).toBeInTheDocument();
    expect(ctrl).toBeChecked();

    expect(getByText("21,734")).toBeInTheDocument();
  });
});
