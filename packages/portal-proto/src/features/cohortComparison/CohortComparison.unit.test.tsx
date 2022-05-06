import { render, fireEvent } from "@testing-library/react";
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
    useSurvivalPlot: jest
      .fn()
      .mockReturnValue({
        data: {
          survivalData: [{ donors: [{ id: "1" }] }],
          overallStats: { pValue: 0.5 },
        },
      }),
  };
});

describe("<CohortComparison />", () => {
  it("Cards show and hide", () => {
    const { getByLabelText, queryByRole } = render(
      <CohortComparison cohortNames={["Cohort 1", "Cohort 2"]} />,
    );
    expect(
      queryByRole("heading", { name: "Survival Analysis" }),
    ).toBeInTheDocument();
    fireEvent.click(getByLabelText("Survival"));
    expect(
      queryByRole("heading", { name: "Survival Analysis" }),
    ).not.toBeInTheDocument();

    // Card starts out hidden
    expect(queryByRole("heading", { name: "Race" })).not.toBeInTheDocument();
    fireEvent.click(getByLabelText("Race"));
    expect(queryByRole("heading", { name: "Race" })).toBeInTheDocument();
  });
});
