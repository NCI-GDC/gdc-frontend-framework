import {
  useGenesTable,
  FilterSet,
  usePrevious,
  useCreateGeneSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  useGeneSetCountQuery,
  useGeneSetCountsQuery,
  useAppendToGeneSetMutation,
  useRemoveFromGeneSetMutation,
  joinFilters,
  buildCohortGqlOperator,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
  useCreateCaseSetFromFiltersMutation,
  extractFiltersWithPrefixFromFilterSet,
  GDCGenesTable,
} from "@gff/core";
import { useContext, useEffect, useMemo, useState } from "react";
import FunctionButton from "@/components/FunctionButton";
import { Loader, Text, LoadingOverlay } from "@mantine/core";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName, statusBooleansToDataStatus } from "src/utils";
import download from "src/utils/download";
import { SummaryModalContext } from "@/utils/contexts";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import { CountsIcon } from "@/components/tailwindComponents";
import { Gene, GeneToggledHandler, columnFilterType } from "./types";
import { useGenerateGenesTableColumns, getGene } from "./utils";
import { ButtonTooltip } from "@/components/ButtonTooltip";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import GenesTableSubcomponent from "./GenesTableSubcomponent";
import { convertDateToString } from "@/utils/date";
import { useDeepCompareCallback } from "use-deep-compare";

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
  genomicFilters?: FilterSet;
  cohortFilters?: FilterSet;
  toggledGenes?: ReadonlyArray<string>;
  isDemoMode?: boolean;
}

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  genomicFilters,
  cohortFilters,
  toggledGenes = [],
  isDemoMode = false,
  handleMutationCountClick,
}: GTableContainerProps) => {
  /* States for table */
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadMutatedGenesJSONActive, setDownloadMutatedGenesJSONActive] =
    useState(false);
  const [downloadMutatedGenesTSVActive, setDownloadMutatedGenesTSVActive] =
    useState(false);
  const dispatch = useCoreDispatch();
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const [columnType, setColumnType] = useState<columnFilterType>(null);
  const [geneID, setGeneID] = useState<string | undefined>(undefined);

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */

  /* GeneTable call */
  const { data, isSuccess, isFetching, isError } = useGenesTable({
    pageSize: pageSize,
    offset: (page - 1) * pageSize,
    searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
  });
  /* GeneTable call end */

  /* Extract only the "genes." filters */
  const genesOnlyFilters = extractFiltersWithPrefixFromFilterSet(
    genomicFilters,
    "genes.",
  );

  /* Create Cohort*/
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [response.isLoading]);

  const generateFilters = useDeepCompareCallback(
    async (type: columnFilterType, geneId: string) => {
      if (type === null) return;
      let caseSetCreationFilters = buildCohortGqlOperator(
        joinFilters(cohortFilters, genomicFilters),
      );

      // for CNV gain/loss only "genes." filters should be applied
      // as the counts in the table are based on genes only
      // ssms filters will not affect the counts
      if (type === "cnvgain" || type === "cnvloss") {
        caseSetCreationFilters = buildCohortGqlOperator(
          joinFilters(cohortFilters, genesOnlyFilters),
        );
      }

      return await createSet({ filters: caseSetCreationFilters })
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
              ...genomicFilters?.root,
            },
          };

          // for CNV gain/loss only "genes." filters should be added to the
          // new cohort
          const commonFiltersWithGenesOnly: FilterSet = {
            mode: "and",
            root: {
              "cases.case_id": {
                field: "cases.case_id",
                operands: [`set_id:${setId}`],
                operator: "includes",
              },
              ...genesOnlyFilters?.root,
            },
          };

          if (type === "cnvgain") {
            // only genes filters
            return joinFilters(commonFiltersWithGenesOnly, {
              mode: "and",
              root: {
                "genes.cnv.cnv_change": {
                  field: "genes.cnv.cnv_change",
                  operator: "=",
                  operand: "gain",
                },
                "genes.gene_id": {
                  field: "genes.gene_id",
                  operator: "=",
                  operand: geneId,
                },
              },
            });
          } else if (type === "cnvloss") {
            // only genes filters
            return joinFilters(commonFiltersWithGenesOnly, {
              mode: "and",
              root: {
                "genes.cnv.cnv_change": {
                  field: "genes.cnv.cnv_change",
                  operator: "=",
                  operand: "loss",
                },
                "genes.gene_id": {
                  field: "genes.gene_id",
                  operator: "=",
                  operand: geneId,
                },
              },
            });
          } else {
            // any other type will use all filters
            return joinFilters(commonFilters, {
              mode: "and",
              root: {
                "ssms.ssm_id": {
                  field: "ssms.ssm_id",
                  operator: "exists",
                },
                "genes.gene_id": {
                  field: "genes.gene_id",
                  operator: "includes",
                  operands: [geneId],
                },
              },
            });
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cohortFilters, genomicFilters, createSet, genesOnlyFilters?.root],
  );

  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const createCohort = async (name: string) => {
    const mainFilter = await generateFilters(columnType, geneID);

    dispatch(
      addNewCohortWithFilterAndMessage({
        filters: mainFilter,
        name,
        message: "newCasesCohort",
      }),
    );
  };
  /* End Create Cohort */

  const sets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);
  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(1);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  const useGeneTableFormat = (initialData: GDCGenesTable): Gene[] => {
    const { cases, cnvCases, mutationCounts, filteredCases, genes } =
      initialData;

    return genes.map((gene) => {
      return getGene(
        gene,
        selectedSurvivalPlot,
        mutationCounts,
        filteredCases,
        cases,
        cnvCases,
      );
    });
  };

  const formattedTableData: Gene[] = useGeneTableFormat(data?.genes);

  const pagination = useMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.genes?.genes_total / pageSize),
          size: pageSize,
          total: data?.genes?.genes_total,
          sort: "None",
          label: "genes",
        }
      : {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
        };
  }, [pageSize, page, data?.genes?.genes_total, isSuccess]);

  const genesTableDefaultColumns = useGenerateGenesTableColumns({
    handleSurvivalPlotToggled,
    handleGeneToggled,
    toggledGenes,
    isDemoMode,
    setEntityMetadata,
    genomicFilters,
    setColumnType,
    setGeneID,
    setShowCreateCohort,
    handleMutationCountClick,
  });

  const getRowId = (originalRow: Gene) => {
    return originalRow.gene_id;
  };
  const [rowSelection, setRowSelection] = useState({});
  const selectedGenes = Object.entries(rowSelection)?.map(
    ([gene_id]) => gene_id,
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    genesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    gene_id: false,
    cytoband: false,
    type: false,
  });

  const setFilters =
    selectedGenes.length > 0
      ? ({
          root: {
            "genes.gene_id": {
              field: "genes.gene_id",
              operands: selectedGenes,
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : joinFilters(cohortFilters, genomicFilters);

  const handleJSONDownload = async () => {
    const tableFilters =
      buildCohortGqlOperator(joinFilters(cohortFilters, genomicFilters)) ?? {};
    setDownloadMutatedGenesJSONActive(true);
    await download({
      endpoint: "genes",
      method: "POST",
      params: {
        filters: tableFilters,
        attachment: true,
        format: "JSON",
        pretty: true,
        fields: [
          "biotype",
          "symbol",
          "cytoband",
          "name",
          "gene_id",
          "is_cancer_gene_census",
        ].join(","),
      },
      dispatch,
      done: () => setDownloadMutatedGenesJSONActive(false),
    });
  };

  const handleTSVDownload = async () => {
    setDownloadMutatedGenesTSVActive(true);
    await download({
      endpoint: "/analysis/top_mutated_genes",
      method: "POST",
      params: {
        filters: buildCohortGqlOperator(genomicFilters) ?? {},
        case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
        attachment: true,
        filename: `frequently-mutated-genes.${convertDateToString(
          new Date(),
        )}.tsv`,
      },
      dispatch,
      done: () => setDownloadMutatedGenesTSVActive(false),
    });
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowId, setRowId] = useState(null);
  const handleExpand = (row: Row<Gene>) => {
    if (Object.keys(expanded).length > 0 && row.original.gene_id === rowId) {
      setExpanded({});
    } else if (
      row.original["#_ssm_affected_cases_across_the_gdc"].numerator !== 0
    ) {
      setExpanded({ [row.original.gene_id]: true });
      setRowId(row.original.gene_id);
    }
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setPage(1);
        break;
      case "newPageNumber":
        setPage(obj.newPageNumber);
        setExpanded({});
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch);
        setPage(1);
        setExpanded({});
        break;
    }
  };

  return (
    <>
      {loading && <LoadingOverlay visible />}
      {showSaveModal && (
        <SaveSelectionAsSetModal
          filters={buildCohortGqlOperator(setFilters)}
          initialSetName={
            selectedGenes.length === 0
              ? filtersToName(setFilters)
              : "Custom Gene Selection"
          }
          sort="case.project.project_id"
          saveCount={
            selectedGenes.length === 0
              ? data?.genes?.genes_total
              : selectedGenes.length
          }
          setType="genes"
          setTypeLabel="gene"
          createSetHook={useCreateGeneSetFromFiltersMutation}
          closeModal={() => setShowSaveModal(false)}
        />
      )}
      {showAddModal && (
        <AddToSetModal
          filters={setFilters}
          addToCount={
            selectedGenes.length === 0
              ? data?.genes?.genes_total
              : selectedGenes.length
          }
          setType="genes"
          setTypeLabel="gene"
          singleCountHook={useGeneSetCountQuery}
          countHook={useGeneSetCountsQuery}
          appendSetHook={useAppendToGeneSetMutation}
          closeModal={() => setShowAddModal(false)}
          field={"genes.gene_id"}
          sort="case.project.project_id"
        />
      )}
      {showRemoveModal && (
        <RemoveFromSetModal
          filters={setFilters}
          removeFromCount={
            selectedGenes.length === 0
              ? data?.genes?.genes_total
              : selectedGenes.length
          }
          setType="genes"
          setTypeLabel="gene"
          countHook={useGeneSetCountsQuery}
          closeModal={() => setShowRemoveModal(false)}
          removeFromSetHook={useRemoveFromGeneSetMutation}
        />
      )}
      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohort(newName);
          }}
        />
      )}

      <VerticalTable
        data={formattedTableData}
        columns={genesTableDefaultColumns}
        additionalControls={
          <div className="flex gap-2 items-center">
            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "Save as new gene set",
                  onClick: () => setShowSaveModal(true),
                },
                {
                  title: "Add to existing gene set",
                  disabled: Object.keys(sets || {}).length === 0,
                  onClick: () => setShowAddModal(true),
                },
                {
                  title: "Remove from existing gene set",
                  disabled: Object.keys(sets || {}).length === 0,
                  onClick: () => setShowRemoveModal(true),
                },
              ]}
              TargetButtonChildren="Save/Edit Gene Set"
              disableTargetWidth={true}
              LeftIcon={
                selectedGenes.length ? (
                  <CountsIcon $count={selectedGenes.length}>
                    {selectedGenes.length}
                  </CountsIcon>
                ) : null
              }
              menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
              customPosition="bottom-start"
              zIndex={10}
              customDataTestId="button-save-edit-gene-set"
            />
            <ButtonTooltip label="Export All Except #Cases and #Mutations">
              <FunctionButton
                onClick={handleJSONDownload}
                data-testid="button-json-mutation-frequency"
              >
                {downloadMutatedGenesJSONActive ? <Loader size="sm" /> : "JSON"}
              </FunctionButton>
            </ButtonTooltip>
            <FunctionButton
              onClick={handleTSVDownload}
              data-testid="button-tsv-mutation-frequency"
            >
              {downloadMutatedGenesTSVActive ? <Loader size="sm" /> : "TSV"}
            </FunctionButton>

            <Text className="font-heading font-bold text-md">
              TOTAL OF {data?.genes?.genes_total?.toLocaleString("en-US")}{" "}
              {data?.genes?.genes_total == 1
                ? "Gene".toUpperCase()
                : `${"Gene".toUpperCase()}S`}
            </Text>
          </div>
        }
        pagination={pagination}
        showControls={true}
        search={{
          enabled: true,
          defaultSearchTerm: searchTerm,
        }}
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        handleChange={handleChange}
        enableRowSelection={true}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        getRowCanExpand={() => true}
        expandableColumnIds={["#_ssm_affected_cases_across_the_gdc"]}
        renderSubComponent={({ row }) => <GenesTableSubcomponent row={row} />}
        setColumnVisibility={setColumnVisibility}
        columnVisibility={columnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        expanded={expanded}
        setExpanded={handleExpand}
        getRowId={getRowId}
      />
    </>
  );
};
