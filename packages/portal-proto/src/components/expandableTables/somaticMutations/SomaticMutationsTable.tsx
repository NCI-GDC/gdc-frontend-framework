import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  SomaticMutationsTableProps,
  DEFAULT_SMTABLE_ORDER,
  SomaticMutation,
} from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
// import { SMTableControls } from "./MTableControls";
// import { SMTableFilters } from "./MTableFilters";
import {
  getMutation,
  createTableColumn,
  MutationsColumn,
} from "./smTableUtils";
import { useSpring } from "react-spring";
import PageSize from "../shared/PageSize";
import PageStepper from "../shared/PageStepper";
import { GTableControls } from "../genes/GTableControls";
import { searchContains } from "../shared/types";
import { GTableFilters } from "../genes/GTableFilters";

export const SomaticMutationsTable: React.FC<SomaticMutationsTableProps> = ({
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  pageSize,
  handlePageSize,
  offset,
  handleOffset,
  selectedMutations,
  selectMutation,
  selectAll,
}: SomaticMutationsTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<any>({});
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_SMTABLE_ORDER);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_SMTABLE_ORDER.filter((col) => col.visible),
  );

  const useSomaticMutationsTableFormat = useCallback(
    (initialData) => {
      const { cases, filteredCases, ssmsTotal, ssms } = initialData;
      return ssms.map((sm) => {
        return getMutation(
          sm,
          selectedSurvivalPlot,
          filteredCases,
          cases,
          ssmsTotal,
        );
      });
    },
    [selectedSurvivalPlot],
  );

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
  const columns = useMemo<ColumnDef<MutationsColumn>[]>(() => {
    return visibleColumns
      .map(({ id }) => id)
      .map((accessor) => {
        return createTableColumn(
          accessor,
          width,
          partitionWidth,
          visibleColumns,
          selectedMutations,
          selectMutation,
          handleSurvivalPlotToggled,
        );
      });
  }, [visibleColumns, width, selectedMutations]);

  // todo: also reset expanded when pageSize/pageChanges (dont persist expanded across pages)
  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
  }, [visibleColumns, selectedMutations, searchTerm]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleMutationSave = (mutation: SomaticMutation) => {
    console.log("mutation", mutation);
  };

  const transformResponse = useSomaticMutationsTableFormat(initialData);

  return (
    <div className={`w-full`}>
      <div className={`flex flex-row`}>
        <GTableControls
          selectedGenes={Object.keys(selectedMutations)?.length || 0}
          handleGeneSave={handleMutationSave}
        />
        <GTableFilters
          search={searchTerm}
          handleSearch={handleSearch}
          columnListOrder={columnListOrder}
          handleColumnChange={handleColumnChange}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
          defaultColumns={DEFAULT_SMTABLE_ORDER}
        />
      </div>
      <div className={`flex flex-row w-10/12`}>
        <ExpTable
          data={transformResponse.filter((tr) => {
            if (
              ["mutationID", "type", "DNAChange"].some((field) =>
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
          allSelected={selectedMutations}
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
            <span className={`font-bold`}>{` ${offset * pageSize + 1} `}</span>-
            <span className={`font-bold`}>
              {` ${(offset + 1) * pageSize} `}
            </span>
            of
            <span className={`font-bold`}>
              {` ${transformResponse[0].genesTotal} `}
            </span>
            genes
          </span>
        </div>
        <div className={`m-auto mr-0`}>
          <PageStepper
            offset={offset}
            totalPages={Math.ceil(transformResponse[0].genesTotal / pageSize)}
            handleOffset={handleOffset}
          />
        </div>
      </div>
    </div>
  );
};

export default SomaticMutationsTable;
