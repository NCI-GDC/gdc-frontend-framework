import * as core from "@gff/core";
import { render } from "@testing-library/react";
import { createFacetCard } from "./CreateFacetCard";

const renderCreateFacetCard = (props) => {
  const { facet, valueLabel, dataFunctions, idPrefix } = props;
  return createFacetCard(
    facet,
    valueLabel,
    dataFunctions,
    idPrefix,
  ) as unknown as any;
};

describe("", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders createFacetCard with enum facet type", () => {
    const dataFunctions = {
      useGetEnumFacetData: jest.fn().mockReturnValue({
        "bronchus and lung": 12213,
        "hematopoietic and reticuloendothelial systems": 9594,
        breast: 9123,
        colon: 6920,
        "spinal cord, cranial nerves, and other parts of central nervous system": 3703,
        kidney: 3462,
        skin: 2889,
      }),
      useUpdateFacetFilters: jest.fn(),
      useGetFacetFilters: jest.fn(),
      useClearFilter: jest.fn(),
      useTotalCounts: jest.fn().mockReturnValue(874332),
    };
    jest.spyOn(core, "fieldNameToTitle").mockReturnValue("test title");

    const { getByText } = render(
      renderCreateFacetCard({
        facet: { facet_type: "enum" },
        valueLabel: "enumValue",
        dataFunctions: dataFunctions,
        idPrefix: "enumId",
      }),
    );
    //   expect(getByText("LLM")).toBeInTheDocument();
    expect(getByText("MLM")).toBeInTheDocument();
    expect(getByText("TCC")).toBeInTheDocument();
    expect(getByText("QWE")).toBeInTheDocument();
    expect(getByText("MJI")).toBeInTheDocument();
    expect(getByText("BREV")).toBeInTheDocument();
  });
});
