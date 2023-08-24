import React from "react";
import ExpandRowComponent from "../ExpandRowComponent";
import { render } from "test-utils";

describe("ExpandRowComponent", () => {
  it("renders the single item when value is an array with a single element and row is expanded", () => {
    const { getByText } = render(
      <ExpandRowComponent
        isRowExpanded={true}
        value={["Item 1"]}
        title="Items"
      />,
    );
    expect(getByText("Item 1")).toBeInTheDocument();
  });

  it("renders the item count and title when value is an array with multiple elements and row is expanded", () => {
    const { getByText } = render(
      <ExpandRowComponent
        isRowExpanded={true}
        value={["Item 1", "Item 2", "Item 3"]}
        title="Items"
      />,
    );
    expect(getByText("3 Items")).toBeInTheDocument();
  });

  it("renders '--' when value is an empty array and row is not expanded", () => {
    const { getByText } = render(
      <ExpandRowComponent isRowExpanded={false} value={[]} title="Items" />,
    );
    expect(getByText("--")).toBeInTheDocument();
  });

  it("renders the single item when value is an array with a single element and row is not expanded", () => {
    const { getByText } = render(
      <ExpandRowComponent
        isRowExpanded={false}
        value={["Item 1"]}
        title="Items"
      />,
    );
    expect(getByText("Item 1")).toBeInTheDocument();
  });

  it("renders the item count and title when value is an array with multiple elements and row is not expanded", () => {
    const { getByText } = render(
      <ExpandRowComponent
        isRowExpanded={false}
        value={["Item 1", "Item 2", "Item 3"]}
        title="Items"
      />,
    );
    expect(getByText("3 Items")).toBeInTheDocument();
  });

  it("renders the up icon when row and column are expanded", () => {
    const { getByTestId } = render(
      <ExpandRowComponent
        isRowExpanded={true}
        value={["Item 1", "Item 2", "Item 3"]}
        title="Items"
        isColumnExpanded={true}
      />,
    );
    expect(getByTestId("up-icon")).toBeInTheDocument();
  });

  it("renders the down icon when row is expanded and column is not expanded", () => {
    const { getByTestId } = render(
      <ExpandRowComponent
        isRowExpanded={true}
        value={["Item 1", "Item 2", "Item 3"]}
        title="Items"
        isColumnExpanded={false}
      />,
    );
    expect(getByTestId("down-icon")).toBeInTheDocument();
  });
});
