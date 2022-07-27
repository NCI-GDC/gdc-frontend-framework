// @ts-nocheck
import React, {
  HTMLProps,
  useReducer,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { GenesColumns, makeData } from "./table-utils";

const ExpandableTable: React.FC<any> = () => {
  const columns = React.useMemo<ColumnDef<GenesColumns>[]>(
    () => [
      {
        header: " ",
        footer: (props) => props.column.id,
        cell: ({ row, getValue }) => (
          <>
            {row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
              >
                {row.getIsExpanded() ? ">" : "<"}
              </button>
            ) : (
              "testing"
            )}{" "}
            {getValue()}
          </>
        ),
        columns: [
          {
            accessorKey: "subRows",
            header: "# SSMS Affected Cases Across the GDC",
            cell: ({ row, getValue }) => (
              <>
                {row.getCanExpand() ? (
                  <button
                    {...{
                      onClick: () => {
                        row.toggleExpanded();
                      },
                      style: { cursor: "pointer" },
                    }}
                  >
                    {row.getIsExpanded() ? ">" : "<"}
                  </button>
                ) : (
                  `${row.original.description} ${row.original.title}`
                )}{" "}
              </>
            ),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        accessorKey: "symbol",
        cell: (info) => info.getValue(),
        header: () => <button>Symbol</button>,
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [data, setData] = React.useState(() => makeData(5, 5, 3));

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // debugTable: true,
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

export default ExpandableTable;
