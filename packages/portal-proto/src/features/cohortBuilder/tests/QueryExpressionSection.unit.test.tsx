import { render } from "test-utils";
import * as core from "@gff/core";
import QueryExpressionSection from "../QueryExpressionSection";

jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
jest.spyOn(core, "useCoreSelector").mockImplementation(jest.fn());

describe("<QueryExpressionSection />", () => {
  it("Cohort with no filters shows empty message", () => {
    const { getByText, getByRole } = render(
      <QueryExpressionSection
        filters={{ mode: "and", root: {} }}
        currentCohortId={"1"}
        currentCohortName={"Not All GDC"}
      />,
    );
    expect(getByText("No filters currently applied.")).toBeInTheDocument();
    expect(getByRole("button", { name: "Clear All" })).toBeDisabled();
    expect(
      getByRole("button", { name: "Expand/collapse all queries" }),
    ).toBeDisabled();
    expect(
      getByRole("button", { name: "Expand/collapse filters section" }),
    ).toBeDisabled();
  });

  it("Cohort with filters shows cohort name and controls", () => {
    jest.spyOn(core, "useGeneSymbol").mockReturnValue({
      data: {},
      isError: false,
      isFetching: false,
      isUninitialized: false,
      isSuccess: true,
      error: undefined,
    });
    const { getByText, getByRole } = render(
      <QueryExpressionSection
        filters={{
          mode: "and",
          root: {
            "cases.primary_site": {
              field: "cases.primary_site",
              operands: ["pancreas"],
              operator: "includes",
            },
          },
        }}
        currentCohortId={"1"}
        currentCohortName={"Pancreas"}
      />,
    );

    expect(getByText("Pancreas")).toBeInTheDocument();
    expect(getByRole("button", { name: "Clear All" })).not.toBeDisabled();
    expect(
      getByRole("button", { name: "Expand/collapse all queries" }),
    ).not.toBeDisabled();
  });
});
