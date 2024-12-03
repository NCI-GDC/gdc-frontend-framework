import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import { FacetTabs } from "../FacetTabs";
import * as hooks from "@/features/facets/hooks";
import { NextRouter, useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useFacetDictionary: jest.fn().mockReturnValue({
    isUninitialized: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
  }),
  selectFacetDefinition: jest.fn().mockReturnValue({ data: {} }),
  selectFacetDefinitionsByName: jest.fn().mockReturnValue([]),
  selectCohortBuilderConfig: jest.fn().mockReturnValue({
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
  } as any),
}));

describe("<FacetTabs />", () => {
  it("No custom facets", async () => {
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
