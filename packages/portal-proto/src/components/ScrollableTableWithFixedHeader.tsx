/* Courtesy of https://github.com/mantinedev/ui.mantine.dev/blob/master/components/TableScrollArea/TableScrollArea.tsx */
import { createStyles, Table, ScrollArea } from "@mantine/core";
import { ForwardedRef, forwardRef, useState } from "react";

const useStyles = createStyles((theme) => ({
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
  scrolled: {
    boxShadow: theme.shadows.md,
  },
}));

interface ScrollableTableWithFixedHeaderProps {
  readonly tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
  readonly scrollAreaHeight: number | string;
  readonly tableMinWidth?: number | string;
}

export const ScrollableTableWithFixedHeader = forwardRef(
  (
    {
      tableData,
      scrollAreaHeight,
      tableMinWidth = undefined,
    }: ScrollableTableWithFixedHeaderProps,
    ref: ForwardedRef<HTMLTableRowElement>,
  ): JSX.Element => {
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);

    return (
      <ScrollArea.Autosize
        maxHeight={scrollAreaHeight}
        data-testid="scrolltable"
        type="auto"
        tabIndex={0}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        className="border border-base-lighter"
        classNames={{
          scrollbar: "-m-0.5",
        }}
      >
        <Table
          sx={{
            minWidth: tableMinWidth,
          }}
          tabIndex={0}
        >
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr className="font-heading text-sm font-bold text-base-contrast-max whitespace-pre-line leading-5 shadow-md h-full">
              {tableData.headers.map((text, index) => (
                <th key={index} className="px-2 py-3">
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-content">
            {tableData.tableRows.map((row, index) => (
              <tr
                key={index}
                className={`border-y-1 border-y-base-lighter ${
                  index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
                }`}
                ref={ref}
              >
                {Object.values(row).map((item, index) => (
                  <td key={index} className="text-sm px-2 py-2.5 border-0">
                    {typeof item === "undefined" ? "--" : item}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea.Autosize>
    );
  },
);
