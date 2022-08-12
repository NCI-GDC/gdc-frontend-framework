import React, { useState, useEffect, useCallback, FC } from "react";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList as List } from "react-window";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";
import { BsList } from "react-icons/bs";
import { Box, Popover } from "@mantine/core";

interface VerticalTableProps {
  tableData: any;
  columnListOrder: any;
  columnCells: any;
  handleColumnChange: (columns: any) => void;
  selectableRow: boolean;
  tableTitle: string;
  pageSize: string;
  additionalControls?: React.ReactNode;
  showControls?: boolean;
}

interface Column {
  Header: string;
  accessor: string;
  width: number;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

export const VerticalTable: FC<VerticalTableProps> = ({
  tableData,
  columnListOrder,
  columnCells,
  handleColumnChange,
  selectableRow,
  tableTitle,
  pageSize,
  additionalControls,
  showControls = true,
}: VerticalTableProps) => {
  const [table, setTable] = useState([]);
  const [columnListOptions, setColumnListOptions] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  useEffect(() => {
    setTable(tableData);
  }, [tableData]);

  useEffect(() => {
    setColumnListOptions(columnListOrder);
  }, [columnListOrder]);

  useEffect(() => {
    setHeadings(columnCells);
  }, [columnCells]);

  const tableAction = (action) => {
    action.visibleColumns.push((columns) => [
      {
        id: "Checkbox",
        Header: "",
        Cell: () => <input type="checkbox" />,
        width: 30,
      },
      ...columns,
    ]);
  };

  const Table: FC<TableProps> = ({ columns, data }: TableProps) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      totalColumnsWidth,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
      },
      useBlockLayout,
      selectableRow ? tableAction : null,
    );

    const RenderRow = useCallback(
      ({ index, style }) => {
        const row = rows[index];
        prepareRow(row);

        return (
          <div
            role="row"
            aria-rowindex={index}
            {...row.getRowProps({
              style,
            })}
            className={`tr ${
              index % 2 === 1 ? "bg-base-lighter" : "bg-base-lightest"
            }`}
          >
            {row.cells.map((cell, key) => {
              return (
                <div
                  {...cell.getCellProps()}
                  role="cell"
                  key={`row-${key}`}
                  className="td rounded-sm p-1.5 text-sm text-content text-medium text-center h-7"
                >
                  {cell.render("Cell")}
                </div>
              );
            })}
          </div>
        );
      },
      [prepareRow, rows],
    );
    return (
      <div className="p-2">
        <h2
          id={`${tableTitle.toLowerCase().replace(" ", "_")}`}
          className={`font-semibold`}
        >
          {tableTitle}
        </h2>
        <div
          role="table"
          aria-label={tableTitle}
          aria-describedby={`${tableTitle.toLowerCase().replace(" ", "_")}`}
          aria-rowcount={pageSize ? pageSize : `-1`}
          aria-colcount={columns.length > 0 ? columns.length.toString() : `-1`}
          {...getTableProps()}
          className="table inline-block"
        >
          <div role="rowgroup" className="bg-primary-lighter">
            {headerGroups.map((headerGroup, key) => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                role="row"
                className="tr"
                key={`header-${key}`}
              >
                {headerGroup.headers.map((column, key) => (
                  <div
                    role="columnheader"
                    {...column.getHeaderProps()}
                    className="th font-header font-bold text-primary-content-darkest text-center"
                    key={`column-${key}`}
                  >
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div role="rowgroup" {...getTableBodyProps()}>
            <List
              height={360}
              itemCount={rows.length}
              itemSize={60}
              width={totalColumnsWidth}
            >
              {RenderRow}
            </List>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={`h-10 float-left`}>{additionalControls}</div>
      {showControls && (
        <div className="flex flex-row float-right mb-4">
          <Popover
            opened={showColumnMenu}
            onClose={() => setShowColumnMenu(false)}
            width={260}
            position="bottom"
            transition="scale"
            withArrow
          >
            <Popover.Target>
              <Box
                className={`mr-0 ml-auto border-1 border-base-lighter p-3`}
                onClick={() => setShowColumnMenu(!showColumnMenu)}
              >
                <BsList></BsList>
              </Box>
            </Popover.Target>
            <Popover.Dropdown>
              <div className={`w-fit`}>
                {columnListOptions.length > 0 && showColumnMenu && (
                  <div className={`mr-0 ml-auto`}>
                    <DndProvider backend={HTML5Backend}>
                      <DragDrop
                        listOptions={columnListOptions}
                        handleColumnChange={handleColumnChange}
                      />
                    </DndProvider>
                  </div>
                )}
              </div>
            </Popover.Dropdown>
          </Popover>
          <div className="flex flex-row w-max float-right">
            <input
              className={`mr-2 rounded-sm border-1 border-base-lighter`}
              type="search"
              placeholder="Search"
            />
            <div className={`mt-px`}></div>
          </div>
        </div>
      )}
      {columnListOptions.length > 0 && (
        <Table columns={headings} data={table}></Table>
      )}
    </div>
  );
};
