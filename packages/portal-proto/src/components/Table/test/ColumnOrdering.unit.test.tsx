import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColumnOrdering from "../ColumnOrdering";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("ColumnOrdering", () => {
  const mockGetToggleVisibilityHandlerCol1 = jest.fn();
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
        getToggleVisibilityHandler: mockGetToggleVisibilityHandlerCol1,
      },
      {
        id: "col2",
        getIsVisible: jest.fn(),
        getToggleVisibilityHandler: jest.fn(),
      },
      {
        id: "col3",
        getIsVisible: jest.fn(),
        getToggleVisibilityHandler: jest.fn(),
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

  it("should reorder columns on drag and drop", async () => {
    const { getByTestId } = render(
      <DndProvider backend={HTML5Backend}>
        <ColumnOrdering
          table={mockTable}
          handleColumnOrderingReset={mockHandleColumnOrderingReset}
          columnOrder={mockColumnOrder}
          setColumnOrder={mockSetColumnOrder}
        />
      </DndProvider>,
    );

    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);
    // Simulate drag and drop operations using fireEvent
    const column1 = getByTestId("column-selector-row-col1");
    const column2 = getByTestId("column-selector-row-col2");
    fireEvent.dragStart(column1);
    fireEvent.dragEnter(column2);
    fireEvent.drop(column2);

    // Check if the column order has changed
    const updatedColumnOrder = ["col2", "col1", "col3"];

    expect(mockSetColumnOrder).toBeCalledWith(updatedColumnOrder);
  });

  it("should toggle column visibility on switch toggle", async () => {
    const { getAllByTestId } = render(
      <DndProvider backend={HTML5Backend}>
        <ColumnOrdering
          table={mockTable}
          handleColumnOrderingReset={mockHandleColumnOrderingReset}
          columnOrder={mockColumnOrder}
          setColumnOrder={mockSetColumnOrder}
        />
      </DndProvider>,
    );

    const button = screen.getByTestId("button-column-selector-box");
    await userEvent.click(button);
    // Simulate clicking on the switch to toggle visibility of the first column
    const switchToggle = getAllByTestId("switch-toggle");
    await userEvent.click(switchToggle[0]);

    // Check if the visibility has changed
    expect(mockGetToggleVisibilityHandlerCol1).toBeCalled();
  });
});
