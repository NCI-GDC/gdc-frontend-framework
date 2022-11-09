import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SomaticMutationsTableProps, SomaticMutations } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { getMutation, createTableColumn } from "./smTableUtils";
import { useSpring } from "react-spring";
import { searchContains } from "../shared/sharedTableUtils";
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
  columnListOrder,
  visibleColumns,
  searchTerm,
}: SomaticMutationsTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
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
    return Math.floor(w / vc.length);
  };

  const partitionWidth = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: getSpringWidth(width, visibleColumns), opacity: 1 },
  });

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

  return (
    <div>
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
  );
};

export default SomaticMutationsTable;
