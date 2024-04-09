import { humanify } from "@/utils/index";
import {
  ColumnDef,
  ColumnOrderState,
  VisibilityState,
  Row,
} from "@tanstack/react-table";
import saveAs from "file-saver";
import { v4 as uuidv4 } from "uuid";

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
  columnOrder?: ColumnOrderState;
  columnVisibility?: VisibilityState;
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
}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      // Filter columns based on blackList and columnVisibility
      const filteredColumns = columns.filter((column) => {
        const columnId = column.id;
        return (
          !option?.blacklist?.includes(columnId) &&
          !(columnVisibility?.[columnId] === false)
        );
      });

      // Sort columns based on columnOrder
      const sortedColumns = (columnOrder || columns.map((column) => column.id))
        ?.map((columnId) => {
          const foundColumn = filteredColumns.find(
            (column) => column.id === columnId,
          );
          return foundColumn ? foundColumn : null;
        })
        .filter((column) => column !== null);

      const header = sortedColumns
        .map((column) =>
          typeof column?.header === "string"
            ? column.header
            : humanify({ term: column.id }),
        )
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
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// these are a few standard column ids that will not be part of column ordering
export const NO_COLUMN_ORDERING_IDS = ["select", "remove", "cart", "slides"];

export function getDefaultRowId<TData>(
  _originalRow: TData,
  _index: number,
  _parent?: Row<TData>,
) {
  return uuidv4();
}
