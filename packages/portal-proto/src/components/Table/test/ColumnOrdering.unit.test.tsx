import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColumnOrdering from "../ColumnOrdering";

describe("ColumnOrdering", () => {
  const mockTable = {
    initialState: {
      columnOrder: ["col1", "col2"],
      columnVisibility: { col1: true, col2: true },
    },
    getState: () => ({
      columnVisibility: { col1: true, col2: true },
    }),
    getAllLeafColumns: () => [
      {
        id: "col1",
        getIsVisible: jest.fn(),
        getToggleVisibilityHandler: jest.fn(),
      },
      {
        id: "col2",
        getIsVisible: jest.fn(),
        getToggleVisibilityHandler: jest.fn(),
      },
    ],
  } as any;

  const mockHandleColumnOrderingReset = jest.fn();

  const mockColumnOrder = ["col1", "col2"];

  const mockSetColumnOrder = jest.fn();

  it("should toggle column menu on button click", async () => {
    render(
      <ColumnOrdering
        table={mockTable}
        handleColumnOrderingReset={mockHandleColumnOrderingReset}
        columnOrder={mockColumnOrder}
        setColumnOrder={mockSetColumnOrder}
      />,
    );
    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);
    expect(
      screen.getByTestId("column-selector-popover-modal"),
    ).toBeInTheDocument();
  });

  it("should show and hide the column menu when button is clicked multiple times", async () => {
    render(
      <ColumnOrdering
        table={mockTable}
        handleColumnOrderingReset={mockHandleColumnOrderingReset}
        columnOrder={mockColumnOrder}
        setColumnOrder={mockSetColumnOrder}
      />,
    );
    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);
    expect(
      screen.getByTestId("column-selector-popover-modal"),
    ).toBeInTheDocument();

    await userEvent.click(button);
    expect(screen.queryByTestId("column-selector-popover-modal")).toBeNull();
  });

  it("should close column menu on outside click", async () => {
    render(
      <ColumnOrdering
        table={mockTable}
        handleColumnOrderingReset={mockHandleColumnOrderingReset}
        columnOrder={mockColumnOrder}
        setColumnOrder={mockSetColumnOrder}
      />,
    );
    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);

    expect(
      screen.getByTestId("column-selector-popover-modal"),
    ).toBeInTheDocument();
    await userEvent.click(document.body);

    expect(screen.queryByTestId("column-selector-popover-modal")).toBeNull();
  });

  it("should filter columns by search input", async () => {
    render(
      <ColumnOrdering
        table={mockTable}
        handleColumnOrderingReset={mockHandleColumnOrderingReset}
        columnOrder={mockColumnOrder}
        setColumnOrder={mockSetColumnOrder}
      />,
    );
    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);
    const searchInput = screen.getByTestId("textbox-column-selector");
    fireEvent.change(searchInput, { target: { value: "col1" } });
    expect(screen.getByTestId("column-selector-row-col1")).toBeInTheDocument();
    expect(
      screen.queryByTestId("column-selector-row-col2"),
    ).not.toBeInTheDocument();
  });

  it("should not reset search input when menu is opened", async () => {
    render(
      <ColumnOrdering
        table={mockTable}
        handleColumnOrderingReset={mockHandleColumnOrderingReset}
        columnOrder={mockColumnOrder}
        setColumnOrder={mockSetColumnOrder}
      />,
    );
    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);

    const searchInput = screen.getByTestId("textbox-column-selector");
    fireEvent.change(searchInput, { target: { value: "col1" } });

    await userEvent.click(button);
    await userEvent.click(button);

    const updatedSearchInput = screen.getByTestId("textbox-column-selector");
    expect(updatedSearchInput).toHaveValue("col1");
  });
});
