import React from "react";
import { render } from "@testing-library/react";
import { SelectionScreenContext } from "./context";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";

export const REGISTERED_APPS = [
  {
    name: "Projects",
    href: {
      pathname: "/analysis_page",
      query: { app: "Projects" },
    },
    tags: [],
    hasDemo: false,
    id: "Projects",
    countsField: "caseCount",
  },
  {
    name: "My fake App",
    href: {
      pathname: "/analysis_page",
      query: { app: "fakeApp" },
    },
    hasDemo: true,
    id: "fakeApp",
    tags: [],
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
