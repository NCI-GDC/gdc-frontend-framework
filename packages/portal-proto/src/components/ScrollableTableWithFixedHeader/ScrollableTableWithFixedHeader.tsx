/* Courtesy of https://github.com/mantinedev/ui.mantine.dev/blob/master/components/TableScrollArea/TableScrollArea.tsx */
import { createStyles, Table, ScrollArea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

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
      bottom: -1,
      borderBottom: "4px solid #c5c5c5",
    },
  },
  scrolled: {
    boxShadow: theme.shadows.xl,
  },
}));

interface ScrollableTableWithFixedHeaderProps {
  readonly tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
  readonly maxRowsBeforeScroll: number;
  readonly tableMinWidth?: number | string;
}

export const ScrollableTableWithFixedHeader = ({
  tableData,
  tableMinWidth = undefined,
  maxRowsBeforeScroll,
}: ScrollableTableWithFixedHeaderProps): JSX.Element => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [tableMaxHeight, setTableMaxHeight] = useState(0);

  const scrollAreaRef = useRef(null);
  const tableHeaderRef = useRef(null);
  const tableBodyRef = useRef(null);

  useEffect(() => {
    const calculateTableMaxHeight = () => {
      const scrollAreaBorderHeight =
        scrollAreaRef.current !== null
          ? parseFloat(
              window.getComputedStyle(scrollAreaRef.current).borderTopWidth,
            ) +
            parseFloat(
              window.getComputedStyle(scrollAreaRef.current).borderBottom,
            )
          : 0;

      const tableHeaderHeight =
        tableHeaderRef.current !== null
          ? parseFloat(window.getComputedStyle(tableHeaderRef.current).height)
          : 0;

      const tableBodyHeight =
        tableBodyRef.current !== null
          ? parseFloat(window.getComputedStyle(tableBodyRef.current).height)
          : 0;

      const calculatedTableMaxHeight =
        maxRowsBeforeScroll * (tableBodyHeight / tableData.tableRows.length) +
        tableHeaderHeight +
        scrollAreaBorderHeight;

      setTableMaxHeight(calculatedTableMaxHeight);
    };

    calculateTableMaxHeight();

    window.addEventListener("resize", calculateTableMaxHeight);

    return () => {
      window.removeEventListener("resize", calculateTableMaxHeight);
    };
  }, [maxRowsBeforeScroll, tableData.tableRows.length]);

  return (
    <ScrollArea.Autosize
      maxHeight={tableMaxHeight}
      data-testid="scrolltable"
      type="auto"
      tabIndex={0}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      className="border border-base-lighter"
      classNames={{
        scrollbar: "-m-0.5",
      }}
      ref={scrollAreaRef}
    >
      <Table
        sx={{
          minWidth: tableMinWidth,
        }}
        tabIndex={0}
      >
        <thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
          ref={tableHeaderRef}
        >
          <tr className="font-heading text-sm font-bold text-base-contrast-max whitespace-pre-line leading-5 shadow-md h-full">
            {tableData.headers.map((text, index) => (
              <th key={index} className="px-2 py-3">
                {text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-content" ref={tableBodyRef}>
          {tableData.tableRows.map((row, index) => (
            <tr
              key={index}
              className={`border-y-1 border-y-base-lighter last:border-b-0 ${
                index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
              }`}
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
};
