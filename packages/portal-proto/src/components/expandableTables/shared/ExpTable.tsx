// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

export interface ExpTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  expanded: ExpandedState;
  handleExpanded: (exp: ExpandedState) => void;
  handleRowSelect: (row: any) => void; // todo: add row type
}

export const ExpTable: React.VFC<ExpTableProps> = ({
  data,
  columns,
  expanded,
  handleExpanded,
}: ExpTableProps) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: handleExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>{table.getRowModel().rows.length} Rows</div>
    </div>
  );
};

export default ExpTable;
