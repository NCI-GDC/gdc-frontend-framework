import React, { useState, useEffect, useCallback, FC, useRef } from "react";
import { useTable, useBlockLayout, useExpanded } from "react-table";
import { VariableSizeList as List } from "react-window";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";
import { ToggleSort } from "./ToggleSort";
import { BsList, BsSortDown } from "react-icons/bs";
import { Popover } from "@mantine/core";

interface VerticalTableProps {
  tableData: any;
  columnListOrder: any;
  columnCells: any;
  handleColumnChange: (columns: any) => void;
  handleRowSelectChange: (
    rows: any,
    select: string,
    selectAll: boolean,
  ) => void;
  uuidRowParam: string;
  scrollItem: number;
  selectedRowsMap: any;
  expandedCell: any;
  selectableRow: boolean;
  handleSortChange: (sortUpdate: any) => void;
  selectedSorts: any;
  tableTitle: string;
  pageSize: string;
}

interface Column {
  Header: string;
  accessor: string;
  width: number;
}

interface TableProps {
  columns: Column[];
  data: any[];
  scrollItem: number;
  expandedCell: any;
}

export const VerticalTable: FC<VerticalTableProps> = ({
  tableData,
  columnListOrder,
  columnCells,
  handleColumnChange,
  handleRowSelectChange,
  uuidRowParam,
  scrollItem,
  selectedRowsMap,
  expandedCell,
  selectableRow,
  handleSortChange,
  selectedSorts,
  tableTitle,
  pageSize,
}: VerticalTableProps) => {
  const [table, setTable] = useState([]);
  const [columnListOptions, setColumnListOptions] = useState([]);
  const [sortListOptions, setSortListOptions] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const listRef = useRef<any>({});
  const rowHeights = useRef<any>({});

  useEffect(() => {
    setTable(tableData);
  }, [tableData]);

  useEffect(() => {
    setColumnListOptions(columnListOrder);
  }, [columnListOrder]);

  useEffect(() => {
    setSortListOptions(selectedSorts);
  }, [selectedSorts]);

  useEffect(() => {
    setHeadings(columnCells);
  }, [columnCells]);

  const tableAction = (action) => {
    action.visibleColumns.push((columns) => [
      {
        id: "Checkbox",
        Header: "",
        Cell: ({ row }) => (
          <input
            key={`key-${row.id}`}
            checked={
              row.original[uuidRowParam] in selectedRowsMap ? true : false
            }
            onChange={() => handleRowSelectChange(row, "single", false)}
            type="checkbox"
          />
        ),
        width: 20,
      },
      ...columns,
    ]);
  };

  const Table: FC<TableProps> = ({
    columns,
    data,
    scrollItem,
    expandedCell,
  }: TableProps) => {
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
      useExpanded,
      selectableRow ? tableAction : null,
    );

    const setRowHeight = (index, size) => {
      rowHeights.current = { ...rowHeights.current, [index]: size };
    };

    const rowRef = useRef<any>({});

    const RenderRow = useCallback(
      ({ index, style }) => {
        useEffect(() => {
          if (rowRef.current) {
            setRowHeight(index, rowRef.current.clientHeight);
          }
          // eslint-disable-next-line
        }, [rowRef]);
        //   const row = rows[index];
        //   prepareRow(row);

        //   return (
        //     <>
        //       <div>
        //         <div
        //           {...row.getRowProps({
        //             style,
        //           })}
        //           // {...row.getToggleRowExpandedProps()}
        //           role="row"
        //           aria-rowindex={index}
        //           ref={rowRef}
        //           key={`row-header-${index}`}
        //           className={`tr ${index % 2 === 1 ? "bg-slate-100" : "bg-white"
        //             } text-sm block`}>
        //           {row.cells.map((cell, key) => {
        //             return (
        //               <div key={`cell-${key}`} className={`flex ${cell?.value?.length > 25 ? 'mt-4' : 'items-center'} justify-center`}>
        //                 <div
        //                   {...cell.getCellProps()}
        //                   role="cell"
        //                   // key={`row-key-${index}-${key}`}
        //                   // justify-end flex items-center justify-center
        //                   className={`td rounded-sm p-1 h-8`}
        //                 >
        //                   {cell.render("Cell")}
        //                 </div>

        //               </div>
        //             );
        //           })}
        //         </div>
        //       </div>
        //     </>
        //   );
        // },
        const renderRowSubComponent = React.useCallback(
          ({ row }) => (
            // TODO: parametrize this subrow component w/ props (styles, expandedCell, rowHeights)
            <button onClick={(row) => console.log(`subrow`, row)}>
              Subrow woohoo!
            </button>
          ),
          [],
        );
        return (
          <div>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <div
                  {...row.getRowProps()}
                  {...row.getToggleRowExpandedProps()}
                >
                  <div
                    className={`tr`}
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowExpanded(); // toggle row expand
                    }}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <div className={`td`} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </div>
                      );
                    })}
                  </div>
                  {/* TODO: pass the number of currently visible columns for col-span-n property */}
                  {row.isExpanded ? (
                    <div className={`tr`}>
                      <div className={`td col-span-6`}>
                        {/*
                      TODO: pass this component as a prop/child from Parent Table
                    */}
                        {renderRowSubComponent({ row })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      },
      [prepareRow, rows, rowRef],
    );

    const getRowSize = (index) => {
      return rowHeights.current[index] || 90;
    };

    return (
      <div className="p-2">
        <h2
          id={`${tableTitle.toLowerCase().replace(" ", "_")}`}
          className={`font-semibold`}
        ></h2>
        <div
          role="table"
          aria-label={tableTitle}
          aria-describedby={`${tableTitle.toLowerCase().replace(" ", "_")}`}
          aria-rowcount={pageSize ? pageSize : `-1`}
          aria-colcount={columns.length > 0 ? columns.length.toString() : `-1`}
          {...getTableProps()}
          className={`table inline-block shadow-3xl`}
        >
          <div role="rowgroup">
            {headerGroups.map((headerGroup, key) => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                role="row"
                // shadow-inner not noticable
                className={`tr bg-white shadow-inset text-sm font-semibold`}
                key={`header-${key}`}
              >
                {headerGroup.headers.map((column, key) => (
                  <div
                    role="columnheader"
                    {...column.getHeaderProps()}
                    className={`th text-black text-center grid place-items-center`}
                    key={`column-${key}`}
                  >
                    {key === 0 ? (
                      <input
                        checked={rows.every((row) => {
                          return row.original[uuidRowParam] in selectedRowsMap;
                        })}
                        onChange={() =>
                          handleRowSelectChange(
                            rows,
                            "all",
                            rows.every((row) => {
                              return (
                                row.original[uuidRowParam] in selectedRowsMap
                              );
                            }),
                          )
                        }
                        type="checkbox"
                      />
                    ) : null}
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div role="rowgroup" {...getTableBodyProps()}>
            <List
              // TODO: calculate height from sum of expanded & non-expanded rows
              height={600}
              itemCount={rows.length}
              itemSize={getRowSize}
              width={totalColumnsWidth + 20}
              ref={listRef}
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
          opened={showSortMenu}
          onClose={() => setShowSortMenu(false)}
          target={
            <button
              className={`mr-0 ml-auto border-1 border-gray-300 p-3`}
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <BsSortDown></BsSortDown>
            </button>
          }
          width={260}
          position="bottom"
          transition="scale"
          withArrow
        >
          <div className={`w-fit`}>
            {
              <div className={`mr-0 ml-auto`}>
                <ToggleSort
                  sortListOptions={sortListOptions}
                  handleSortChange={handleSortChange}
                />
              </div>
            }
          </div>
        </Popover>
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
          transition="scale"
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
        <Table
          columns={headings}
          data={table}
          scrollItem={scrollItem}
          expandedCell={expandedCell}
        ></Table>
      )}
    </div>
  );
};
