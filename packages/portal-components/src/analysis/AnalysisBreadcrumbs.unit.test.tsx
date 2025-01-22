import React from "react";
import { render } from "@testing-library/react";
import { SelectionScreenContext } from "./context";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";

export const REGISTERED_APPS = [
  {
    name: "Mutation Frequency",
    href: {
      pathname: "/analysis_page",
      query: { app: "MutationFrequencyApp" },
    },
    icon: <></>,
    tags: ["variantAnalysis", "ssm"],
    hasDemo: true,
    id: "MutationFrequencyApp",
    countsField: "cnvOrSsmCaseCount",
    description:
      "Visualize most frequently mutated genes and somatic mutations.",
    noDataTooltip:
      "Current cohort does not have SSM or CNV data available for visualization.",
    optimizeRules: ["something == something"],
  },
  {
    name: "Cohort Comparison",
    href: {
      pathname: "/analysis_page",
      query: { app: "CohortComparisonApp" },
    },
    icon: <></>,
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    id: "CohortComparisonApp",
    countsField: "caseCount",
    description:
      "Display the survival analysis of your cohorts and compare characteristics such as gender, vital status and age at diagnosis.",
    noDataTooltip:
      "Current cohort does not have cases available for visualization.",
    selectionScreen: () => <></>,
  },
];

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
        <AnalysisBreadcrumbs
          rightComponent={null}
          onDemoApp={false}
          skipSelectionScreen={true}
          registeredApps={REGISTERED_APPS}
        />
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
        <AnalysisBreadcrumbs
          onDemoApp={true}
          rightComponent={null}
          skipSelectionScreen={true}
          registeredApps={REGISTERED_APPS}
        />
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
        <AnalysisBreadcrumbs
          onDemoApp={false}
          rightComponent={null}
          skipSelectionScreen={false}
          registeredApps={REGISTERED_APPS}
        />
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
        <AnalysisBreadcrumbs
          onDemoApp={false}
          rightComponent={null}
          skipSelectionScreen={false}
          registeredApps={REGISTERED_APPS}
        />
      </SelectionScreenContext.Provider>,
    );

    expect(queryByText("Cohort Comparison")).toBeInTheDocument();
    expect(queryByText("Selection")).toBeInTheDocument();
    expect(queryByText("Results")).toBeInTheDocument();
  });
});
