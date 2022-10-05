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
import SwitchSpring from "./SwitchSpring";
import AnimatedRow from "./AnimatedRow";

export interface ExpTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  expanded: ExpandedState;
  handleExpandedProxy: (exp: ExpandedState) => void;
  selectAll: (rows: any, isActive: boolean) => void; // todo: add row type
  allSelected: any;
  firstColumn: string;
}

export const ExpTable: React.VFC<ExpTableProps> = ({
  data,
  columns,
  expanded,
  handleExpandedProxy,
  selectAll,
  allSelected,
  firstColumn,
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
    from: { opacity: 0, transform: "translate3D(0, -120px, 0)" },
    to: { opacity: 1, transform: "translate3D(0, 0, 0)" },
    duration: 100,
  });
  return (
    <div className="p-2">
      <div className="h-2 shadow-md" />
      <table>
        <thead className={`border-2 shadow-md`}>
          {table.getHeaderGroups().map((headerGroup) => (
            <animated.tr
              onClick={() =>
                console.log("tableheaers", table.getHeaderGroups())
              }
              style={unitSpring}
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header, index) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div onClick={() => console.log("header", header)}>
                        {header.id === "select" &&
                        header.id !== `1_ _${firstColumn}` ? (
                          <SwitchSpring
                            icon={<></>}
                            isActive={table
                              .getRowModel()
                              .rows.filter((row) => !row.id.includes(".")) // filter out expanded row from select all check
                              .every(
                                (row) => row.original["select"] in allSelected,
                              )}
                            handleSwitch={selectAll}
                            selected={table.getRowModel().rows}
                          />
                        ) : null}
                        <div>
                          {header.id !== "select" &&
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        </div>
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
            return <AnimatedRow row={row} index={index} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpTable;
