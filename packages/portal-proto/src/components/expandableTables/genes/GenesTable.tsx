import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Gene, GeneSubRow, GenesTableProps } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { GTableControls } from "./GTableControls";
import { GTableFilters } from "./GTableFilters";
import { getGene, createTableColumn } from "./genesTableUtils";

export const GenesTable: React.VFC<GenesTableProps> = ({
  initialData,
  mutationCounts,
  filteredCases,
  cases,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: GenesTableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [search, setSearch] = useState("");
  const [columnListOrder, setColumnListOrder] = useState<string[]>([]);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  //   const [columnz, setColumnz] = useState([]);

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const useGeneTableFormat = useCallback(
    (initialData) => {
      return (initialData.genes || []).map((g) => {
        return getGene(
          g,
          selectedSurvivalPlot,
          mutationCounts,
          filteredCases,
          cases,
        );
      });
    },
    [initialData, selectedSurvivalPlot],
  );

  const transformResponse = useGeneTableFormat(initialData);

  const columnz = useMemo(() => {
    const cols = [];
    (Object.keys(transformResponse[0]) || []).map((tR) => {
      cols.push(createTableColumn(tR));
    });
    return cols;
  }, [transformResponse]);

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
          columns={columnz}
          expanded={expanded}
          handleExpanded={handleExpanded}
          handleRowSelect={handleRowSelect}
        />
      </div>

      {/* <Pagination /> */}
    </div>
  );
};
