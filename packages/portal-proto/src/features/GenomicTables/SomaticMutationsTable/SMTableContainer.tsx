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
  useGetSsmTableDataMutation,
} from "@gff/core";
import { useEffect, useState, useContext, useMemo } from "react";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import { Loader, Text } from "@mantine/core";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName, humanify, statusBooleansToDataStatus } from "src/utils";
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

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot?: Record<string, string>;
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
  gene_id?: string;
  /**
   *  This is required for TSV download SMTable in Case summary page
   */
  case_id?: string;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot = {},
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

  /* SM Table Call */
  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * (page - 1),
    searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
    caseFilter: caseFilter,
  });
  /* SM Table Call end */
  const [getTopSSM, { data: topSSM }] = useGetSsmTableDataMutation();

  const previousSearchTerm = usePrevious(searchTerm);
  const previousSelectedSurvivalPlot = usePrevious(selectedSurvivalPlot);

  useEffect(() => {
    if (searchTermsForGene) {
      const { geneId = "", geneSymbol = "" } = searchTermsForGene;
      getTopSSM({
        pageSize: 1,
        offset: 0,
        searchTerm: geneId,
        geneSymbol: geneSymbol,
        genomicFilters: genomicFilters,
        cohortFilters: cohortFilters,
        caseFilter: caseFilter,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTermsForGene, genomicFilters, cohortFilters, caseFilter]);

  // TODO Refactor this to use one useEffect instead of two (see PEAR-1657)
  useDeepCompareEffect(() => {
    if (topSSM) {
      const { ssm_id, consequence_type, aa_change = "" } = topSSM;
      const description = consequence_type
        ? `${searchTermsForGene?.geneSymbol ?? ""} ${aa_change} ${humanify({
            term: consequence_type.replace("_variant", "").replace("_", " "),
          })}`
        : "";
      handleSurvivalPlotToggled(ssm_id, description, "gene.ssm.ssm_id");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topSSM, searchTermsForGene?.geneSymbol]);

  useDeepCompareEffect(
    () => {
      const shouldHandleSurvivalPlot =
        topSSM &&
        !isEqual(selectedSurvivalPlot, previousSelectedSurvivalPlot) &&
        isEqual(searchTerm, previousSearchTerm) &&
        !data?.ssms
          .map(({ ssm_id }) => ssm_id)
          .includes(selectedSurvivalPlot.symbol);
      if (shouldHandleSurvivalPlot) {
        const { ssm_id, consequence_type, aa_change = "" } = topSSM;
        const description = consequence_type
          ? `${searchTermsForGene?.geneSymbol ?? ""} ${aa_change} ${humanify({
              term: consequence_type.replace("_variant", "").replace("_", " "),
            })}`
          : "";
        handleSurvivalPlotToggled(ssm_id, description, "gene.ssm.ssm_id");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedSurvivalPlot,
      previousSelectedSurvivalPlot,
      data,
      topSSM,
      searchTerm,
      previousSearchTerm,
      searchTermsForGene?.geneSymbol,
    ],
  );

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
          {showSaveModal && (
            <SaveSelectionAsSetModal
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
              closeModal={() => setShowSaveModal(false)}
            />
          )}
          {showAddModal && (
            <AddToSetModal
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
              closeModal={() => setShowAddModal(false)}
              field={"ssms.ssm_id"}
              sort="occurrence.case.project.project_id"
            />
          )}
          {showRemoveModal && (
            <RemoveFromSetModal
              filters={setFilters}
              removeFromCount={
                selectedMutations.length === 0
                  ? data?.ssmsTotal
                  : selectedMutations.length
              }
              setType="ssms"
              setTypeLabel="mutation"
              countHook={useSsmSetCountsQuery}
              closeModal={() => setShowRemoveModal(false)}
              removeFromSetHook={useRemoveFromSsmSetMutation}
            />
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
