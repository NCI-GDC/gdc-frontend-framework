import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleFacet from "./ToggleFacet";
import * as core from "@gff/core";

describe("<ToggleFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });
  it("test if ToggleFacet control has expected components", async () => {
    const { getByRole } = render(
      <ToggleFacet
        docType="cases"
        indexType="explore"
        field="gene.is_cancer_gene_census"
        width="w-1/3"
        getFacetData={jest.fn()}
        updateFacetEnumerations={jest.fn()}
        clearFilterFunc={jest.fn()}
      />,
    );

    expect(
      getByRole("button", {
        name: "remove the facet",
      }),
    ).toBeFalsy();

    expect(
      getByRole("button", {
        name: "toggle facet value",
      }),
    ).toBeInTheDocument();
  });
});
