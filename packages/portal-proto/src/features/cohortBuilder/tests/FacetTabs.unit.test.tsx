import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import { FacetTabs } from "../FacetTabs";
import * as core from "@gff/core";
import * as func from "@gff/core";
import * as hooks from "@/features/facets/hooks";
import { NextRouter, useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

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
    (useRouter as jest.Mock<NextRouter>).mockReturnValue({
      push: jest.fn(),
    } as any);
    const { queryByText } = render(<FacetTabs />);
    const customTab = queryByText("Custom");
    expect(customTab).toBeInTheDocument();
    await userEvent.click(customTab);
    expect(queryByText("Add Custom Facet")).toBeDefined();
  });
});
