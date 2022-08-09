import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FacetTabs } from "./FacetTabs";
import * as core from "@gff/core";
import * as func from "@gff/core";

describe("<FacetTabs />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("No custom facets", async () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      general: {
        label: "General",
        facets: [],
        docType: "cases",
        index: "repository",
      },
      custom: {
        label: "Custom",
        facets: [],
        docType: "cases",
        index: "repository",
      },
    });

    const { queryByText } = render(<FacetTabs />);
    const customTab = queryByText("Custom");
    expect(customTab).toBeInTheDocument();
    await userEvent.click(customTab);
    expect(queryByText("Add Custom Facet")).toBeDefined();
  });
});
