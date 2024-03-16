import React from "react";
import * as core from "@gff/core";
import { render } from "@testing-library/react";
import SetFacet from "./SetFacet";

const data1 = { E10: "TCGA", E30: "CPTAC", E60: "FM" };
const data2 = { D20: "GENIE", D50: "MMRF", D70: "TARGET" };
const data3 = {
  F40: "WCDT",
  F80: "EXCEPTIONAL_RESPONDERS",
  F120: "CDDP_EAGLE",
};
const data4 = { G90: "OHSU", G110: "HCMI", G150: "BEATML1.0" };

const renderSetFacet = (props) => {
  return render(<SetFacet {...props} />);
};

describe("<SetFacet />", () => {
  beforeEach(() => {
    jest.spyOn(core, "useGeneSymbol").mockReturnValue({
      data: { ...data1, ...data2, ...data3, ...data4 },
      error: "",
      isUninitialized: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
    });
    jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValue({
        genes: { DS: "default set", FS: "future set", PS: "past set" },
      });
    jest.clearAllMocks();
  });

  it("renders set facet with 3 gene symbol props", () => {
    const { getByText } = renderSetFacet({
      field: "genes.gene_id",
      description: "gene set facet",
      hooks: {
        useClearFilter: jest.fn(),
        useUpdateFacetFilters: jest.fn(),
        useGetFacetValues: jest.fn(() => ["E10", "E30", "E60"]),
      },
    });
    Object.values(data1).forEach((key) => {
      expect(getByText(key)).toBeInTheDocument();
    });
  });
  it("renders set facet with 3 different gene symbol props", () => {
    const { getByText } = renderSetFacet({
      field: "genes.gene_id",
      description: "gene set facet",
      hooks: {
        useClearFilter: jest.fn(),
        useUpdateFacetFilters: jest.fn(),
        useGetFacetValues: jest.fn(() => ["D20", "D50", "D70"]),
      },
    });
    Object.values(data2).forEach((key) => {
      expect(getByText(key)).toBeInTheDocument();
    });
  });
  it("renders set facet with 6 gene symbols", () => {
    const { getByText } = renderSetFacet({
      field: "genes.gene_id",
      description: "gene set facet",
      hooks: {
        useClearFilter: jest.fn(),
        useUpdateFacetFilters: jest.fn(),
        useGetFacetValues: jest.fn(() => [
          "E10",
          "E30",
          "E60",
          "D20",
          "D50",
          "D70",
        ]),
      },
    });
    [...Object.values(data1), ...Object.values(data2)].forEach((key) => {
      expect(getByText(key)).toBeInTheDocument();
    });
  });

  it("renders set facet with greater than 6 gene symbols", () => {
    const { getByText } = renderSetFacet({
      field: "genes.gene_id",
      description: "gene set facet",
      hooks: {
        useClearFilter: jest.fn(),
        useUpdateFacetFilters: jest.fn(),
        useGetFacetValues: jest.fn(() => [
          "E10",
          "E30",
          "E60",
          "D20",
          "D50",
          "D70",
          "F40",
          "F80",
          "F120",
          "G90",
          "G110",
          "G150",
        ]),
      },
    });
    [
      ...Object.values(data1),
      ...Object.values(data2),
      ...Object.values(data3),
      ...Object.values(data4),
    ].forEach((key) => {
      expect(getByText(key)).toBeInTheDocument();
    });
  });
});
