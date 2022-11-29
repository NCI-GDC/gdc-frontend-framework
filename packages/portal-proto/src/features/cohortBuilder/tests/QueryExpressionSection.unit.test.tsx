import { render } from "@testing-library/react";
import * as core from "@gff/core";
import { DEFAULT_COHORT_ID } from "@gff/core";
import QueryExpressionSection from "../QueryExpressionSection";

jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
jest.spyOn(core, "useCoreSelector").mockImplementation(jest.fn());

describe("<QueryExpressionSection />", () => {
  it("Default cohort shows all cases message", () => {
    const { getByText } = render(
      <QueryExpressionSection
        filters={{ mode: "and", root: {} }}
        currentCohortId={DEFAULT_COHORT_ID}
        currentCohortName={"All GDC"}
      />,
    );

    expect(
      getByText("Currently viewing all cases in the GDC.", { exact: false }),
    ).toBeInTheDocument();
  });

  it("Non-default cohort with no filters shows empty message", () => {
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

  it("Non-default cohort with filters shows cohort name and controls", () => {
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
