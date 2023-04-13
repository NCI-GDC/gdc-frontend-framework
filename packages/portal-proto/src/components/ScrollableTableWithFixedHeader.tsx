/* Courtesy of https://github.com/mantinedev/ui.mantine.dev/blob/master/components/TableScrollArea/TableScrollArea.tsx */
import { createStyles, Table, ScrollArea } from "@mantine/core";

const useStyles = createStyles(() => ({
  header: {
    position: "sticky",
    top: 0,
    transition: "box-shadow 150ms ease",
    height: "56px",
    backgroundColor: "#FFFFFF",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: "4px solid #c5c5c5",
    },
  },
}));

interface ScrollableTableWithFixedHeaderProps {
  readonly tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
  readonly scrollAreaHeight: number;
  readonly tableMinWidth?: number;
}

export function ScrollableTableWithFixedHeader({
  tableData,
  scrollAreaHeight,
  tableMinWidth = undefined,
}: ScrollableTableWithFixedHeaderProps): JSX.Element {
  const { classes, cx } = useStyles();

  return (
    <ScrollArea.Autosize
      maxHeight={scrollAreaHeight}
      data-testid="scrolltable"
      type="auto"
      tabIndex={0}
    >
      <Table sx={{ minWidth: tableMinWidth }} tabIndex={0}>
        <thead className={cx(classes.header)}>
          <tr className="border-1 border-base-lighter border-t-0">
            {tableData.headers.map((text, index) => (
              <th key={index}>{text}</th>
            ))}
          </tr>
        </thead>
        <tbody className="font-content border-1 border-base-lighter">
          {tableData.tableRows.map((row, index) => (
            <tr
              key={index}
              className={`border border-base-lighter ${
                index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
              }`}
            >
              {Object.values(row).map((item, index) => (
                <td
                  key={index}
                  className="text-sm px-2 py-2.5 border-y border-base-lighter"
                >
                  {typeof item === "undefined" ? "--" : item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea.Autosize>
  );
}
