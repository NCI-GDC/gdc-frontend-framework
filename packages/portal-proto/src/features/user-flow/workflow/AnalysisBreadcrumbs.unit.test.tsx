import { render } from "@testing-library/react";
import { SelectionScreenContext } from "./AnalysisWorkspace";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";

describe("<AnalysisBreadcrumb />", () => {
  it("Apps without selection only displays name", () => {
    const { queryByText } = render(
      <SelectionScreenContext.Provider
        value={{
          app: "MutationFrequencyApp",
          setActiveApp: jest.fn(),
          selectionScreenOpen: false,
          setSelectionScreenOpen: jest.fn(),
        }}
      >
        <AnalysisBreadcrumbs />
      </SelectionScreenContext.Provider>,
    );

    expect(queryByText("Mutation Frequency")).toBeInTheDocument();
    expect(queryByText("Results")).not.toBeInTheDocument();
  });

  it("Demo apps only displays name", () => {
    const { queryByText } = render(
      <SelectionScreenContext.Provider
        value={{
          app: "CohortComparisonApp",
          setActiveApp: jest.fn(),
          selectionScreenOpen: false,
          setSelectionScreenOpen: jest.fn(),
        }}
      >
        <AnalysisBreadcrumbs onDemoApp={true} />
      </SelectionScreenContext.Provider>,
    );

    expect(queryByText("Cohort Comparison Demo")).toBeInTheDocument();
    expect(queryByText("Results")).not.toBeInTheDocument();
  });

  it("Displays selection crumb when cohort selection is open", () => {
    const { queryByText } = render(
      <SelectionScreenContext.Provider
        value={{
          app: "CohortComparisonApp",
          setActiveApp: jest.fn(),
          selectionScreenOpen: true,
          setSelectionScreenOpen: jest.fn(),
        }}
      >
        <AnalysisBreadcrumbs />
      </SelectionScreenContext.Provider>,
    );

    expect(queryByText("Cohort Comparison")).toBeInTheDocument();
    expect(queryByText("Selection")).toBeInTheDocument();
    expect(queryByText("Results")).not.toBeInTheDocument();
  });

  it("Displays results crumb when on an app with selection", () => {
    const { queryByText } = render(
      <SelectionScreenContext.Provider
        value={{
          app: "CohortComparisonApp",
          setActiveApp: jest.fn(),
          selectionScreenOpen: false,
          setSelectionScreenOpen: jest.fn(),
        }}
      >
        <AnalysisBreadcrumbs />
      </SelectionScreenContext.Provider>,
    );

    expect(queryByText("Cohort Comparison")).toBeInTheDocument();
    expect(queryByText("Selection")).toBeInTheDocument();
    expect(queryByText("Results")).toBeInTheDocument();
  });
});
