// @ts-nocheck
import { useState, useMemo } from "react";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Gene, GeneSubRow, GenesTableProps } from "./types";

// export const renderSubComponent = ({ geneId }: { geneId : GeneSubRow }) => {
//     return <SubTableRow geneId={geneId}/>
// }

export const GenesTable: React.VFC<GenesTableProps> = ({
  data,
  columns,
  expanded,
}: // renderSubComponent,
// getRowCanExpand
GenesTableProps) => {
  return (
    <>
      <GTableControls />
      <ExpTable />
      <Pagination />
    </>
  );
};
