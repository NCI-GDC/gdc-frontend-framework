import { FilterSet } from "@gff/core";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CohortComparison from "./CohortComparison";

jest.mock("@gff/core", () => {
  const original = jest.requireActual("@gff/core");
  return {
    ...original,
    useCohortFacets: jest.fn().mockReturnValue({
      data: { aggregations: [], caseCounts: [], caseIds: [] },
      isFetching: false,
      isUnitialized: false,
    }),
    useCoreSelector: jest.fn(),
    useVennIntersectionData: jest.fn(),
    useGetSurvivalPlotQuery: jest.fn().mockReturnValue({
      data: {
        survivalData: [{ donors: [{ id: "1" }] }],
        overallStats: { pValue: 0.5 },
      },
    }),
  };
});

const cohortDemo1: {
  filter: FilterSet;
  name: string;
} = {
  filter: {
    mode: "and",
    root: {
      "cases.project.project_id": {
        operator: "includes",
        field: "cases.project.project_id",
        operands: ["TCGA-LGG"],
      },
      "genes.gene_id": {
        field: "genes.gene_id",
        operator: "includes",
        operands: ["ENSG00000138413", "ENSG00000182054"],
      },
    },
  },
  name: "Low grade gliomas - IDH1 or IDH2 mutated",
};

const cohortDemo2: {
  filter: FilterSet;
  name: string;
} = {
  filter: {
    mode: "and",
    root: {
      "cases.project.project_id": {
        operator: "includes",
        field: "cases.project.project_id",
        operands: ["TCGA-LGG"],
      },
      "genes.gene_id": {
        field: "genes.gene_id",
        operator: "excludes",
        operands: ["ENSG00000138413", "ENSG00000182054"],
      },
      "cases.available_variation_data": {
        field: "cases.available_variation_data",
        operator: "includes",
        operands: ["ssm"],
      },
    },
  },
  name: "Low grade gliomas - IDH1 and IDH2 not mutated",
};

describe("<CohortComparison />", () => {
  it("Cards show and hide", async () => {
    const { getByLabelText, queryByRole } = render(
      <CohortComparison
        cohorts={{
          primary_cohort: cohortDemo1,
          comparison_cohort: cohortDemo2,
        }}
      />,
    );
    expect(
      queryByRole("heading", { name: "Survival Analysis" }),
    ).toBeInTheDocument();
    await userEvent.click(getByLabelText("Survival"));
    expect(
      queryByRole("heading", { name: "Survival Analysis" }),
    ).not.toBeInTheDocument();

    // Card starts out hidden
    expect(queryByRole("heading", { name: "Race" })).not.toBeInTheDocument();
    await userEvent.click(getByLabelText("Race"));
    expect(queryByRole("heading", { name: "Race" })).toBeInTheDocument();
  });
});
