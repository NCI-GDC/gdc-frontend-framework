import { render } from "@testing-library/react";
import * as core from "@gff/core";
import NumericRangeFacet from "./NumericRangeFacet";
import { EnumFacetResponse } from "@/features/facets/types";

describe("<NumericRangeFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("test if NumericRangeFacet control has expected components", async () => {
    const { getByRole, getByText } = render(
      <NumericRangeFacet
        field="cases.diagnoses.age_at_diagnosis"
        width="w-1/3"
        rangeDatatype="age"
        valueLabel="Cases"
        hooks={{
          useGetFacetData: jest.fn((): EnumFacetResponse => {
            return {
              data: {
                "-32872.5--29220.0": 0,
                "-29220.0--25567.5": 0,
                "-25567.5--21915.0": 0,
                "-21915.0--18262.5": 0,
                "-18262.5--14610.0": 0,
                "-14610.0--10957.5": 0,
                "-10957.5--7305.0": 0,
                "-7305.0--3652.5": 0,
                "-3652.5-0.0": 0,
                "0.0-3652.5": 4109,
                "3652.5-7305.0": 2107,
                "7305.0-10957.5": 973,
                "10957.5-14610.0": 2259,
                "14610.0-18262.5": 4726,
                "18262.5-21915.0": 8569,
                "21915.0-25567.5": 9601,
                "25567.5-29220.0": 5744,
                "29220.0-32872.5": 1468,
                "32872.5-36525.0": 0,
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
        }}
      />,
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
    expect(getByText("≥ 0.0 to < 10.0 years")).toBeInTheDocument();
    expect(getByText("4,109 (100.00%)")).toBeInTheDocument();
  });
});
