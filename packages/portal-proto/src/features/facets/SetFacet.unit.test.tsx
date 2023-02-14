import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";
import { CoreProvider } from "@gff/core";
import SetFacet from "./SetFacet";

jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
jest.spyOn(core, "useGeneSymbol").mockReturnValue({
  isSuccess: true,
  data: { E10: "TCGA", E40: "FAT3", E60: "FAT4" },
  isError: false,
  isFetching: false,
  isUninitialized: false,
  error: "",
});

describe("<QueryRepresentation />", () => {
  it("handles display of groups", () => {
    const { getByText } = render(
      <CoreProvider>
        <SetFacet
          field={"genes.gene_id"}
          hooks={{
            useGetFacetValues: jest
              .fn()
              .mockImplementation(() => ["E10", "E40", "E60"]),
            useClearFilter: jest.fn(),
            useRemoveFilterGroup: jest.fn(),
            useUpdateFacetFilters: jest.fn(),
            useFilterGroups: jest
              .fn()
              .mockImplementation(() => [
                { ids: ["E10", "E40"], field: "genes.gene_id" },
              ]),
            useClearGroups: jest.fn(),
          }}
          valueLabel=""
        />
      </CoreProvider>,
    );
    expect(getByText("2 input genes")).toBeInTheDocument();
    expect(getByText("FAT4")).toBeInTheDocument();
  });

  it("handles display of sets", () => {
    jest.spyOn(core, "selectSetsByType").mockImplementation(() => ({
      123: "my gene set",
    }));

    const { getByText } = render(
      <CoreProvider>
        <SetFacet
          field={"genes.gene_id"}
          hooks={{
            useGetFacetValues: jest
              .fn()
              .mockImplementation(() => ["set_id:123", "E60"]),
            useClearFilter: jest.fn(),
            useRemoveFilterGroup: jest.fn(),
            useUpdateFacetFilters: jest.fn(),
            useFilterGroups: jest.fn(),
            useClearGroups: jest.fn(),
          }}
          valueLabel=""
        />
      </CoreProvider>,
    );
    expect(getByText("my gene set")).toBeInTheDocument();
    expect(getByText("FAT4")).toBeInTheDocument();
  });

  it("removes group without removing individual filter", async () => {
    const mockUpdateFilter = jest.fn();

    const { getByText, getByTestId } = render(
      <CoreProvider>
        <SetFacet
          field={"genes.gene_id"}
          hooks={{
            useGetFacetValues: jest
              .fn()
              .mockImplementation(() => ["E10", "E40", "E60", "E40"]),
            useClearFilter: jest.fn(),
            useRemoveFilterGroup: jest.fn().mockImplementation(() => jest.fn()),
            useUpdateFacetFilters: jest
              .fn()
              .mockImplementation(() => mockUpdateFilter),
            useFilterGroups: jest
              .fn()
              .mockImplementation(() => [
                { ids: ["E10", "E40"], field: "genes.gene_id" },
              ]),
            useClearGroups: jest.fn(),
          }}
          valueLabel=""
        />
      </CoreProvider>,
    );

    expect(getByText("FAT3")).toBeInTheDocument();
    await userEvent.click(
      getByTestId("set-facet-genes.gene_id-2 input genes-0"),
    );

    expect(mockUpdateFilter).toBeCalledWith("genes.gene_id", {
      operator: "includes",
      field: "genes.gene_id",
      operands: ["E60", "E40"],
    });
  });
});
