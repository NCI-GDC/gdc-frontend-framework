import saveAs from "file-saver";
import set from "lodash/set";
import get from "lodash/get";

export function downloadTSV(
  tableData: readonly Record<string, any>[],
  columns: {
    id: string;
    columnName: string;
    composer?: (
      row: Record<string, any>,
      columnId: string,
      columnName: string,
      rowIndex: number,
    ) => string;
  }[],
  fileName: string,
): void {
  const header = columns.map((column) => column.columnName).join("\t");

  const body = (tableData || [])
    .map((obj, index) =>
      columns
        .map((column) =>
          column.composer
            ? column.composer(obj, column.id, column.columnName, index)
            : obj[column.id],
        )
        .join("\t"),
    )
    .join("\n");

  const tsv = [header, body].join("\n");
  const blob = new Blob([tsv], { type: "text/tsv" });

  saveAs(blob, fileName);
}

export function downloadJSON(
  tableData: readonly Record<string, any>[],
  keys: {
    path: string;
    composer?:
      | string
      | ((
          row: Record<string, any>,
          path: string,
          rowIndex: number,
        ) => string | Record<string, any>);
  }[],
  fileName: string,
): void {
  const json = (tableData || []).map((row, index) => {
    const rowJson = {};

    keys.map((key) => {
      const val = key.composer
        ? typeof key.composer === "string"
          ? get(row, key.composer)
          : key.composer(row, key.path, index)
        : get(row, key.path);
      set(rowJson, key.path, val);
    });

    return rowJson;
  });

  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "text/json" });

  saveAs(blob, fileName);
}
