import React from "react";
import { render } from "@testing-library/react";
import NumericRangeFacet from "../NumericRangeFacet";
import { MantineProvider } from "@mantine/core";

describe("<NumericRangeFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("test if NumericRangeFacet control has expected components", async () => {
    const { getByRole, getByText } = render(
      <MantineProvider>
        <NumericRangeFacet
          field="cases.diagnoses.age_at_diagnosis"
          rangeDatatype="age"
          valueLabel="Cases"
          minimum={0}
          maximum={32873}
          facetName="Age at Diagnosis"
          hooks={{
            useGetRangeFacetData: jest.fn(() => {
              return {
                data: {
                  "0.0-3653.0": 4109,
                  "3653.0-7305.0": 2107,
                  "7305.0-10958.0": 973,
                  "10958.0-14610.0": 2259,
                  "14610.0-18263.0": 4726,
                  "18263.0-21915.0": 8569,
                  "21915.0-25568.0": 9601,
                  "25568.0-29220.0": 5744,
                  "29220.0-32873.0": 1468,
                },
                isSuccess: true,
                enumFilters: undefined,
                isUninitialized: false,
                isError: false,
                isFetching: false,
              };
            }),
            useGetFacetFilters: jest.fn(),
            useUpdateFacetFilters: jest.fn(),
            useClearFilter: jest.fn(),
            useTotalCounts: jest.fn(() => 4109),
            useFieldNameToTitle: jest.fn(),
          }}
        />
        ,
      </MantineProvider>,
    );

    expect(
      getByRole("radio", {
        name: "Days",
      }),
    ).toBeInTheDocument();

    expect(
      getByRole("radio", {
        name: "Years",
      }),
    ).toBeInTheDocument();

    expect(getByText("Age at Diagnosis")).toBeInTheDocument();
    expect(getByText("≥ 0 to < 10 years")).toBeInTheDocument();
    expect(getByText("4,109 (100.00%)")).toBeInTheDocument();
  });
});
