import React, { useState, useMemo, useEffect } from "react";
// import {
//   ExpandedState,
//   useReactTable,
//   getCoreRowModel,
//   getExpandedRowModel,
//   ColumnDef,
//   flexRender,
// } from "@tanstack/react-table";
import { Gene, GeneSubRow, GenesTableProps } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { GTableControls } from "./GTableControls";
import { GTableFilters } from "./GTableFilters";

export const GenesTable: React.VFC<GenesTableProps> = ({
  initialData,
  columns,
}: GenesTableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [search, setSearch] = useState("");
  const [columnListOrder, setColumnListOrder] = useState<string[]>([]);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);

  // when columnOrder updates, update memoized columns
  // type of updates: toggle visibility off/on or swap order

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleRowSelect = (rowUpdate) => {
    // abstract obj add&delete
    //setSelectedGenes(rowUpdate)
  };

  const handleExpanded = (exp: ExpandedState) => {
    // onclick: setExpanded(exp)
    // pageSize, sort change: do nothing
    // page change, search filter: reset/setExpanded({})
    console.log("exp state", exp);
  };

  const handleGeneSave = (gene: Gene) => {
    console.log("gene", gene);
  };

  const handleColumnChange = (colUpdate: any) => {
    console.log("colupdate", colUpdate);
  };

  return (
    <div>
      <div className={`flex flex-row justify-between`}>
        <GTableControls
          selectedGenes={selectedGenes}
          handleGeneSave={handleGeneSave}
        />
        <GTableFilters
          search={search}
          handleSearch={handleSearch}
          columnListOrder={columnListOrder}
          handleColumnChange={handleColumnChange}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
        />
      </div>
      <div className={`flex flex-row`}>
        <ExpTable
          data={initialData}
          columns={columns}
          expanded={expanded}
          handleExpanded={handleExpanded}
          handleRowSelect={handleRowSelect}
        />
      </div>

      {/* <Pagination /> */}
    </div>
  );
};
