import React, { useState, useEffect, useCallback } from "react";
import { Gene, GenesTableProps, DEFAULT_GTABLE_ORDER } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { GTableControls } from "./GTableControls";
import { GTableFilters } from "./GTableFilters";
import { getGene, createTableColumn } from "./genesTableUtils";
import { GenesColumns } from "@/features/shared/table-utils";
import { useSpring } from "react-spring";

export const GenesTable: React.VFC<GenesTableProps> = ({
  initialData,
  mutationCounts,
  filteredCases,
  cases,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  height,
  spring,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<any>({});
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [search, setSearch] = useState("");
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_GTABLE_ORDER);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_GTABLE_ORDER.filter((col) => col.visible),
  );

  const useGeneTableFormat = useCallback(
    (initialData) => {
      return initialData.genes.map((g) => {
        return getGene(
          g,
          selectedSurvivalPlot,
          mutationCounts,
          filteredCases,
          cases,
        );
      });
    },
    [selectedSurvivalPlot],
  );

  const transformResponse = useGeneTableFormat(initialData);

  const handleExpandedProxy = (exp: ExpandedState) => {
    setExpandedProxy(exp);
  };
  // `exp` is non-mutable within the lexical scope of handleExpandedProxy
  //  console logging `exp` returns a function (???)
  //  this effect hook is a workaround that updates expanded wrt expandedProxy
  useEffect(() => {
    const proxy = Object.keys(expandedProxy);
    const exp = Object.keys(expanded);
    // before: no rows expanded, after: 1 row expanded
    if (proxy.length === 1 && exp.length === 0) {
      setExpandedId(Number(proxy[0]));
      setExpanded(expandedProxy);
    }
    // before: 1 row expanded, after: none expanded
    if (proxy.length === 0) {
      setExpandedId(undefined);
      setExpanded({});
    }
    // before: 1 row expanded, after: new row expanded, initial row unexpanded
    if (proxy.length === 2) {
      const subsequentExpandId = Number(
        proxy.filter((key) => Number(key) !== expandedId)[0],
      );
      setExpandedId(subsequentExpandId);
      setExpanded({ [subsequentExpandId]: true });
      setExpandedProxy({ [subsequentExpandId]: true }); // this line used for rerender
    }
  }, [expandedProxy]);

  const getSpringWidth = (w, vc) => {
    return Math.floor(w) / vc.length;
  };

  const partitionWidth = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: getSpringWidth(width, visibleColumns), opacity: 1 },
  });

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const columns = React.useMemo<ColumnDef<GenesColumns>[]>(() => {
    return columnListOrder
      .filter((col) => col.visible)
      .map(({ id }) => id)
      .map((accessor) => {
        return createTableColumn(
          accessor,
          // todo
          // height spring needs to know what gene row is clicked for allocated height
          spring,
          width,
          partitionWidth,
          height,
          visibleColumns,
        );
      });
  }, [visibleColumns, width]);
  // transformResponse, expanded,

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleRowSelect = (rowUpdate) => {
    // abstract obj add&delete
    //setSelectedGenes(rowUpdate)
  };

  const handleGeneSave = (gene: Gene) => {
    console.log("gene", gene);
  };

  return (
    <div className={`w-full`}>
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
      <div className={`flex flex-row w-10/12`}>
        <ExpTable
          data={transformResponse}
          columns={columns}
          expanded={expanded}
          handleExpandedProxy={handleExpandedProxy}
          handleRowSelect={handleRowSelect}
        />
      </div>
      <div className="flex flex-row items-center justify-start border-t border-base-light">
        <p className="px-2">Page Size:</p>
        {/* <Select
          size="sm"
          radius="md"
          onChange={handlePageSizeChange}
          value={pageSize.toString()}
          data={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "40", label: "40" },
            { value: "100", label: "100" },
          ]}
        />
        <Pagination
          size="sm"
          radius="md"
          color="accent"
          className="ml-auto"
          page={activePage}
          onChange={(x) => handlePageChange(x)}
          total={pages}
        /> */}
      </div>
    </div>
  );
};
