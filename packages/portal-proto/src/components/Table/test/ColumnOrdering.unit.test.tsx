import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import ColumnOrdering from "../ColumnOrdering";

describe("ColumnOrdering", () => {
  const mockGetToggleVisibilityCol1 = jest.fn();
  const mockTable = {
    initialState: {
      columnOrder: ["col1", "col2", "col3"],
      columnVisibility: { col1: true, col2: true, col3: true },
    },
    getState: () => ({
      columnVisibility: { col1: true, col2: true, col3: true },
    }),
    getAllLeafColumns: () => [
      {
        id: "col1",
        getIsVisible: jest.fn(),
        toggleVisibility: mockGetToggleVisibilityCol1,
      },
      {
        id: "col2",
        getIsVisible: jest.fn(),
        toggleVisibility: jest.fn(),
      },
      {
        id: "col3",
        getIsVisible: jest.fn(),
        toggleVisibility: jest.fn(),
      },
    ],
  } as any;

  const mockHandleColumnOrderingReset = jest.fn();

  const mockColumnOrder = ["col1", "col2", "col3"];

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
    await waitFor(() =>
      expect(screen.queryByTestId("column-selector-popover-modal")).toBeNull(),
    );
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

    await waitFor(() =>
      expect(screen.queryByTestId("column-selector-popover-modal")).toBeNull(),
    );
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
    await waitFor(() =>
      expect(screen.getByTestId("textbox-column-selector")).toBeDefined(),
    );
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
    await waitFor(() =>
      expect(screen.getByTestId("textbox-column-selector")).toBeDefined(),
    );
    const searchInput = screen.getByTestId("textbox-column-selector");
    fireEvent.change(searchInput, { target: { value: "col1" } });

    await userEvent.click(button);
    await userEvent.click(button);

    await waitFor(() =>
      expect(screen.getByTestId("textbox-column-selector")).toBeDefined(),
    );
    const updatedSearchInput = screen.getByTestId("textbox-column-selector");
    expect(updatedSearchInput).toHaveValue("col1");
  });

  it("should toggle column visibility on switch toggle", async () => {
    const { getAllByTestId } = render(
      <ColumnOrdering
        table={mockTable}
        handleColumnOrderingReset={mockHandleColumnOrderingReset}
        columnOrder={mockColumnOrder}
        setColumnOrder={mockSetColumnOrder}
      />,
    );

    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);
    // Simulate clicking on the switch to toggle visibility of the first column
    const switchToggle = getAllByTestId("switch-toggle");
    await userEvent.click(switchToggle[0]);

    // Check if the visibility has changed
    expect(mockGetToggleVisibilityCol1).toBeCalled();
  });
});
