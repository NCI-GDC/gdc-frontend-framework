import {
  GDCSsmsTable,
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
} from "@gff/core";
import { useEffect, useState, useReducer } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import {
  SomaticMutations,
  DEFAULT_SMTABLE_ORDER,
  SsmToggledHandler,
} from "./types";
import { useDebouncedValue, useScrollIntoView } from "@mantine/hooks";
import { Loader } from "@mantine/core";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName } from "src/utils";
import FunctionButton from "@/components/FunctionButton";
import { HeaderTitle } from "@/features/shared/tailwindComponents";
import {
  ButtonTooltip,
  Column,
  PageSize,
  PageStepper,
  SelectReducerAction,
  SelectedReducer,
  TableControls,
  TableFilters,
  TablePlaceholder,
} from "../shared";
import download from "@/utils/download";
import { convertDateToString } from "@/utils/date";

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
  toggledSsms?: ReadonlyArray<string>;
  columnsList?: Array<Column>;
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
   *  This is being sent from GenesAndMutationFrequencyAnalysisTool when mutation count is clicked in genes table
   */
  searchTermsForGene?: { geneId?: string; geneSymbol?: string };
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSurvivalPlotToggled = (_1: string, _2: string, _3: string) => null,
  columnsList = DEFAULT_SMTABLE_ORDER,
  geneSymbol = undefined,
  projectId = undefined,
  genomicFilters = { mode: "and", root: {} },
  cohortFilters = { mode: "and", root: {} },
  caseFilter = undefined,
  handleSsmToggled = () => null,
  toggledSsms = [],
  isDemoMode = false,
  isModal = false,
  tableTitle = undefined,
  searchTermsForGene,
}: SMTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(
    searchTermsForGene?.geneId ?? "",
  );
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 400);
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(columnsList);

  const visibleColumns = columnListOrder.filter((col) => col.visible);

  const [smTotal, setSMTotal] = useState(0);

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [tableData, setTableData] = useState<GDCSsmsTable>({
    cases: 0,
    filteredCases: 0,
    ssmsTotal: 0,
    pageSize: pageSize,
    offset: 0,
    ssms: [],
  });
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);
  const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [
    downloadMutationsFrequencyActive,
    setDownloadMutationsFrequencyActive,
  ] = useState(false);

  const dispatch = useCoreDispatch();

  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * page,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm.trim() : undefined,
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
    caseFilter: caseFilter,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0);
  };

  const handleSetPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 300,
    duration: 1000,
  });

  useEffect(() => {
    // should happen only on mount
    if (searchTerm) scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(0);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  useEffect(() => {
    if (!isFetching && isSuccess) {
      setTableData({
        ...data,
        pageSize: pageSize,
        offset: pageSize * page,
      });
    }
  }, [isFetching, isSuccess, data, pageSize, page]);

  const smReducer = (
    selected: SelectedReducer<SomaticMutations>,
    action: SelectReducerAction<SomaticMutations>,
  ) => {
    const { type, rows } = action;
    const allSelected = { ...selected };
    switch (type) {
      case "select": {
        const select = rows.map(({ original: { select } }) => select);
        return { ...selected, [select[0]]: rows[0] };
      }
      case "deselect": {
        const deselect = rows.map(({ original: { select } }) => select)[0];
        const { [deselect]: deselected, ...rest } = selected as
          | any
          | SelectedReducer<SomaticMutations>;
        return rest;
      }
      case "selectAll": {
        const selectAll = rows.map(({ original: { select } }) => select);
        selectAll.forEach((id, idx) => {
          // excludes subrow(s)
          if (!rows[idx].id.includes(".")) {
            allSelected[id] = rows[idx];
          }
        });
        return allSelected;
      }
      case "deselectAll": {
        const deselectAll = rows.map(({ original: { select } }) => select);
        deselectAll.forEach((id) => {
          delete allSelected[id];
        });
        return allSelected;
      }
    }
  };

  const [selectedMutations, setSelectedMutations] = useReducer(
    smReducer,
    {} as SelectedReducer<SomaticMutations>,
  );

  const combinedFilters = joinFilters(genomicFilters, cohortFilters);
  const setFilters =
    Object.keys(selectedMutations).length > 0
      ? ({
          root: {
            "ssms.ssm_id": {
              field: "ssms.ssm_id",
              operands: Object.keys(selectedMutations),
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : geneSymbol
      ? joinFilters(combinedFilters, {
          mode: "and",
          root: {
            "genes.symbol": {
              field: "genes.symbol",
              operator: "includes",
              operands: [geneSymbol],
            },
          },
        })
      : caseFilter
      ? caseFilter
      : combinedFilters;

  const handleJSONDownload = async () => {
    setDownloadMutationsFrequencyActive(true);
    await download({
      endpoint: "ssms",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
      params: {
        filters: {},
        // Object(buildCohortGqlOperator(combinedFilters)) ?? {},
        filename: `mutations.${convertDateToString(new Date())}.json`,
        attachment: true,
        format: "JSON",
        pretty: true,
        fields: [
          "genomic_dna_change",
          "mutation_subtype",
          "consequence.transcript.consequence_type",
          "consequence.transcript.annotation.vep_impact",
          "consequence.transcript.annotation.sift_impact",
          "consequence.transcript.annotation.polyphen_impact",
          "consequence.transcript.is_canonical",
          "consequence.transcript.gene.gene_id",
          "consequence.transcript.gene.symbol",
          "consequence.transcript.aa_change",
          "ssm_id",
        ].join(","),
      },
      dispatch,
      done: () => setDownloadMutationsFrequencyActive(false),
    });
  };

  return (
    <>
      {caseFilter &&
      debouncedSearchTerm.length === 0 &&
      tableData.ssmsTotal === 0 ? null : (
        <>
          {showSaveModal && (
            <SaveSelectionAsSetModal
              filters={buildCohortGqlOperator(setFilters)}
              sort="occurrence.case.project.project_id"
              initialSetName={
                Object.keys(selectedMutations).length === 0
                  ? filtersToName(setFilters)
                  : "Custom Mutation Selection"
              }
              saveCount={
                Object.keys(selectedMutations).length === 0
                  ? smTotal
                  : Object.keys(selectedMutations).length
              }
              setType={"ssms"}
              setTypeLabel="mutation"
              createSetHook={useCreateSsmsSetFromFiltersMutation}
              closeModal={() => setShowSaveModal(false)}
            />
          )}
          {showAddModal && (
            <AddToSetModal
              filters={setFilters}
              addToCount={
                Object.keys(selectedMutations).length === 0
                  ? smTotal
                  : Object.keys(selectedMutations).length
              }
              setType={"ssms"}
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
                Object.keys(selectedMutations).length === 0
                  ? smTotal
                  : Object.keys(selectedMutations).length
              }
              setType={"ssms"}
              setTypeLabel="mutation"
              countHook={useSsmSetCountsQuery}
              closeModal={() => setShowRemoveModal(false)}
              removeFromSetHook={useRemoveFromSsmSetMutation}
            />
          )}
          {tableTitle && <HeaderTitle>{tableTitle}</HeaderTitle>}

          <div
            data-testid="table-options-menu"
            className="flex justify-between items-center mb-2"
            ref={targetRef}
          >
            <TableControls
              total={smTotal}
              numSelected={Object.keys(selectedMutations).length ?? 0}
              label={`Somatic Mutation`}
              options={[
                { label: "Save/Edit Mutation Set", value: "placeholder" },
                {
                  label: "Save as new mutation set",
                  value: "save",
                  onClick: () => setShowSaveModal(true),
                },
                {
                  label: "Add to existing mutation set",
                  value: "add",
                  disabled: Object.keys(sets).length === 0,
                  onClick: () => setShowAddModal(true),
                },
                {
                  label: "Remove from existing mutation set",
                  value: "remove",
                  disabled: Object.keys(sets).length === 0,
                  onClick: () => setShowRemoveModal(true),
                },
              ]}
              additionalControls={
                <div className="flex gap-2">
                  <ButtonTooltip label="Export All Except #Cases">
                    <FunctionButton
                      onClick={handleJSONDownload}
                      data-testid="button-json-mutation-frequency"
                    >
                      {downloadMutationsFrequencyActive ? (
                        <Loader size="sm" />
                      ) : (
                        "JSON"
                      )}
                    </FunctionButton>
                  </ButtonTooltip>
                  <ButtonTooltip label="Export current view" comingSoon={true}>
                    <FunctionButton data-testid="button-tsv-mutation-frequency">
                      TSV
                    </FunctionButton>
                  </ButtonTooltip>
                </div>
              }
            />

            <TableFilters
              searchTerm={searchTerm}
              ariaTextOverwrite={
                searchTermsForGene?.geneSymbol &&
                `You are now viewing the Mutations table filtered by ${searchTermsForGene.geneSymbol}.`
              }
              handleSearch={handleSearch}
              columnListOrder={columnListOrder}
              handleColumnChange={handleColumnChange}
              showColumnMenu={showColumnMenu}
              setShowColumnMenu={setShowColumnMenu}
              defaultColumns={columnsList}
            />
          </div>

          <div ref={ref}>
            {!visibleColumns.length ? (
              <TablePlaceholder
                cellWidth="w-48"
                rowHeight={60}
                numOfColumns={15}
                numOfRows={pageSize}
                content={<span>No columns selected</span>}
              />
            ) : (
              <div ref={ref}>
                <SomaticMutationsTable
                  status={
                    isFetching
                      ? "pending"
                      : isSuccess
                      ? "fulfilled"
                      : isError
                      ? "rejected"
                      : "uninitialized"
                  }
                  initialData={tableData}
                  selectedSurvivalPlot={selectedSurvivalPlot}
                  handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                  width={width}
                  selectedMutations={selectedMutations}
                  setSelectedMutations={setSelectedMutations}
                  handleSMTotal={setSMTotal}
                  columnListOrder={columnListOrder}
                  visibleColumns={visibleColumns}
                  handleSsmToggled={handleSsmToggled}
                  toggledSsms={toggledSsms}
                  isDemoMode={isDemoMode}
                  isModal={isModal}
                  geneSymbol={geneSymbol}
                  projectId={projectId}
                  combinedFilters={combinedFilters}
                />
              </div>
            )}
          </div>
          {visibleColumns.length ? (
            <div className="flex font-heading items-center bg-base-max border-base-lighter border-1 border-t-0 py-3 px-4">
              <div className="flex flex-row flex-nowrap items-center m-auto ml-0">
                <div className="grow-0">
                  <div className="flex flex-row items-center text-sm ml-0">
                    <span className="my-auto mx-1">Show</span>
                    <PageSize
                      pageSize={pageSize}
                      handlePageSize={setPageSize}
                    />
                    <span className="my-auto mx-1">Entries</span>
                  </div>
                </div>
              </div>
              <div
                data-testid="text-showing-count"
                className="flex flex-row justify-between items-center text-sm"
              >
                <span>
                  Showing
                  <span className="font-bold">{` ${(tableData.ssmsTotal === 0
                    ? 0
                    : page * pageSize + 1
                  ).toLocaleString("en-US")} `}</span>
                  -
                  <span className="font-bold">{`${((page + 1) * pageSize <
                  smTotal
                    ? (page + 1) * pageSize
                    : smTotal
                  ).toLocaleString("en-US")} `}</span>
                  of
                  <span className="font-bold">{` ${smTotal.toLocaleString(
                    "en-US",
                  )} `}</span>
                  somatic mutations
                </span>
              </div>
              <div className="m-auto mr-0">
                <PageStepper
                  page={page}
                  totalPages={Math.ceil(smTotal / pageSize)}
                  handlePage={handleSetPage}
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default SMTableContainer;
