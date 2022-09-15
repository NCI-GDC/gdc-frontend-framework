import { render } from "@testing-library/react";
import ToggleFacet from "./ToggleFacet";
import * as core from "@gff/core";
import { EnumFacetResponse } from "@/features/facets/types";

describe("<ToggleFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });
  it("test if ToggleFacet control has expected components", async () => {
    const { getByRole, getByText } = render(
      <ToggleFacet
        docType="cases"
        indexType="explore"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        getFacetData={
          /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
          jest.fn((): EnumFacetResponse => {
            return {
              data: {},
              isSuccess: true,
              enumFilters: undefined,
              isUninitialized: false,
              isError: false,
              isFetching: false,
            };
          })
        }
        updateFacetEnumerations={jest.fn()}
        clearFilterFunc={jest.fn()}
      />,
    );

    expect(
      getByRole("button", {
        name: "clear selection",
      }),
    ).toBeInTheDocument();

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
        docType="cases"
        indexType="explore"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        getFacetData={jest.fn((): EnumFacetResponse => {
          return {
            data: { "1": 21734 },
            isSuccess: true,
            enumFilters: ["true"],
            isUninitialized: false,
            isError: false,
            isFetching: false,
          };
        })}
        updateFacetEnumerations={jest.fn()}
        clearFilterFunc={jest.fn()}
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
