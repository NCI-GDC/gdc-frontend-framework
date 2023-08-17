import { humanify } from "@/utils/index";
import {
  ColumnDef,
  ColumnOrderState,
  VisibilityState,
} from "@tanstack/react-table";
import saveAs from "file-saver";

export function downloadTSV<TData>({
  tableData,
  columns,
  columnOrder,
  columnVisibility,
  fileName,
  option,
}: {
  tableData: TData[];
  columns: ColumnDef<TData>[];
  columnOrder: ColumnOrderState;
  columnVisibility: VisibilityState;
  fileName: string;
  option?: {
    // should be ids of the column
    blacklist?: string[];
    overwrite?: Record<
      string, // should be id of the column
      {
        header?: string;
        composer?: (data: TData) => void;
      }
    >;
  };
}): void {
  // Filter columns based on blackList and columnVisibility
  const filteredColumns = columns.filter((column) => {
    const columnId = column.id;
    return (
      !option?.blacklist?.includes(columnId) &&
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

  const header = sortedColumns
    .map((column) => humanify({ term: column.id }))
    .join("\t");

  const body = (tableData || [])
    .map((datum) =>
      sortedColumns
        .map((column) => {
          const composer = option?.overwrite?.[column.id]?.composer;
          return composer ? composer(datum) : datum?.[column.id];
        })
        .join("\t"),
    )
    .join("\n");

  const tsv = [header, body].join("\n");
  const blob = new Blob([tsv], { type: "text/tsv" });

  saveAs(blob, fileName);
}

// these are a few standard column ids that will not be part of column ordering
export const NO_COLUMN_ORDERING_IDS = ["select", "remove", "cart", "slides"];
