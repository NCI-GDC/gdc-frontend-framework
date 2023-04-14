import { render } from "@testing-library/react";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";

describe("<AnalysisBreadcrumb />", () => {
  it("Apps without selection only displays name", () => {
    const { queryByText } = render(
      <AnalysisBreadcrumbs
        currentApp="MutationFrequencyApp"
        setActiveApp={jest.fn()}
        cohortSelectionOpen={false}
        setCohortSelectionOpen={jest.fn()}
      />,
    );

    expect(queryByText("Mutation Frequency")).toBeInTheDocument();
    expect(queryByText("Results")).not.toBeInTheDocument();
  });

  it("Demo apps only displays name", () => {
    const { queryByText } = render(
      <AnalysisBreadcrumbs
        currentApp="CohortComparisonApp"
        setActiveApp={jest.fn()}
        cohortSelectionOpen={false}
        setCohortSelectionOpen={jest.fn()}
        onDemoApp={true}
      />,
    );

    expect(queryByText("Cohort Comparison Demo")).toBeInTheDocument();
    expect(queryByText("Results")).not.toBeInTheDocument();
  });

  it("Displays selection crumb when cohort selection is open", () => {
    const { queryByText } = render(
      <AnalysisBreadcrumbs
        currentApp="CohortComparisonApp"
        setActiveApp={jest.fn()}
        cohortSelectionOpen={true}
        setCohortSelectionOpen={jest.fn()}
      />,
    );

    expect(queryByText("Cohort Comparison")).toBeInTheDocument();
    expect(queryByText("Selection")).toBeInTheDocument();
    expect(queryByText("Results")).not.toBeInTheDocument();
  });

  it("Displays results crumb when on an app with selection", () => {
    const { queryByText } = render(
      <AnalysisBreadcrumbs
        currentApp="CohortComparisonApp"
        setActiveApp={jest.fn()}
        cohortSelectionOpen={false}
        setCohortSelectionOpen={jest.fn()}
      />,
    );

    expect(queryByText("Cohort Comparison")).toBeInTheDocument();
    expect(queryByText("Selection")).toBeInTheDocument();
    expect(queryByText("Results")).toBeInTheDocument();
  });
});
