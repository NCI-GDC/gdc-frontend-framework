import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExactValueFacet from "./ExactValueFacet";
import * as core from "@gff/core";

describe("<ExactValueFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("test if ExactValueFacet control has expected components", async () => {
    const { getByRole, getByTestId } = render(
      <ExactValueFacet
        docType="files"
        field="cases.diagnoses.annotations.case_id"
        width="w-1/3"
        getFacetValue={jest.fn()}
        setFacetValue={jest.fn()}
        clearFilterFunc={jest.fn()}
      />,
    );

    expect(
      getByRole("textbox", {
        name: "enter value to add filter",
      }),
    ).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "add string value",
      }),
    ).toBeInTheDocument();

    expect(getByTestId("values group")).toBeInTheDocument();
  });

  it("add a value with ExactValueFacet control", async () => {
    let values = undefined;
    const { getByRole, getByLabelText, getByText } = render(
      <ExactValueFacet
        docType="files"
        field="cases.diagnoses.annotations.case_id"
        width="w-1/3"
        getFacetValue={jest.fn(() => values)}
        setFacetValue={jest.fn(() => {
          values = {
            operator: "includes",
            field: "cases.diagnoses.annotations.case_id",
            operands: ["case_id_1000"],
          };
        })}
        clearFilterFunc={jest.fn()}
      />,
    );

    const input = getByLabelText("enter value to add filter");
    await userEvent.clear(input);
    await userEvent.type(input, "case_id_1000");
    await userEvent.click(
      getByRole("button", {
        name: "add string value",
      }),
    );

    expect(getByText("case_id_1000")).toBeInTheDocument();
  });
});
