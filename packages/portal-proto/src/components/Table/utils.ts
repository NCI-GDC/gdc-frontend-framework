import {
  ColumnDef,
  ColumnOrderState,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import saveAs from "file-saver";

// type ColumnComposerFunction = (
//     row: Record<string, any>,
//     accessor: string,
//     header: ColumnDefTemplate<HeaderContext<TData, unknown>>,
//     rowIndex: number,
//   ) => string;

export function dowloadTSVNew<TData>({
  tableData,
  columns,
  columnOrder,
  columnVisibility,
  fileName,
  option,
}: {
  tableData: Row<TData>[];
  columns: ColumnDef<TData>[];
  columnOrder: ColumnOrderState;
  columnVisibility: VisibilityState;
  fileName: string;
  option?: {
    // should be ids of the column
    blacklist?: string[];
    overwrite?: Record<
      string,
      {
        header?: string;
        // composer?: string | ColumnComposerFunction;
      }
    >;
  };
}): void {
  // Filter columns based on blackList and columnVisibility
  const filteredColumns = columns.filter((column) => {
    const columnId = column.id;
    return (
      !option.blacklist.includes(columnId) &&
      !(columnVisibility[columnId] === false)
    );
  });

  // Sort columns based on columnOrder
  const sortedColumns = columnOrder
    .map((columnId) => {
      const foundColumn = filteredColumns.find(
        (column) => column.id === columnId,
      );
      return foundColumn ? foundColumn : null;
    })
    .filter((column) => column !== null);

  const getOverwriteHeader = (column: ColumnDef<TData>) =>
    option?.overwrite?.[column.id]?.header;

  const header = sortedColumns
    .map((column) => getOverwriteHeader(column) ?? column.header)
    .join("\t");

  const body = (tableData || [])
    .map((obj) =>
      sortedColumns
        .map((column) => {
          return obj?.original[column.id];
        })
        .join("\t"),
    )
    .join("\n");

  const tsv = [header, body].join("\n");
  const blob = new Blob([tsv], { type: "text/tsv" });

  saveAs(blob, fileName);
}
