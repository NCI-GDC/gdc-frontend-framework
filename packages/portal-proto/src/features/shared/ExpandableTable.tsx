// @ts-nocheck
import React, { useState } from "react";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { GenesColumns, makeData } from "./table-utils";
import { SubTableRow } from "./SubTableRow";

const ExpandableTable: React.FC<any> = () => {
  const columns = React.useMemo<ColumnDef<GenesColumns>[]>(
    () => [
      {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "SSMSAffectedCasesAcrossTheGDC",
            header: ({ table }) => {
              return <>SSMS Affected Cases Across The GDC</>;
            },
            cell: ({ row, getValue }) => (
              <div
                className="w-fit h-fit"
                style={{
                  paddingLeft: `${row.depth * 2}rem`,
                }}
              >
                <>
                  {row.getCanExpand() ? (
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: { cursor: "pointer" },
                      }}
                    >
                      {row.getIsExpanded() ? "👇" : "👉"}
                    </button>
                  ) : (
                    <SubTableRow geneId={"ENSG00000133703"}></SubTableRow>
                  )}
                  {""}
                  {}
                </>
              </div>
            ),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "name",
            header: ({ table }) => (
              <>
                <div
                  style={{
                    marginLeft: `15px`,
                  }}
                >
                  Name
                </div>
              </>
            ),
            cell: ({ row, getValue }) => (
              <div>
                <>
                  {row.getCanExpand() ? <></> : null}{" "}
                  <div
                    style={{
                      marginLeft: `15px`,
                    }}
                  >
                    {getValue()}
                  </div>
                </>
              </div>
            ),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "survival",
            header: ({ table }) => (
              <>
                <div
                  style={{
                    marginLeft: `15px`,
                  }}
                >
                  {" "}
                  Survival
                </div>
              </>
            ),
            cell: ({ row, getValue }) => (
              <div>
                <>
                  {row.getCanExpand() ? <></> : null}{" "}
                  <div
                    style={{
                      marginLeft: `15px`,
                    }}
                  >
                    {getValue()}
                  </div>
                </>
              </div>
            ),
            footer: (props) => props.column.id,
          },
        ],
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
