// tanstack/react-table v8 functions trigger typescript linter
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
import CheckboxSpring from "./CheckboxSpring";
import AnimatedRow from "./AnimatedRow";
import { Row } from "@tanstack/react-table";
import { Genes, SomaticMutations } from "./types";

export interface ExpTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  expanded: ExpandedState;
  handleExpandedProxy: (exp: ExpandedState) => void;
  selectAll: (type: string, rows: Row<Genes | SomaticMutations>) => void;
  allSelected: any;
  firstColumn: string;
  headerWidth: number;
  subrow: React.FC;
}

export const ExpTable: React.FC<ExpTableProps> = ({
  data,
  columns,
  expanded,
  handleExpandedProxy,
  selectAll,
  allSelected,
  firstColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  headerWidth,
  subrow,
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
    <>
      <div
        className={`${
          selectAllActive ? `border-r-0 border-b-4 border-activeColor` : ``
        }`}
      >
        <table className="w-full">
          <thead
            className={`
            ${
              selectAllActive
                ? `border-l-4 border-t-4 border-r-4 border-activeColor`
                : `border-2`
            }
            shadow-md`}
          >
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
          <tbody>
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
    </>
  );
};

export default ExpTable;
