import React from "react";
import { render, screen } from "@testing-library/react";
import FacetSortPanel from "./FacetSortPanel";

const renderFacetSortPanel = (props) => {
  return render(<FacetSortPanel {...props} />);
};

describe("<FacetSortPanel />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders facet sort panel with cases sorted alphabeticaly ascending", () => {
    const { getByText } = renderFacetSortPanel({
      sortType: { type: "alpha", direction: "asc" },
      valueLabel: "cases",
      setSort: jest.fn(),
      field: "cases",
    });
    expect(getByText("cases")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The cases names are now sorted alphabetically ascending",
      ),
    ).toNotBeNull();
  });

  it("renders facet sort panel with files sorted alphabetically descending", () => {
    const { getByText } = renderFacetSortPanel({
      sortType: { type: "alpha", direction: "desc" },
      valueLabel: "files",
      setSort: jest.fn(),
      field: "files",
    });
    expect(getByText("cases")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The files names are now sorted alphabetically descending",
      ),
    ).toNotBeNull();
  });

  it("renders facet sort panel with cases sorted numerically ascending", () => {
    const { getByText } = renderFacetSortPanel({
      sortType: { type: "value", direction: "asc" },
      valueLabel: "cases",
      setSort: jest.fn(),
      field: "cases",
    });
    expect(getByText("cases")).toBeInTheDocument();
    expect(
      screen.getByText("The cases names are now sorted numerically ascending"),
    ).toNotBeNull();
  });

  it("renders facet sort panel with cases sorted ascending", () => {
    const { getByText } = renderFacetSortPanel({
      sortType: { type: "value", direction: "desc" },
      valueLabel: "files",
      setSort: jest.fn(),
      field: "files",
    });
    expect(getByText("files")).toBeInTheDocument();
    expect(
      screen.getByText("The files names are now sorted numerically descending"),
    ).toNotBeNull();
  });
});
