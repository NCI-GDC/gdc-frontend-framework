// tanstack/react-table v8 functions trigger typescript linter
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect } from "react";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import CheckboxSpring from "./CheckboxSpring";
import AnimatedRow from "./AnimatedRow";
import { Row } from "@tanstack/react-table";
import { Genes, SomaticMutations } from "./types";
import { LoadingOverlay } from "@mantine/core";

export interface ExpTableProps<TData> {
  status: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  expanded: ExpandedState;
  handleExpandedProxy: (exp: ExpandedState) => void;
  selectAll: (type: string, rows: Row<Genes | SomaticMutations>) => void;
  allSelected: any;
  firstColumn: string;
  subrow: React.FC;
  sort: Record<string, string>;
  handleSortChange: (col: string, parity: string) => void;
}

export const ExpTable: React.FC<ExpTableProps> = ({
  status,
  data,
  columns,
  expanded,
  handleExpandedProxy,
  selectAll,
  allSelected,
  firstColumn,
  subrow,
  sort,
  handleSortChange,
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

  const selectAllActive =
    table.getRowModel().rows.length === 0
      ? false
      : table
          .getRowModel()
          .rows.filter((row) => !row.id.includes(".")) // exclude subrow from select-all condition
          .every((row) => row.original["select"] in allSelected);

  return (
    <div className="relative">
      <LoadingOverlay visible={status === "pending"} />
      <table className="w-full">
        <thead className="border-2 shadow-md">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {header.id === "select" &&
                        header.id !== `1_ _${firstColumn}` ? (
                          <CheckboxSpring
                            isActive={selectAllActive}
                            handleCheck={selectAll}
                            select={table.getRowModel().rows ?? []}
                            multi={true}
                          />
                        ) : null}
                        {[...Object.keys(sort)].includes(header.id) ? (
                          <div className="flex flex-col inline-block text-xs pl-3 align-middle text-base-content-light">
                            <button
                              className={`border border-green-500`}
                              onClick={() => handleSortChange(header.id, "asc")}
                              aria-sort={"ascending"}
                            >
                              <span
                                className={
                                  sort[header.id] === "asc" ? "text-white" : ""
                                }
                              >
                                up caret
                              </span>
                            </button>
                            <button
                              className={`border border-red-500`}
                              onClick={() =>
                                handleSortChange(header.id, "desc")
                              }
                              aria-sort={"descending"}
                            >
                              <span
                                className={
                                  sort[header.id] === "desc" ? "text-white" : ""
                                }
                              >
                                down caret
                              </span>
                            </button>
                          </div>
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
            </tr>
          ))}
        </thead>
        <tbody className="relative">
          {table.getRowModel().rows.map((row, index) => {
            return (
              <AnimatedRow
                key={index}
                row={row}
                index={index}
                selected={row.original["select"] in allSelected}
                subrow={subrow}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpTable;
