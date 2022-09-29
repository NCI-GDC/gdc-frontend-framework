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

export interface ExpTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  expanded: ExpandedState;
  handleExpandedProxy: (exp: ExpandedState) => void;
  handleRowSelect: (row: any) => void; // todo: add row type
  widthProps: any;
}

export const ExpTable: React.VFC<ExpTableProps> = ({
  data,
  columns,
  expanded,
  handleExpandedProxy,
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
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 100,
  });

  return (
    <div className="p-2">
      <div className="h-2 shadow-md" />
      <table>
        <thead className={`border-2 shadow-md`}>
          {table.getHeaderGroups().map((headerGroup) => (
            <animated.tr style={unitSpring} key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
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
              <tr
                key={row.id}
                className={`border-2 ${index % 2 ? `bg-slate-50` : `bg-white`}`}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <animated.td style={unitSpring} key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </animated.td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <div onClick={() => console.log("expanded", expanded)}>
        {table.getRowModel().rows.length} Rows
      </div> */}
    </div>
  );
};

export default ExpTable;
