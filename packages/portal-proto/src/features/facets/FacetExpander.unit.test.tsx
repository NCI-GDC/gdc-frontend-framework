import React from "react";
import { render, waitFor } from "@testing-library/react";
import FacetExpander from "./FacetExpander";

const renderFacetExpander = (props) => {
  return render(<FacetExpander {...props} />);
};

describe("<FacetExpander />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders facet expander with remaining values unexpanded", () => {
    const { getByText, getByTestId } = renderFacetExpander({
      remainingValues: 2,
      isGroupExpanded: false,
      onShowChanges: jest.fn(),
    });
    expect(getByText("2 more")).toBeInTheDocument();
    expect(getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("renders facet expander with remaining values expanded", () => {
    const { getByText, getByTestId } = renderFacetExpander({
      remainingValues: 20,
      isGroupExpanded: true,
      onShowChanges: jest.fn(),
    });
    expect(getByText("show less")).toBeInTheDocument();
    expect(getByTestId("minus-icon")).toBeInTheDocument();
  });

  it("renders facet expander with no remaining values unexpanded", async () => {
    const { queryByText } = renderFacetExpander({
      remainingValues: -1,
      isGroupExpanded: false,
      onShowChanges: jest.fn(),
    });
    await waitFor(() => {
      const moreText = queryByText("more");
      expect(moreText).toBeNull();
    });
  });

  it("renders facet expander with no remaining values expanded", async () => {
    const { getByText, getByTestId } = renderFacetExpander({
      remainingValues: -1,
      isGroupExpanded: true,
      onShowChanges: jest.fn(),
    });
    expect(getByText("show less")).toBeInTheDocument();
    expect(getByTestId("minus-icon")).toBeInTheDocument();
  });
});
