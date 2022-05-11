import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";
import { BsList } from "react-icons/bs";
import { Popover } from "@mantine/core";

const VerticalTable = ({
  tableData,
  columnListOrder,
  columnCells,
  handleColumnChange,
  selectableRow = false,
}) => {
  const [table, setTable] = useState([]);
  const [columnListOptions, setColumnListOptions] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  useEffect(() => {
    setTable(tableData);
    setColumnListOptions(columnListOrder);
    setHeadings(columnCells);
  }, [tableData, columnListOrder, columnCells]);

  const tableAction = (action) => {
    action.visibleColumns.push((columns) => [
      {
        id: "Checkbox",
        Header: "",
        Cell: ({ row }) => <input type="checkbox" />,
        width: 30,
      },
      ...columns,
    ]);
  };

  const Table = ({ columns, data }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      page,
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
            {...row.getRowProps({
              style,
            })}
            className={`tr ${index % 2 === 1 ? "bg-gray-300" : "bg-white"}`}
          >
            {row.cells.map((cell) => {
              return (
                <div
                  {...cell.getCellProps()}
                  className="td rounded-sm p-1.5 text-center h-7"
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
        <div {...getTableProps()} className="table inline-block">
          <div className="bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps()}
                    className="th text-black text-center"
                  >
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()}>
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
      <div className={`h-10`}></div>
      <div className={`float-right`}>
        <Popover
          opened={showColumnMenu}
          onClose={() => setShowColumnMenu(false)}
          target={
            <button
              className={`mr-0 ml-auto border-1 border-gray-300 p-3`}
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            >
              <BsList></BsList>
            </button>
          }
          width={260}
          position="bottom"
          withArrow
        >
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
        </Popover>
        <div className={`flex flex-row w-max float-right mb-4`}>
          <input
            className={`mr-2 rounded-sm border-1 border-gray-300`}
            type="search"
            placeholder="Search"
          />
          <div className={`mt-px`}></div>
        </div>
      </div>
      {columnListOptions.length > 0 && (
        <Table columns={headings} data={table}></Table>
      )}
    </div>
  );
};

export default VerticalTable;
