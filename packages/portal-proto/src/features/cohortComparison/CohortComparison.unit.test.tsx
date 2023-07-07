import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import {
  cohortComparisonDemo1 as mockDemo1,
  cohortComparisonDemo2 as mockDemo2,
} from "../apps/CohortComparisonApp";
import CohortComparison from "./CohortComparison";

jest.mock("@gff/core", () => {
  const original = jest.requireActual("@gff/core");
  return {
    ...original,
    useCohortFacetsQuery: jest.fn().mockReturnValue({
      data: { aggregations: [], caseCounts: [] },
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
    useCreateCaseSetFromFiltersMutation: jest
      .fn()
      .mockReturnValue([jest.fn(), { isLoading: false, isUnitialized: false }]),
  };
});

describe("<CohortComparison />", () => {
  it("Cards show and hide", async () => {
    const { getByLabelText, queryByRole } = render(
      <CohortComparison
        cohorts={{
          primary_cohort: mockDemo1,
          comparison_cohort: mockDemo2,
        }}
        demoMode={false}
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
