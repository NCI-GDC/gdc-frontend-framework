import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SummaryModalContext } from "src/pages/_app";
import {
  cohortDemo1 as mockDemo1,
  cohortDemo2 as mockDemo2,
} from "../apps/CohortComparisonApp";
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

describe("<CohortComparison />", () => {
  it("Cards show and hide", async () => {
    const { getByLabelText, queryByRole } = render(
      <SummaryModalContext.Provider
        value={{
          entityMetadata: {
            entity_type: null,
            entity_id: null,
            entity_name: null,
          },
          setEntityMetadata: jest.fn(),
        }}
      >
        <CohortComparison
          cohorts={{
            primary_cohort: mockDemo1,
            comparison_cohort: mockDemo2,
          }}
        />
      </SummaryModalContext.Provider>,
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
