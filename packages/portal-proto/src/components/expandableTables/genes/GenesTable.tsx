// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
// import {
//   ExpandedState,
//   useReactTable,
//   getCoreRowModel,
//   getExpandedRowModel,
//   ColumnDef,
//   flexRender,
// } from "@tanstack/react-table";
import { Gene, GeneSubRow, GenesTableProps } from "./types";

// export const renderSubComponent = ({ geneId }: { geneId : GeneSubRow }) => {
//     return <SubTableRow geneId={geneId}/>
// }

export const GenesTable: React.VFC<GenesTableProps> = ({
  initialData,
  columns,
  expanded,
}: // renderSubComponent,
// getRowCanExpand
GenesTableProps) => {
  return (
    <>
      genestable
      {/* <GTableControls /> */}
      {/* <ExpTable /> */}
      {/* <Pagination /> */}
    </>
  );
};
