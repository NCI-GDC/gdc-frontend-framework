import { render } from "test-utils";
import * as core from "@gff/core";
import NumericRangeFacet from "../NumericRangeFacet";
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
        minimum={0}
        maximum={32873}
        hooks={{
          useGetRangeFacetData: jest.fn((): EnumFacetResponse => {
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
    expect(getByText("≥ 0 to < 10 years")).toBeInTheDocument();
    expect(getByText("4,109 (100.00%)")).toBeInTheDocument();
  });
});
