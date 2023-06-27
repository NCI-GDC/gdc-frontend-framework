import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { SomaticMutationsTableProps, SomaticMutations } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { getMutation, ssmsCreateTableColumn } from "./smTableUtils";
import {
  GDCSsmsTable,
  addNewCohortWithFilterAndMessage,
  joinFilters,
  useCoreDispatch,
  useGetSomaticMutationTableSubrowQuery,
  usePrevious,
} from "@gff/core";
import { SummaryModalContext } from "src/utils/contexts";
import { Column, ExpTable, Subrow } from "../shared";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { isEqual } from "lodash";

export const SomaticMutationsTable: React.FC<SomaticMutationsTableProps> = ({
  status,
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  selectedMutations,
  setSelectedMutations,
  handleSMTotal,
  columnListOrder,
  visibleColumns,
  handleSsmToggled = () => null,
  toggledSsms = [],
  geneSymbol = undefined,
  projectId = undefined,
  isDemoMode = false,
  isModal = false,
  combinedFilters,
}: SomaticMutationsTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [mutationID, setMutationID] = useState(undefined);

  const generateFilters = useCallback(
    (ssmId: string) => {
      return joinFilters(combinedFilters, {
        mode: "and",
        root: {
          "ssms.ssm_id": {
            field: "ssms.ssm_id",
            operator: "includes",
            operands: [ssmId],
          },
        },
      });
    },
    [combinedFilters],
  );

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
  const prevtransformResponse = usePrevious(transformResponse);
  useEffect(() => {
    if (!isEqual(prevtransformResponse, transformResponse)) {
      if (transformResponse[0]?.ssmsTotal)
        handleSMTotal(transformResponse[0].ssmsTotal);
      else handleSMTotal(0);
    }
  }, [handleSMTotal, prevtransformResponse, transformResponse]);

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

  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const coreDispatch = useCoreDispatch();
  const createCohort = (name: string) => {
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: generateFilters(mutationID),
        name,
        message: "newCasesCohort",
      }),
    );
  };

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
        setShowCreateCohort,
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
    setShowCreateCohort,
  ]);

  return (
    <>
      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohort(newName);
          }}
        />
      )}
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
