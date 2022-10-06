import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Gene, GenesTableProps, DEFAULT_GTABLE_ORDER } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { GTableControls } from "./GTableControls";
import { GTableFilters } from "./GTableFilters";
import { getGene, createTableColumn } from "./genesTableUtils";
import { GenesColumns } from "@/features/shared/table-utils";
import { useSpring } from "react-spring";
import PageSize from "../shared/PageSize";

export const GenesTable: React.VFC<GenesTableProps> = ({
  initialData,
  mutationCounts,
  filteredCases,
  cases,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  pageSize,
  handlePageSize,
  offset,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<any>({});
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [searchTerm, setSearchTerm] = useState("");
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_GTABLE_ORDER);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_GTABLE_ORDER.filter((col) => col.visible),
  );

  const searchContains = (obj: any, field: string) => {
    return obj[`${field}`].toLowerCase().includes(searchTerm.toLowerCase());
  };

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
    return Math.floor(w / vc.length); // todo: decide what to show w/ no columns selected
  };

  const partitionWidth = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: getSpringWidth(width, visibleColumns), opacity: 1 },
  });

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const selectGene = (row: any) => {
    const gene = row.original["geneID"];
    if (gene in selectedGenes) {
      // deselect single row
      setSelectedGenes((currentMap) => {
        const newMap = { ...currentMap };
        delete newMap[gene];
        return newMap;
      });
    } else {
      // select single row
      setSelectedGenes((currentMap) => {
        return { ...currentMap, [gene]: row };
      });
    }
  };

  const selectAllGenes = (rows: any) => {
    if (rows.every((row) => row.original["select"] in selectedGenes)) {
      // deselect all
      setSelectedGenes((currentMap) => {
        const newMap = { ...currentMap };
        rows.forEach((row) => delete newMap[row.original["select"]]);
        return newMap;
      });
    } else {
      // select all
      setSelectedGenes((currentMap) => {
        const newMap = { ...currentMap };
        rows.forEach((row) => {
          if (
            !row.id.includes(".") &&
            !(row.original["select"] in currentMap)
          ) {
            newMap[row.original["select"]] = row;
          }
        });
        return newMap;
      });
    }
  };

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const columns = useMemo<ColumnDef<GenesColumns>[]>(() => {
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
        );
      });
  }, [visibleColumns, width, selectedGenes]);

  // todo: also reset expanded when pageSize/pageChanges (dont persist expanded across pages)
  useEffect(() => {
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

  // todo add total
  // data.genes.genes_total
  const pageDisplay = `Showing ${offset * pageSize + 1} - ${
    (offset + 1) * pageSize
  } of ten million genes`;

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
                searchContains(tr, field),
              )
            ) {
              return tr;
            }
          })}
          columns={columns}
          expanded={expanded}
          handleExpandedProxy={handleExpandedProxy}
          selectAll={selectAllGenes}
          allSelected={selectedGenes}
          firstColumn={columnListOrder[0].id}
          headerWidth={width / visibleColumns.length}
        />
      </div>
      {/* justify-start items-center*/}
      <div className={`flex flex-row justify-between`}>
        <div className="flex flex-row m-auto ml-2">
          <span className="my-auto mx-1 text-xs">Show</span>
          <PageSize pageSize={pageSize} handlePageSize={handlePageSize} />
          <span className="my-auto mx-1 text-xs">Entries</span>
        </div>
        <div className={`m-auto`}>{pageDisplay}</div>
        <div className={`m-auto mr-2`}>paginator</div>
        {/* <Pagination
          size="sm"
          radius="md"
          color="accent"
          className="ml-auto"
          page={offset}
          onChange={(x) => handlePageChange(x)}
          total={pages}
        />  */}
      </div>
    </div>
  );
};
