import React from "react";
import { render, waitFor } from "@testing-library/react";
import QueryExpressionSection from "./QueryExpressionSection";

const hooks = {
  useSelectCurrentCohort: jest.fn().mockReturnValue({}),
  useClearCohortFilters: jest.fn(),
  useRemoveCohortFilter: jest.fn(),
  useUpdateCohortFilter: jest.fn(),
  useFieldNameToTitle: jest.fn().mockReturnValue(jest.fn()),
  useFormatValue: jest
    .fn()
    .mockReturnValue(jest.fn().mockImplementation((f) => Promise.resolve(f))),
};

describe("<QueryExpressionSection />", () => {
  it("Cohort with no filters shows empty message", async () => {
    const { getByText, getByRole } = render(
      <QueryExpressionSection
        filters={{ mode: "and", root: {} }}
        hooks={hooks}
      />,
    );

    await waitFor(() =>
      expect(getByText("No filters currently applied.")).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(getByRole("button", { name: "Clear All" })).toBeDisabled(),
    );
    await waitFor(() =>
      expect(
        getByRole("button", { name: "Expand/collapse all queries" }),
      ).toBeDisabled(),
    );
    await waitFor(() =>
      expect(
        getByRole("button", { name: "Expand/collapse filters section" }),
      ).toBeDisabled(),
    );
  });

  it("Cohort with filters shows cohort name and controls", async () => {
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
        hooks={hooks}
      />,
    );

    await waitFor(() => expect(getByText("pancreas")).toBeInTheDocument());
    await waitFor(() =>
      expect(getByRole("button", { name: "Clear All" })).not.toBeDisabled(),
    );
    await waitFor(() =>
      expect(
        getByRole("button", { name: "Expand/collapse all queries" }),
      ).not.toBeDisabled(),
    );
  });
});
