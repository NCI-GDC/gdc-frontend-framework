/* Courtesy of https://github.com/mantinedev/ui.mantine.dev/blob/master/components/TableScrollArea/TableScrollArea.tsx */
import { Table, ScrollArea } from "@mantine/core";
import { ReactNode, useEffect, useRef, useState } from "react";
import classes from "./ScrollableTableWithFixedHeader.module.css";

interface ScrollableTableWithFixedHeaderProps {
  readonly tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
  readonly maxRowsBeforeScroll: number;
  readonly customDataTestID: string;
  readonly tableMinWidth?: number | string;
}

export const ScrollableTableWithFixedHeader = ({
  tableData,
  tableMinWidth = undefined,
  maxRowsBeforeScroll,
  customDataTestID,
}: ScrollableTableWithFixedHeaderProps): JSX.Element => {
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
      mah={tableMaxHeight}
      data-testid="scrolltable"
      type="auto"
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      className="border border-base-lighter text-left"
      classNames={{
        scrollbar: "-m-0.5",
      }}
      ref={scrollAreaRef}
    >
      <Table
        data-testid={customDataTestID}
        style={{
          minWidth: tableMinWidth,
        }}
      >
        <thead
          className={`${classes.header} ${scrolled ? "shadow-xl" : ""}`}
          ref={tableHeaderRef}
        >
          <tr className="font-heading text-sm font-bold text-base-contrast-max whitespace-pre-line leading-5 shadow-md h-full">
            {tableData.headers.map((text, index) => (
              <th key={index} className="px-2.5 py-3">
                {text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-content" ref={tableBodyRef}>
          {tableData.tableRows.map((row, index) => (
            <tr
              key={index}
              className={`border-y-1 border-y-base-lighter last:border-b-0 h-10 ${
                index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
              }`}
            >
              {Object.values(row).map((item, index) => (
                <td key={index} className="text-sm px-2.5 py-2 border-0">
                  {item !== undefined ? (item as ReactNode) : "--"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea.Autosize>
  );
};
