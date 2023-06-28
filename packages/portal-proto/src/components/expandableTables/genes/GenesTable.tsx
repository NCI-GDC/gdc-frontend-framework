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
  buildCohortGqlOperator,
  joinFilters,
  useCoreDispatch,
  useCreateCaseSetFromFiltersMutation,
  useGetGeneTableSubrowQuery,
  usePrevious,
} from "@gff/core";
import { SummaryModalContext } from "src/utils/contexts";
import { ExpTable, Subrow } from "../shared";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { isEqual } from "lodash";
import { LoadingOverlay } from "@mantine/core";

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
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const [loading, setLoading] = useState(false);
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [geneID, setGeneID] = useState(undefined);
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const [columnType, setColumnType] = useState<columnFilterType>(null);

  // const mergeObjects = (obj1, obj2) => {
  //   const mergedObj = {
  //     mode: obj1.mode || obj2.mode,
  //     root: { ...obj1.root },
  //   };

  //   for (const key in obj2.root) {
  //     if (mergedObj.root.hasOwnProperty(key)) {
  //       const existingOperands = mergedObj.root[key].operands || [];
  //       const newOperands = obj2.root[key].operands || [];
  //       mergedObj.root[key] = {
  //         ...mergedObj.root[key],
  //         operands: Array.from(new Set([...existingOperands, ...newOperands])),
  //       };
  //     } else {
  //       mergedObj.root[key] = obj2.root[key];
  //     }
  //   }

  //   return mergedObj;
  // };

  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [response.isLoading]);

  const generateFilters = useCallback(
    async (type: columnFilterType, geneId: string) => {
      if (type === null) return;
      const cohortAndGenomic = buildCohortGqlOperator(
        joinFilters(cohortFilters, genomicFilters),
      );
      console.log({ cohortAndGenomic });

      return await createSet({ filters: cohortAndGenomic })
        .unwrap()
        .then((setId) => {
          const commonFilters: FilterSet = {
            mode: "and",
            root: {
              "cases.case_id": {
                field: "cases.case_id",
                operands: [`set_id:${setId}`],
                operator: "includes",
              },
              "genes.gene_id": {
                field: "genes.gene_id",
                operator: "includes",
                operands: [geneId],
              },
            },
          };

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
        });
    },
    [genomicFilters, cohortFilters],
  );

  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const coreDispatch = useCoreDispatch();
  const createCohort = async (name: string) => {
    const mainFilter = await generateFilters(columnType, geneID);
    console.log({ mainFilter });
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: mainFilter,
        name,
        message: "newCasesCohort",
      }),
    );
  };

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
      {loading && <LoadingOverlay visible />}
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
