import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Gene, GenesTableProps, DEFAULT_GTABLE_ORDER } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { TableControls } from "../shared/TableControls";
import { TableFilters } from "../shared/TableFilters";
import { getGene, createTableColumn, GenesColumn } from "./genesTableUtils";
import { useSpring } from "react-spring";
import PageSize from "../shared/PageSize";
import PageStepper from "../shared/PageStepper";
import { searchContains } from "../shared/types";
// import gene menu options

export const GenesTable: React.FC<GenesTableProps> = ({
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  pageSize,
  handlePageSize,
  page,
  handlePage,
  selectedGenes,
  selectGene,
  selectAll,
  handleGTotal,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<any>({});
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_GTABLE_ORDER);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_GTABLE_ORDER.filter((col) => col.visible),
  );
  const [geneID, setGeneID] = useState(undefined);

  const useGeneTableFormat = useCallback(
    (initialData) => {
      const {
        cases,
        // cnvCases,
        mutationCounts,
        filteredCases,
        genes,
        genes_total,
      } = initialData;
      return genes.map((gene) => {
        return getGene(
          gene,
          selectedSurvivalPlot,
          mutationCounts,
          filteredCases,
          cases,
          genes_total,
        );
      });
    },
    [selectedSurvivalPlot],
  );

  const transformResponse = useGeneTableFormat(initialData);

  useEffect(() => {
    handleGTotal(transformResponse[0].genesTotal);
  }, [transformResponse]);

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
    return Math.floor(w / vc.length); // todo: decide what to show w/ no columns selected
  };

  const partitionWidth = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: getSpringWidth(width, visibleColumns), opacity: 1 },
  });

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const columns = useMemo<ColumnDef<GenesColumn>[]>(() => {
    return visibleColumns
      .map(({ id }) => id)
      .map((accessor) => {
        return createTableColumn(
          accessor,
          width,
          partitionWidth,
          visibleColumns,
          selectedGenes,
          selectGene,
          handleSurvivalPlotToggled,
          setGeneID,
          geneID,
        );
      });
  }, [visibleColumns, width, selectedGenes, geneID, setGeneID]);

  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
    //
  }, [visibleColumns, selectedGenes, page, searchTerm, pageSize]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className={`w-full`}>
      <div className={`flex flex-row float-right mb-5`}>
        <TableFilters
          search={searchTerm}
          handleSearch={handleSearch}
          columnListOrder={columnListOrder}
          handleColumnChange={handleColumnChange}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
          defaultColumns={DEFAULT_GTABLE_ORDER}
        />
      </div>
      <div className={`flex flex-row w-10/12`}>
        <ExpTable
          data={transformResponse.filter((tr) => {
            if (
              ["geneID", "symbol", "name"].some((field) =>
                searchContains(tr, field, searchTerm),
              )
            ) {
              return tr;
            }
          })}
          columns={columns}
          expanded={expanded}
          handleExpandedProxy={handleExpandedProxy}
          selectAll={selectAll}
          allSelected={selectedGenes}
          firstColumn={columnListOrder[0].id}
          headerWidth={width / visibleColumns.length}
        />
      </div>
    </div>
  );
};
