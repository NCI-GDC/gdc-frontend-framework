import { render, screen } from "test-utils";
import { ScrollableTableWithFixedHeader } from "./ScrollableTableWithFixedHeader";

test("renders correctly on mount", () => {
  const tableData = {
    headers: ["Name", "Age"],
    tableRows: [
      { name: "John Doe", age: 25 },
      { name: "Jane Smith", age: 30 },
    ],
  };
  const maxRowsBeforeScroll = 5;

  render(
    <ScrollableTableWithFixedHeader
      tableData={tableData}
      maxRowsBeforeScroll={maxRowsBeforeScroll}
    />,
  );

  // Assert that the table is rendered
  const scrollTable = screen.getByTestId("scrolltable");
  expect(scrollTable).toBeInTheDocument();

  // Assert that the table headers are rendered
  expect(screen.getByText("Name")).toBeInTheDocument();
  expect(screen.getByText("Age")).toBeInTheDocument();

  // Assert that the table rows are rendered
  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("Jane Smith")).toBeInTheDocument();
});
