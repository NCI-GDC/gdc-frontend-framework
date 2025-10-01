import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FacetTabs from "./FacetTabs";

describe("<FacetTabs />", () => {
  it("Renders custom facet tab", async () => {
    const { queryByText } = render(
      <FacetTabs
        customFacetHooks={{
          useCustomFacets: jest
            .fn()
            .mockReturnValue({ data: [], isSuccess: true }),
          useAvailableCustomFacets: jest.fn(),

          useAddCustomFilter: jest.fn(),
          useRemoveCustomFilter: jest.fn(),
        }}
        hooks={
          {
            useFieldNameToTitle: jest.fn(),
          } as any
        }
        tabsConfig={{
          custom: {
            facets: [],
            label: "Custom",
            queryOptions: {},
          },
          general: {
            facets: [],
            label: "General",
            queryOptions: {},
          },
        }}
        usedFacets={[]}
        getFacetLabel={jest.fn()}
        activeTab="custom"
        setActiveTab={jest.fn()}
        facetDefinitions={{}}
      />,
    );
    const customTab = queryByText("Custom");
    expect(customTab).toBeInTheDocument();
    if (customTab) {
      await userEvent.click(customTab);
    }
    expect(queryByText("Add Custom Facet")).toBeDefined();
  });

  it("Does not render tabbed view for only one facet section", () => {
    const { queryByText } = render(
      <FacetTabs
        customFacetHooks={{
          useCustomFacets: jest
            .fn()
            .mockReturnValue({ data: [], isSuccess: true }),
          useAvailableCustomFacets: jest.fn(),

          useAddCustomFilter: jest.fn(),
          useRemoveCustomFilter: jest.fn(),
        }}
        hooks={
          {
            useFieldNameToTitle: jest.fn(),
          } as any
        }
        usedFacets={[]}
        tabsConfig={{
          general: {
            facets: [],
            label: "General",
            queryOptions: {},
          },
        }}
        getFacetLabel={jest.fn()}
        activeTab="custom"
        setActiveTab={jest.fn()}
        facetDefinitions={{}}
      />,
    );
    const tab = queryByText("General");
    expect(tab).not.toBeInTheDocument();
  });
});
