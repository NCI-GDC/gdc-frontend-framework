// @ts-nocheck
import React from "react";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { animated, useSpring } from "react-spring";
import CheckboxSpring from "./CheckboxSpring";
import AnimatedRow from "./AnimatedRow";

export interface ExpTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  expanded: ExpandedState;
  handleExpandedProxy: (exp: ExpandedState) => void;
  selectAll: (rows: any, isActive: boolean) => void; // todo: add row type
  allSelected: any;
  firstColumn: string;
  headerWidth: number;
}

export const ExpTable: React.FC<ExpTableProps> = ({
  data,
  columns,
  expanded,
  handleExpandedProxy,
  selectAll,
  allSelected,
  firstColumn,
  headerWidth,
}: ExpTableProps) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    enableColumnResizing: true,
    onExpandedChange: handleExpandedProxy,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const unitSpring = useSpring({
    from: {
      opacity: 0,
      transform: "translate3D(0, -120px, 0)",
      width: headerWidth / 2,
    },
    to: { opacity: 1, transform: "translate3D(0, 0, 0)", width: headerWidth },
    immediate: true,
  });
  const selectAllActive =
    table.getRowModel().rows.length === 0
      ? false
      : table
          .getRowModel()
          .rows.filter((row) => !row.id.includes(".")) // exclude subrow from select-all condition
          .every((row) => row.original["select"] in allSelected);
  return (
    <div className="p-2">
      <div
        className={`shadow-md ${
          selectAllActive ? `border-b-4 border-r-4 border-activeColor` : ``
        }`}
      >
        <table>
          <thead
            className={`${
              selectAllActive
                ? `border-l-4 border-t-4 border-b-0 border-r-0 border-activeColor`
                : `border-2`
            } shadow-md w-11/12`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <animated.tr style={unitSpring} key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className={`w-max m-auto`}>
                          {header.id === "select" &&
                          header.id !== `1_ _${firstColumn}` ? (
                            <CheckboxSpring
                              isActive={selectAllActive}
                              handleCheck={selectAll}
                              select={table.getRowModel().rows}
                            />
                          ) : null}
                          <animated.div
                            style={unitSpring}
                            className={`text-xs font-bold`}
                          >
                            {header.id !== "select" &&
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          </animated.div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </animated.tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <AnimatedRow
                  key={index}
                  row={row}
                  index={index}
                  selected={row.original["select"] in allSelected}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpTable;
