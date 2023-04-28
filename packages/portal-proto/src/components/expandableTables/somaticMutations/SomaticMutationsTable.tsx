import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { SomaticMutationsTableProps, SomaticMutations } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { getMutation, ssmsCreateTableColumn } from "./smTableUtils";
import { GDCSsmsTable, useGetSomaticMutationTableSubrowQuery } from "@gff/core";
import { Subrow } from "../shared/Subrow";
import { Column } from "@/components/expandableTables/shared/types";
import { SummaryModalContext } from "src/utils/contexts";

export const SomaticMutationsTable: React.FC<SomaticMutationsTableProps> = ({
  status,
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
  handleSsmToggled = () => null,
  toggledSsms = [],
  geneSymbol = undefined,
  projectId = undefined,
  isDemoMode = false,
  isModal = false,
}: SomaticMutationsTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [mutationID, setMutationID] = useState(undefined);

  const useSomaticMutationsTableFormat = useCallback(
    (initialData: GDCSsmsTable) => {
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
    else handleSMTotal(0);

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

  const { setEntityMetadata } = useContext(SummaryModalContext);

  const columns = useMemo<ColumnDef<SomaticMutations>[]>(() => {
    return visibleColumns.map(({ id: accessor }: Column) => {
      return ssmsCreateTableColumn({
        accessor,
        selectedMutations,
        setSelectedMutations,
        handleSurvivalPlotToggled,
        setMutationID,
        handleSsmToggled,
        toggledSsms,
        geneSymbol,
        projectId,
        isDemoMode,
        setEntityMetadata,
        isModal,
      });
    });
  }, [
    visibleColumns,
    geneSymbol,
    projectId,
    selectedMutations,
    handleSsmToggled,
    setSelectedMutations,
    toggledSsms,
    isDemoMode,
    isModal,
    setMutationID,
    handleSurvivalPlotToggled,
    setEntityMetadata,
  ]);

  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
  }, [visibleColumns, selectedMutations, searchTerm, page, pageSize]);

  return (
    <>
      <ExpTable
        status={status}
        data={transformResponse}
        columns={columns}
        expanded={expanded}
        handleExpandedProxy={handleExpandedProxy}
        selectAll={setSelectedMutations}
        allSelected={selectedMutations}
        firstColumn={columnListOrder[0].id}
        subrow={
          <Subrow
            id={mutationID}
            width={width}
            query={useGetSomaticMutationTableSubrowQuery}
            subrowTitle={`Affected Cases Across The GDC`}
          />
        }
      />
    </>
  );
};

export default SomaticMutationsTable;
