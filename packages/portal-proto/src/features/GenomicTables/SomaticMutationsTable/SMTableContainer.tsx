import {
  FilterSet,
  usePrevious,
  useGetSssmTableDataQuery,
  useSsmSetCountQuery,
  useSsmSetCountsQuery,
  useAppendToSsmSetMutation,
  useRemoveFromSsmSetMutation,
  useCreateSsmsSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  joinFilters,
  buildCohortGqlOperator,
  useCoreDispatch,
  useCreateCaseSetFromFiltersMutation,
  GDCSsmsTable,
  getSSMTestedCases,
  selectCurrentCohortFilters,
} from "@gff/core";
import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import { Loader, Text } from "@mantine/core";
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
import VerticalTable from "@/components/Table/VerticalTable";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import SMTableSubcomponent from "./SMTableSubcomponent";
import { ComparativeSurvival } from "@/features/genomic/types";

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
  const combinedFilters = joinFilters(genomicFilters, cohortFilters);
  const geneFilter: FilterSet = {
    mode: "and",
    root: {
      "genes.symbol": {
        field: "genes.symbol",
        operator: "includes",
        operands: [geneSymbol],
      },
    },
  };

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */

  const cohortFiltersNoSet = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  /* SM Table Call */
  const { data, isSuccess, isFetching, isError, isUninitialized } =
    useGetSssmTableDataQuery({
      pageSize: pageSize,
      offset: pageSize * (page - 1),
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
      geneSymbol: geneSymbol,
      genomicFilters: genomicFilters,
      cohortFilters: cohortFilters,
      _cohortFiltersNoSet: cohortFiltersNoSet,
      caseFilter: caseFilter,
    });

  /* SM Table Call end */

  useEffect(() => {
    if (searchTerm === "" && clearSearchTermsForGene) {
      clearSearchTermsForGene();
    }
  }, [searchTerm, clearSearchTermsForGene]);

  /* Create Cohort*/
  const [createSet] = useCreateCaseSetFromFiltersMutation();

  const generateFilters = useDeepCompareCallback(
    async (ssmId: string) => {
      return await createSet({
        filters: buildCohortGqlOperator(combinedFilters),
      })
        .unwrap()
        .then((setId) => {
          return {
            mode: "and",
            root: {
              "cases.case_id": {
                field: "cases.case_id",
                operands: [`set_id:${setId}`],
                operator: "includes",
              },
              "ssms.ssm_id": {
                field: "ssms.ssm_id",
                operator: "includes",
                operands: [ssmId],
              },
            },
          } as FilterSet;
        });
    },
    [combinedFilters, createSet],
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

  const useSomaticMutationsTableFormat = (
    initialData: Omit<GDCSsmsTable, "pageSize" | "offset">,
  ) => {
    return initialData?.ssms?.map((sm) =>
      getMutation(
        sm,
        selectedSurvivalPlot,
        initialData?.filteredCases,
        initialData?.cases,
        initialData?.ssmsTotal,
      ),
    );
  };

  const formattedTableData: SomaticMutation[] =
    useSomaticMutationsTableFormat(data);

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
          label: "somatic mutations",
        }
      : {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
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

  const contextSensitiveFilters = geneSymbol
    ? joinFilters(combinedFilters, geneFilter)
    : caseFilter
    ? caseFilter
    : combinedFilters;

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
      : contextSensitiveFilters;

  const handleTSVGeneDownload = () => {
    setDownloadMutationsFrequencyTSVActive(true);
    download({
      endpoint: "/analysis/top_ssms_by_gene",
      method: "POST",
      params: {
        filters: buildCohortGqlOperator(genomicFilters) ?? {},
        case_filters: getSSMTestedCases(cohortFilters),
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
        filters: buildCohortGqlOperator(genomicFilters) ?? {},
        case_filters: getSSMTestedCases(cohortFilters),
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
                filters={buildCohortGqlOperator(setFilters)}
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
                createSetHook={useCreateSsmsSetFromFiltersMutation}
                closeModal={handleSaveSelectionAsSetModalClose}
              />

              <AddToSetModal
                opened={showAddModal}
                filters={setFilters}
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
                  LeftIcon={
                    selectedMutations.length ? (
                      <CountsIcon $count={selectedMutations.length}>
                        {selectedMutations.length}
                      </CountsIcon>
                    ) : null
                  }
                  menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
                  customPosition="bottom-start"
                  zIndex={10}
                  customDataTestId="button-save-edit-mutation-set"
                />

                {caseFilter || geneSymbol ? (
                  <FunctionButton
                    data-testid="button-tsv-mutation-frequency"
                    onClick={
                      caseFilter ? handleTSVCaseDownload : handleTSVGeneDownload
                    }
                    aria-label="Download TSV"
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
                  >
                    {downloadMutationsFrequencyTSVActive ? (
                      <Loader size="sm" />
                    ) : (
                      "TSV"
                    )}
                  </FunctionButton>
                )}
                <Text className="font-heading font-bold text-md">
                  TOTAL OF {data?.ssmsTotal?.toLocaleString("en-US")}{" "}
                  {data?.ssmsTotal == 1
                    ? "Somatic Mutation".toUpperCase()
                    : `${"Somatic Mutation".toUpperCase()}S`}
                </Text>
              </div>
            }
            search={{
              enabled: true,
              defaultSearchTerm: searchTerm,
              tooltip: "e.g. TP53, ENSG00000141510, chr17:g.7675088C>T, R175H",
            }}
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
