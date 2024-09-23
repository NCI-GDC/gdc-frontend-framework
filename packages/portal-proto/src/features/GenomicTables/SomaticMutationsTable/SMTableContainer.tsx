import {
  FilterSet,
  usePrevious,
  useGetSssmTableDataQuery,
  useSsmSetCountQuery,
  useSsmSetCountsQuery,
  useAppendToSsmSetMutation,
  useRemoveFromSsmSetMutation,
  useCreateSsmsSetFromFiltersMutation,
  useCreateTopNSsmsSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  joinFilters,
  buildCohortGqlOperator,
  useCoreDispatch,
  buildSSMSTableSearchFilters,
} from "@gff/core";
import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";
import { Loader } from "@mantine/core";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName, statusBooleansToDataStatus } from "src/utils";
import FunctionButton from "@/components/FunctionButton";
import { CountsIcon, HeaderTitle } from "@/components/tailwindComponents";
import download from "@/utils/download";
import { convertDateToString } from "@/utils/date";
import { SomaticMutation, SsmToggledHandler } from "./types";
import { SummaryModalContext } from "@/utils/contexts";
import { HandleChangeInput } from "@/components/Table/types";
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import { getMutation, useGenerateSMTableColumns } from "./utils";
import { appendSearchTermFilters } from "../utils";
import VerticalTable from "@/components/Table/VerticalTable";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import SMTableSubcomponent from "./SMTableSubcomponent";
import { ComparativeSurvival } from "@/features/genomic/types";
import TotalItems from "@/components/Table/TotalItem";

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot?: ComparativeSurvival;
  handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  genomicFilters?: FilterSet;
  cohortFilters?: FilterSet;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: Array<string>;
  geneSymbol?: string;
  tableTitle?: string;
  isDemoMode?: boolean;
  /*
   * filter about case id sent from case summary for SMT
   */
  caseFilter?: FilterSet;
  /*
   * project id for case summary SM Table
   */
  projectId?: string;
  /*
   * boolean used to determine if the links need to be opened in a summary modal or a Link
   */
  isModal?: boolean;
  /*
   * boolean used to determine if being called in a modal
   */
  inModal?: boolean;
  /*
   *  This is being sent from GenesAndMutationFrequencyAnalysisTool when mutation count is clicked in genes table
   */
  searchTermsForGene?: { geneId?: string; geneSymbol?: string };
  /**
   *  This is required for TSV download SMTable in Gene summary page
   */
  clearSearchTermsForGene?: () => void;
  gene_id?: string;
  /**
   *  This is required for TSV download SMTable in Case summary page
   */
  case_id?: string;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled = undefined,
  geneSymbol = undefined,
  projectId = undefined,
  genomicFilters = { mode: "and", root: {} },
  cohortFilters = { mode: "and", root: {} },
  caseFilter = undefined,
  handleSsmToggled = undefined,
  toggledSsms = undefined,
  isDemoMode = false,
  isModal = false,
  inModal = false,
  tableTitle = undefined,
  searchTermsForGene,
  clearSearchTermsForGene,
  gene_id,
  case_id,
}: SMTableContainerProps) => {
  /* States for table */
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(
    searchTermsForGene?.geneId ?? "",
  );

  const [
    downloadMutationsFrequencyTSVActive,
    setDownloadMutationsFrequencyTSVActive,
  ] = useState(false);

  const dispatch = useCoreDispatch();
  const { setEntityMetadata } = useContext(SummaryModalContext);

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */

  const genomicFiltersWithPossibleGeneSymbol = geneSymbol
    ? joinFilters(
        {
          mode: "and",
          root: {
            "genes.symbol": {
              field: "genes.symbol",
              operator: "includes",
              operands: [geneSymbol],
            },
          },
        },
        genomicFilters,
      )
    : genomicFilters;

  const searchFilters = buildSSMSTableSearchFilters(searchTerm);
  const genomicTableFilters = appendSearchTermFilters(
    genomicFiltersWithPossibleGeneSymbol,
    searchFilters,
  );
  const caseTableFilters = appendSearchTermFilters(caseFilter, searchFilters);

  const tableFilters = caseFilter ? caseTableFilters : genomicTableFilters;

  /* SM Table Call */
  const { data, isSuccess, isFetching, isError, isUninitialized } =
    useGetSssmTableDataQuery({
      pageSize: pageSize,
      offset: pageSize * (page - 1),
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
      geneSymbol: geneSymbol,
      genomicFilters: genomicFilters,
      cohortFilters: cohortFilters,
      caseFilter: caseFilter,
      tableFilters,
    });

  /* SM Table Call end */

  useEffect(() => {
    if (searchTerm === "" && clearSearchTermsForGene) {
      clearSearchTermsForGene();
    }
  }, [searchTerm, clearSearchTermsForGene]);

  const generateFilters = useDeepCompareCallback(
    (ssmId: string) => {
      return joinFilters(genomicFilters, {
        mode: "and",
        root: {
          "ssms.ssm_id": {
            field: "ssms.ssm_id",
            operator: "includes",
            operands: [ssmId],
          },
        },
      } as FilterSet);
    },
    [genomicFilters],
  );
  /* Create Cohort end  */

  const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);
  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(1);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  const formattedTableData = useDeepCompareMemo(() => {
    if (!data?.ssms) return [];

    return data.ssms.map((sm) =>
      getMutation(
        sm,
        selectedSurvivalPlot,
        data.filteredCases,
        data.cases,
        data.ssmsTotal,
      ),
    );
  }, [data, selectedSurvivalPlot]);

  const pagination = useMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.ssmsTotal / pageSize),
          size: pageSize,
          total: data?.ssmsTotal,
          sort: "None",
          label: "somatic mutation",
        }
      : {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
          label: undefined,
        };
  }, [pageSize, page, data?.ssmsTotal, isSuccess]);

  const SMTableDefaultColumns = useGenerateSMTableColumns({
    isDemoMode,
    handleSsmToggled,
    toggledSsms,
    handleSurvivalPlotToggled,
    isModal,
    geneSymbol,
    setEntityMetadata,
    projectId,
    generateFilters,
    currentPage: page,
    totalPages: Math.ceil(data?.ssmsTotal / pageSize),
    cohortFilters,
  });

  const getRowId = (originalRow: SomaticMutation) => {
    return originalRow.mutation_id;
  };
  const [rowSelection, setRowSelection] = useState({});
  const selectedMutations = Object.entries(rowSelection)?.map(
    ([mutation_id]) => mutation_id,
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    SMTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    mutation_id: false,
  });

  const setFilters =
    selectedMutations.length > 0
      ? ({
          root: {
            "ssms.ssm_id": {
              field: "ssms.ssm_id",
              operands: selectedMutations,
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : tableFilters;

  const handleTSVGeneDownload = () => {
    setDownloadMutationsFrequencyTSVActive(true);
    download({
      endpoint: "/analysis/top_ssms_by_gene",
      method: "POST",
      params: {
        filters: buildCohortGqlOperator(tableFilters) ?? {},
        case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
        gene_id,
        attachment: true,
        filename: `frequent-mutations.${convertDateToString(new Date())}.tsv`,
      },
      dispatch,
      done: () => setDownloadMutationsFrequencyTSVActive(false),
    });
  };

  const handleTSVCaseDownload = () => {
    setDownloadMutationsFrequencyTSVActive(true);
    download({
      endpoint: "/analysis/top_ssms_by_case",
      method: "POST",
      params: {
        case_id,
        filters: buildCohortGqlOperator(tableFilters) ?? {},
        attachment: true,
        filename: `frequent-mutations.${convertDateToString(new Date())}.tsv`,
      },
      dispatch,
      done: () => setDownloadMutationsFrequencyTSVActive(false),
    });
  };

  const handleTSVDownload = () => {
    setDownloadMutationsFrequencyTSVActive(true);

    download({
      endpoint: "/analysis/top_ssms",
      method: "POST",
      params: {
        filters: buildCohortGqlOperator(tableFilters) ?? {},
        case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
        attachment: true,
        filename: `frequent-mutations.${convertDateToString(new Date())}.tsv`,
      },
      dispatch,
      done: () => setDownloadMutationsFrequencyTSVActive(false),
    });
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setPage(1);
        break;
      case "newPageNumber":
        setExpanded({});
        setPage(obj.newPageNumber);
        break;
      case "newSearch":
        setExpanded({});
        setSearchTerm(obj.newSearch);
        setPage(1);
        break;
    }
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowId, setRowId] = useState(null);
  const handleExpand = (row: Row<SomaticMutation>) => {
    if (
      Object.keys(expanded).length > 0 &&
      row.original.mutation_id === rowId
    ) {
      setExpanded({});
    } else if (
      row.original["#_affected_cases_across_the_gdc"].numerator !== 0
    ) {
      setExpanded({ [row.original.mutation_id]: true });
      setRowId(row.original.mutation_id);
    }
  };

  const handleSaveSelectionAsSetModalClose = useCallback(
    () => setShowSaveModal(false),
    [],
  );

  const handleAddToSetModalClose = useCallback(
    () => setShowAddModal(false),
    [],
  );

  const handleRemoveFromSetModalClose = useCallback(
    () => setShowRemoveModal(false),
    [],
  );
  return (
    <>
      {caseFilter && searchTerm.length === 0 && data?.ssmsTotal === 0 ? null : (
        <>
          {searchTermsForGene?.geneSymbol && (
            <div id="announce" aria-live="polite" className="sr-only">
              <p>
                You are now viewing the Mutations table filtered by{" "}
                {searchTermsForGene.geneSymbol}
              </p>
            </div>
          )}

          {isUninitialized || isFetching ? null : (
            <>
              <SaveSelectionAsSetModal
                opened={showSaveModal}
                cohortFilters={
                  selectedMutations.length === 0 ? cohortFilters : undefined
                }
                filters={setFilters}
                sort="occurrence.case.project.project_id"
                initialSetName={
                  selectedMutations.length === 0
                    ? filtersToName(setFilters)
                    : "Custom Mutation Selection"
                }
                saveCount={
                  selectedMutations.length === 0
                    ? data?.ssmsTotal
                    : selectedMutations.length
                }
                setType="ssms"
                setTypeLabel="mutation"
                createSetHook={
                  selectedMutations.length === 0
                    ? useCreateTopNSsmsSetFromFiltersMutation
                    : useCreateSsmsSetFromFiltersMutation
                }
                closeModal={handleSaveSelectionAsSetModalClose}
              />

              <AddToSetModal
                opened={showAddModal}
                filters={setFilters}
                cohortFilters={
                  selectedMutations.length === 0 ? cohortFilters : undefined
                }
                addToCount={
                  selectedMutations.length === 0
                    ? data?.ssmsTotal
                    : selectedMutations.length
                }
                setType="ssms"
                setTypeLabel="mutation"
                singleCountHook={useSsmSetCountQuery}
                countHook={useSsmSetCountsQuery}
                appendSetHook={useAppendToSsmSetMutation}
                closeModal={handleAddToSetModalClose}
                field={"ssms.ssm_id"}
                sort="occurrence.case.project.project_id"
              />

              <RemoveFromSetModal
                opened={showRemoveModal}
                filters={setFilters}
                cohortFilters={
                  selectedMutations.length === 0 ? cohortFilters : undefined
                }
                removeFromCount={
                  selectedMutations.length === 0
                    ? data?.ssmsTotal
                    : selectedMutations.length
                }
                setType="ssms"
                setTypeLabel="mutation"
                countHook={useSsmSetCountsQuery}
                closeModal={handleRemoveFromSetModalClose}
                removeFromSetHook={useRemoveFromSsmSetMutation}
              />
            </>
          )}
          {tableTitle && <HeaderTitle>{tableTitle}</HeaderTitle>}

          <VerticalTable
            customDataTestID="table-most-frequent-somatic-mutations"
            data={formattedTableData ?? []}
            columns={SMTableDefaultColumns}
            additionalControls={
              <div className="flex gap-2 items-center">
                <DropdownWithIcon
                  dropdownElements={[
                    {
                      title: "Save as new mutation set",
                      onClick: () => setShowSaveModal(true),
                    },
                    {
                      title: "Add to existing mutation set",
                      disabled: Object.keys(sets).length === 0,
                      onClick: () => setShowAddModal(true),
                    },
                    {
                      title: "Remove from existing mutation set",
                      disabled: Object.keys(sets).length === 0,
                      onClick: () => setShowRemoveModal(true),
                    },
                  ]}
                  targetButtonDisabled={isFetching && !isSuccess}
                  TargetButtonChildren="Save/Edit Mutation Set"
                  disableTargetWidth={true}
                  LeftSection={
                    selectedMutations.length ? (
                      <CountsIcon $count={selectedMutations.length}>
                        {selectedMutations.length}
                      </CountsIcon>
                    ) : null
                  }
                  menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
                  customPosition="bottom-start"
                  customDataTestId="button-save-edit-mutation-set"
                />

                {caseFilter || geneSymbol ? (
                  <FunctionButton
                    data-testid="button-tsv-mutation-frequency"
                    onClick={
                      caseFilter ? handleTSVCaseDownload : handleTSVGeneDownload
                    }
                    aria-label="Download TSV"
                    disabled={isFetching}
                  >
                    {downloadMutationsFrequencyTSVActive ? (
                      <Loader size="sm" />
                    ) : (
                      "TSV"
                    )}
                  </FunctionButton>
                ) : (
                  <FunctionButton
                    onClick={handleTSVDownload}
                    data-testid="button-tsv-mutation-frequency"
                    aria-label="Download TSV"
                    disabled={isFetching}
                  >
                    {downloadMutationsFrequencyTSVActive ? (
                      <Loader size="sm" />
                    ) : (
                      "TSV"
                    )}
                  </FunctionButton>
                )}
              </div>
            }
            search={{
              enabled: true,
              defaultSearchTerm: searchTerm,
              tooltip: "e.g. TP53, ENSG00000141510, chr17:g.7675088C>T, R175H",
            }}
            tableTotalDetail={
              <TotalItems total={data?.ssmsTotal} itemName="somatic mutation" />
            }
            pagination={pagination}
            showControls={true}
            enableRowSelection={true}
            setRowSelection={setRowSelection}
            rowSelection={rowSelection}
            status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
            getRowCanExpand={() => true}
            expandableColumnIds={["#_affected_cases_across_the_gdc"]}
            renderSubComponent={({ row }) => <SMTableSubcomponent row={row} />}
            handleChange={handleChange}
            setColumnVisibility={setColumnVisibility}
            columnVisibility={columnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            expanded={expanded}
            setExpanded={handleExpand}
            getRowId={getRowId}
            baseZIndex={inModal ? 300 : 0}
          />
        </>
      )}
    </>
  );
};

export default SMTableContainer;
