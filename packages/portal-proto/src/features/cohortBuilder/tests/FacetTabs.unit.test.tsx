import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FacetTabs } from "../FacetTabs";
import * as core from "@gff/core";
import * as func from "@gff/core";
import * as hooks from "@/features/facets/hooks";

describe("<FacetTabs />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
    jest.spyOn(func, "useFacetDictionary").mockImplementation(jest.fn());
  });

  it("No custom facets", async () => {
    jest.spyOn(core, "useFacetDictionary").mockReturnValue({
      isUninitialized: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
    });
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
    jest.spyOn(hooks, "useEnumFacets").mockImplementation(jest.fn());

    const { queryByText } = render(<FacetTabs />);
    const customTab = queryByText("Custom");
    expect(customTab).toBeInTheDocument();
    await userEvent.click(customTab);
    expect(queryByText("Add Custom Facet")).toBeDefined();
  });
});
