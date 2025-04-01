import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExactValueFacet from "../ExactValueFacet";
import { Operation } from "@/cohort/QueryExpression/types";
import { MantineProvider } from "@mantine/core";

describe("<ExactValueFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("test if ExactValueFacet control has expected components", async () => {
    const { getByRole, getByTestId } = render(
      <MantineProvider>
        <ExactValueFacet
          field="cases.diagnoses.annotations.case_id"
          hooks={
            {
              useGetFacetFilters: jest.fn(),
              useUpdateFacetFilters: jest.fn(),
              useClearFilter: jest.fn(),
            } as any
          }
          facetName="Case ID"
        />
        ,
      </MantineProvider>,
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
    let values: Operation | undefined = undefined;
    const { getByRole, getByLabelText, getByText } = render(
      <MantineProvider>
        <ExactValueFacet
          field="cases.diagnoses.annotations.case_id"
          hooks={
            {
              useClearFilter: jest.fn(),
              useGetFacetFilters: jest.fn(() => values),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              useUpdateFacetFilters: jest.fn(
                () => (_1: string, _2: Operation) => {
                  values = {
                    operator: "includes",
                    field: "cases.diagnoses.annotations.case_id",
                    operands: ["case_id_1000"],
                  };
                },
              ),
            } as any
          }
          facetName="Case ID"
        />
        ,
      </MantineProvider>,
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
