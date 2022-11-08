import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  SomaticMutationsTableProps,
  DEFAULT_SMTABLE_ORDER,
  SomaticMutations,
} from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { getMutation, createTableColumn } from "./smTableUtils";
import { useSpring } from "react-spring";
import { searchContains } from "../shared/sharedTableUtils";
import { TableFilters } from "../shared/TableFilters";
import { useGetSomaticMutationTableSubrowQuery } from "@gff/core";
import { Subrow } from "../shared/Subrow";

export const SomaticMutationsTable: React.FC<SomaticMutationsTableProps> = ({
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  pageSize,
  page,
  selectedMutations,
  setSelectedMutations,
  handleSMTotal,
}: SomaticMutationsTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_SMTABLE_ORDER);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_SMTABLE_ORDER.filter((col) => col.visible),
  );
  const [mutationID, setMutationID] = useState(undefined);

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

  const transformResponse = useSomaticMutationsTableFormat(initialData);

  useEffect(() => {
    if (transformResponse[0]?.ssmsTotal)
      handleSMTotal(transformResponse[0].ssmsTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformResponse]);

  const handleExpandedProxy = (exp: ExpandedState) => {
    setExpandedProxy(exp);
  };
  // `exp` is non-mutable within the lexical scope of handleExpandedProxy
  //  this effect hook is a workaround that updates expanded after expandedProxy updates
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const columns = useMemo<ColumnDef<SomaticMutations>[]>(() => {
    return visibleColumns
      .map(({ id }) => id)
      .map((accessor) => {
        return createTableColumn(
          accessor,
          width,
          partitionWidth,
          visibleColumns,
          selectedMutations,
          setSelectedMutations,
          handleSurvivalPlotToggled,
          setMutationID,
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns, width, selectedMutations, mutationID, setMutationID]);

  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
  }, [visibleColumns, selectedMutations, searchTerm, page, pageSize]);

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
          selectAll={setSelectedMutations}
          allSelected={selectedMutations}
          firstColumn={columnListOrder[0].id}
          headerWidth={width / visibleColumns.length}
          subrow={
            <Subrow
              id={mutationID}
              width={width}
              query={useGetSomaticMutationTableSubrowQuery}
              subrowTitle={`Affected Cases Across The GDC`}
            />
          }
        />
      </div>
    </div>
  );
};

export default SomaticMutationsTable;
