import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColumnOrdering from "../ColumnOrdering";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

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

  //   it("should close column menu on outside click", () => {
  //     render(
  //       <ColumnOrdering
  //         table={mockTable}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const button = screen.getByTestId("button-column-selector-box");
  //     userEvent.click(button);
  //     // TODO need to to sth here
  //     const outside = screen.getByText("Some outside content");
  //     userEvent.click(outside);
  //     expect(screen.queryByTestId("column-selector-popover-modal")).toBeNull();
  //   });

  // it("should restore defaults on revert icon click", async () => {
  //   render(
  //     <ColumnOrdering
  //       table={mockTable}
  //       handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //       columnOrder={mockColumnOrder}
  //       setColumnOrder={mockSetColumnOrder}
  //     />,
  //   );
  //   // need to mock on changing something first
  //   const revertIcon = screen.getByTestId("restore-default-icon");
  //   await userEvent.click(revertIcon);

  //   expect(mockSetColumnOrder).toHaveBeenCalledWith(
  //     mockTable.initialState.columnOrder,
  //   );
  // });

  // it("should filter columns by search input", async () => {
  //   render(
  //     <ColumnOrdering
  //       table={mockTable}
  //       handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //       columnOrder={mockColumnOrder}
  //       setColumnOrder={mockSetColumnOrder}
  //     />,
  //   );
  //   const button = screen.getByTestId("button-column-selector-box");
  //   await userEvent.click(button);
  //   const searchInput = screen.getByTestId("textbox-column-selector");
  //   await fireEvent.change(searchInput, { target: { value: "col1" } });
  //   expect(screen.getByTestId("column-selector-row-col1")).toBeInTheDocument();
  //   expect(
  //     screen.queryByTestId("column-selector-row-col2"),
  //   ).not.toBeInTheDocument();
  // });

  // it("should reorder columns in the list", async () => {
  //   const mockUseDrag = jest.fn();
  //   mockUseDrag.mockReturnValue([{}, jest.fn(), jest.fn()]);

  //   // Mock useDrop
  //   const mockUseDrop = jest.fn();
  //   mockUseDrop.mockReturnValue([{}, jest.fn()]);

  //   // Wrap the ColumnOrdering component in DndProvider
  //   render(
  //     <DndProvider backend={HTML5Backend}>
  //       <ColumnOrdering
  //         table={mockTable}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />
  //     </DndProvider>,
  //   );

  //   const button = screen.getByTestId("button-column-selector-box");
  //   await userEvent.click(button);
  //   // Simulate drag and drop action
  //   const dragItem = screen.getByTestId("column-selector-row-col1");
  //   const dropTarget = screen.getByTestId("column-selector-row-col2");

  //   // Simulate dragging
  //   await fireEvent.drag(dragItem);

  //   // Simulate dropping (this part might need to be adapted)
  //   await fireEvent.drop(dropTarget);

  //   // Check if the columnOrder state is updated correctly
  //   expect(mockSetColumnOrder).toHaveBeenCalledWith(["col2", "col1"]); // Adjust this based on your expectations
  // });

  //   it("should toggle column visibility on switch toggle", () => {
  //     render(
  //       <ColumnOrdering
  //         table={mockTable}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const switchToggle = screen.getByTestId("switch-toggle");
  //     userEvent.click(switchToggle);
  //     // Add assertion to check if column visibility is toggled
  //   });

  //   it("should show and hide the column menu when button is clicked multiple times", () => {
  //     render(
  //       <ColumnOrdering
  //         table={mockTable}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const button = screen.getByTestId("button-column-selector-box");

  //     userEvent.click(button);
  //     expect(
  //       screen.getByTestId("column-selector-popover-modal"),
  //     ).toBeInTheDocument();

  //     userEvent.click(button);
  //     expect(screen.queryByTestId("column-selector-popover-modal")).toBeNull();
  //   });

  //   it("should reset search input when menu is opened", () => {
  //     render(
  //       <ColumnOrdering
  //         table={mockTable}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const searchInput = screen.getByTestId("textbox-column-selector");
  //     fireEvent.change(searchInput, { target: { value: "col1" } });

  //     const button = screen.getByTestId("button-column-selector-box");
  //     userEvent.click(button);

  //     const updatedSearchInput = screen.getByTestId("textbox-column-selector");
  //     expect(updatedSearchInput).toHaveValue("");
  //   });

  //   it("should hide restore defaults icon when already at defaults", () => {
  //     const mockTableAtDefaults = {
  //       initialState: {
  //         columnOrder: ["col1", "col2"],
  //         columnVisibility: { col1: true, col2: true },
  //       },
  //       // ... other mockTable methods ...
  //     };

  //     render(
  //       <ColumnOrdering
  //         table={mockTableAtDefaults as any}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const revertIcon = screen.getByLabelText("restore defaults");
  //     expect(revertIcon).toHaveClass("invisible");
  //   });

  //   it("should not allow dragging if there is only one visible column", () => {
  //     const mockTableSingleColumn = {
  //       initialState: {
  //         columnOrder: ["col1"],
  //         columnVisibility: { col1: true },
  //       },
  //       // ... other mockTable methods ...
  //     } as any;

  //     render(
  //       <ColumnOrdering
  //         table={mockTableSingleColumn}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const columnItem = screen.getByTestId("column-selector-row-col1");
  //     expect(columnItem).not.toHaveClass("cursor-move");
  //   });

  //   // Add test cases to simulate drag and drop interactions on the sortable list

  //   it("should handle column visibility toggle", () => {
  //     const mockColumns = [
  //       {
  //         id: "col1",
  //         getIsVisible: jest.fn(),
  //         getToggleVisibilityHandler: jest.fn(),
  //       },
  //       // ... add more columns as needed ...
  //     ];
  //     mockColumns[0].getIsVisible.mockReturnValue(true);

  //     render(
  //       <ColumnOrdering
  //         table={{ ...mockTable, getAllLeafColumns: () => mockColumns }}
  //         handleColumnOrderingReset={mockHandleColumnOrderingReset}
  //         columnOrder={mockColumnOrder}
  //         setColumnOrder={mockSetColumnOrder}
  //       />,
  //     );
  //     const switchToggle = screen.getByTestId("switch-toggle");
  //     userEvent.click(switchToggle);

  //     expect(mockColumns[0].getToggleVisibilityHandler).toHaveBeenCalled();
  //   });
});
