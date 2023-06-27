import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { GenesTableProps, columnFilterType } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { getGene, geneCreateTableColumn } from "./genesTableUtils";
import { Genes } from "./types";
import {
  FilterSet,
  addNewCohortWithFilterAndMessage,
  joinFilters,
  useCoreDispatch,
  useGetGeneTableSubrowQuery,
  usePrevious,
} from "@gff/core";
import { SummaryModalContext } from "src/utils/contexts";
import { ExpTable, Subrow } from "../shared";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { isEqual } from "lodash";

export const GenesTable: React.FC<GenesTableProps> = ({
  status,
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  toggledGenes,
  width,
  selectedGenes,
  setSelectedGenes,
  handleGTotal,
  columnListOrder,
  visibleColumns,
  isDemoMode = false,
  genomicFilters,
  cohortFilters,
  handleMutationCountClick,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [geneID, setGeneID] = useState(undefined);

  const [columnType, setColumnType] = useState<columnFilterType>(null);

  const generateFilters = useCallback(
    (type: columnFilterType, geneId: string) => {
      if (type === null) return;
      const cohortAndGenomic = joinFilters(cohortFilters, genomicFilters);
      const commonFilters: FilterSet = joinFilters(cohortAndGenomic, {
        mode: "and",
        root: {
          "genes.gene_id": {
            field: "genes.gene_id",
            operator: "includes",
            operands: [geneId],
          },
        },
      });
      if (type === "cnvgain") {
        return joinFilters(commonFilters, {
          mode: "and",
          root: {
            "cnvs.cnv_change": {
              field: "cnvs.cnv_change",
              operator: "includes",
              operands: ["Gain"],
            },
          },
        });
      } else if (type === "cnvloss") {
        return joinFilters(commonFilters, {
          mode: "and",
          root: {
            "cnvs.cnv_change": {
              field: "cnvs.cnv_change",
              operator: "includes",
              operands: ["Loss"],
            },
          },
        });
      } else {
        return joinFilters(commonFilters, {
          mode: "and",
          root: {
            "ssms.ssm_id": {
              field: "ssms.ssm_id",
              operator: "exists",
            },
          },
        });
      }
    },
    [genomicFilters, cohortFilters],
  );

  const useGeneTableFormat = useCallback(
    (initialData: Record<string, any>) => {
      const {
        cases,
        cnvCases,
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
          cnvCases,
          genes_total,
        );
      });
    },
    [selectedSurvivalPlot],
  );

  const transformResponse = useGeneTableFormat(initialData);

  const prevtransformResponse = usePrevious(transformResponse);

  useEffect(() => {
    if (!isEqual(prevtransformResponse, transformResponse)) {
      if (transformResponse[0]?.genesTotal)
        handleGTotal(transformResponse[0].genesTotal);
      else handleGTotal(0);
    }
  }, [handleGTotal, prevtransformResponse, transformResponse]);

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

  const prevInitialData = usePrevious(initialData);
  useEffect(() => {
    if (!isEqual(prevInitialData, initialData)) {
      setExpanded({});
      setExpandedId(undefined);
      setExpandedProxy({});
    }
  }, [initialData, prevInitialData]);

  const { setEntityMetadata } = useContext(SummaryModalContext);

  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const coreDispatch = useCoreDispatch();
  const createCohort = (name: string) => {
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: generateFilters(columnType, geneID),
        name,
        message: "newCasesCohort",
      }),
    );
  };

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const columns = useMemo<ColumnDef<Genes>[]>(() => {
    return visibleColumns
      .map(({ id }) => id)
      .map((accessor) => {
        return geneCreateTableColumn({
          accessor,
          selectedGenes,
          setSelectedGenes,
          handleSurvivalPlotToggled,
          handleGeneToggled,
          toggledGenes,
          setGeneID,
          isDemoMode,
          setEntityMetadata,
          genomicFilters,
          handleMutationCountClick,
          setColumnType,
          setShowCreateCohort,
        });
      });
  }, [
    visibleColumns,
    selectedGenes,
    setSelectedGenes,
    setGeneID,
    genomicFilters,
    toggledGenes,
    handleGeneToggled,
    isDemoMode,
    setEntityMetadata,
    handleSurvivalPlotToggled,
    handleMutationCountClick,
    setColumnType,
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
        selectAll={setSelectedGenes}
        allSelected={selectedGenes}
        firstColumn={columnListOrder[0].id}
        subrow={
          <Subrow
            id={geneID}
            width={width}
            query={useGetGeneTableSubrowQuery}
            subrowTitle={`# SSMS Affected Cases Across The GDC`}
          />
        }
      />
    </>
  );
};
