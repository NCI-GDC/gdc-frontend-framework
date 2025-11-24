import React from "react";
import { render, waitFor } from "@testing-library/react";
import QueryExpressionSection from "./QueryExpressionSection";

const hooks = {
  useSelectCurrentCohort: jest
    .fn()
    .mockReturnValue({ nonexistent_fields: ["cases.primary_site"] }),
  useSelectDisplayCohortWarning: jest.fn(),
  useDismissWarning: jest.fn(),
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
        warningText="oh no!"
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
        warningText="oh no!"
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

  it("Display warning banner", () => {
    const { queryByText, rerender } = render(
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
        warningText="oh no!"
      />,
    );

    expect(queryByText("oh no!")).not.toBeInTheDocument();

    const hooksWithWarning = {
      ...hooks,
      useSelectDisplayCohortWarning: jest.fn().mockReturnValue(true),
    };

    rerender(
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
        hooks={hooksWithWarning}
        warningText="oh no!"
      />,
    );

    expect(queryByText("oh no!")).toBeInTheDocument();
  });

  it("Hide dismissed warning banner", () => {
    const hooksWithWarning = {
      ...hooks,
      useSelectDisplayCohortWarning: jest.fn().mockReturnValue(false),
    };

    const { queryByText } = render(
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
        hooks={hooksWithWarning}
        warningText="oh no!"
      />,
    );

    expect(queryByText("oh no!")).not.toBeInTheDocument();
  });

  it("Hide banner if warning fields are not in filters", () => {
    const hooksWithWarning = {
      ...hooks,
      useSelectDisplayCohortWarning: jest.fn().mockReturnValue(true),
    };

    const { queryByText } = render(
      <QueryExpressionSection
        filters={{
          mode: "and",
          root: {
            "cases.project.program.name": {
              field: "cases.project.program.name",
              operands: ["APOLLO"],
              operator: "includes",
            },
          },
        }}
        hooks={hooksWithWarning}
        warningText="oh no!"
      />,
    );

    expect(queryByText("oh no!")).not.toBeInTheDocument();
  });
});
