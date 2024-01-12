import React from "react";
import { render } from "@testing-library/react";
import EnumFacet from "./EnumFacet";
import { EnumFacetResponse } from "./types";

const data1 = { TCGA: 20, CPTAC: 50, FM: 60 };
const data2 = { GENIE: 110, MMRF: 12, TARGET: 72 };
const data3 = { WCDT: 404, EXCEPTIONAL_RESPONDERS: 50, CDDP_EAGLE: 88 };
const data4 = { OHSU: 1000, HCMI: 2, "BEATML1.0": 0 };

const renderEnumFacet = (props) => {
  return render(<EnumFacet {...props} />);
};

describe("<EnumFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders project enum facet", () => {
    const { getByText } = renderEnumFacet({
      field: "project",
      hooks: {
        useGetFacetData: jest.fn((): EnumFacetResponse => {
          return {
            data: { ...data1, ...data2, ...data3, ...data4 },
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
      },
      valueLabel: "enum label",
      description: "enum facet",
    });

    expect(getByText("OHSU")).toBeInTheDocument();
  });
});
