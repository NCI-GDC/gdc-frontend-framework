import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Gene, GenesTableProps, DEFAULT_GTABLE_ORDER } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { GTableControls } from "./GTableControls";
import { GTableFilters } from "./GTableFilters";
import { getGene, createTableColumn, GenesColumn } from "./genesTableUtils";
import { useSpring } from "react-spring";
import PageSize from "../shared/PageSize";
import PageStepper from "../shared/PageStepper";
import { searchContains } from "../shared/types";

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
  }, [visibleColumns, width, selectedGenes, geneID]);

  // todo: also reset expanded when pageSize/pageChanges (dont persist expanded across pages)
  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
  }, [visibleColumns, selectedGenes, searchTerm]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleGeneSave = (gene: Gene) => {
    console.log("gene", gene);
  };

  return (
    <div className={`w-full`}>
      <div className={`flex flex-row`}>
        <GTableControls
          selectedGenes={Object.keys(selectedGenes)?.length || 0}
          handleGeneSave={handleGeneSave}
        />
        <GTableFilters
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
      <div className={`flex flex-row m-auto`}>
        <div className="m-auto ml-0">
          <span className="my-auto mx-1 text-xs">Show</span>
          <PageSize pageSize={pageSize} handlePageSize={handlePageSize} />
          <span className="my-auto mx-1 text-xs">Entries</span>
        </div>
        <div className={`m-auto text-sm`}>
          <span>
            Showing
            <span className={`font-bold`}>{` ${page * pageSize + 1} `}</span>-
            <span className={`font-bold`}>{` ${(page + 1) * pageSize} `}</span>
            of
            <span className={`font-bold`}>
              {` ${transformResponse[0].genesTotal} `}
            </span>
            genes
          </span>
        </div>
        <div className={`m-auto mr-0`}>
          <PageStepper
            page={page}
            totalPages={Math.ceil(transformResponse[0].genesTotal / pageSize)}
            handlePage={handlePage}
          />
        </div>
      </div>
    </div>
  );
};
