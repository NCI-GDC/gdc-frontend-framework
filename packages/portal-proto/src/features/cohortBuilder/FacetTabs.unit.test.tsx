import { render, fireEvent } from "@testing-library/react";
import { FacetTabs } from "./FacetTabs";
import * as core from "@gff/core";
import * as func from "@gff/core";

describe("<FacetTabs />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("No custom facets", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      general: {
        label: "General",
        facets: ["cases.project.program.name", "cases.project.project_id"],
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

    const { getByLabelText, queryByRole } = render(<FacetTabs />);
  });
});
