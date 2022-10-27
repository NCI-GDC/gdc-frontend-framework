import saveAs from "file-saver";
import get from "lodash/get";

type ColumnComposerFunction = (
  row: Record<string, any>,
  accessor: string,
  Header: string,
  rowIndex: number,
) => string;

export function downloadTSV(
  tableData: readonly Record<string, any>[],
  columns: {
    accessor: string;
    Header: string;
    composer?: string | ColumnComposerFunction;
  }[],
  fileName: string,
  option?: {
    blacklist?: string[];
    overwrite?: Record<
      string,
      {
        Header?: string;
        composer?: string | ColumnComposerFunction;
      }
    >;
  },
): void {
  const filteredColumns = columns.filter(
    (column) => !option?.blacklist?.includes(column.accessor),
  );

  const getOverwriteHeader = (column) =>
    option?.overwrite?.[column.accessor]?.Header;

  const header = filteredColumns
    .map((column) => getOverwriteHeader(column) ?? column.Header)
    .join("\t");

  const body = (tableData || [])
    .map((obj, index) =>
      filteredColumns
        .map((column) => {
          const overwriteComposer =
            option?.overwrite?.[column.accessor]?.composer;
          const overwriteHeader = getOverwriteHeader(column);
          const composer = overwriteComposer ?? column.composer;
          const Header = overwriteHeader ?? column.Header;

          return composer
            ? typeof composer === "string"
              ? get(obj, composer)
              : composer(obj, column.accessor, Header, index)
            : obj[column.accessor];
        })
        .join("\t"),
    )
    .join("\n");

  const tsv = [header, body].join("\n");
  const blob = new Blob([tsv], { type: "text/tsv" });

  saveAs(blob, fileName);
}
