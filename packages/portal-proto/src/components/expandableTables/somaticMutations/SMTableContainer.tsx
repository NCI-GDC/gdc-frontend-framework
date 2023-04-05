import {
  useEffect,
  useState,
  useReducer,
  // useCallback,
  createContext,
} from "react";
import {
  // useMutationsFreqData,
  // useMutationsFreqDLQuery,
  GDCSsmsTable,
  FilterSet,
  usePrevious,
  useGetSssmTableDataQuery,
  useSsmSetCountQuery,
  useAppendToSsmSetMutation,
  useRemoveFromSsmSetMutation,
  useCreateSsmsSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  joinFilters,
} from "@gff/core";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import { Loader } from "@mantine/core";
import { default as PageStepper } from "../shared/PageStepperMantine";
import { default as PageSize } from "../shared/PageSizeMantine";
import { default as TableControls } from "../shared/TableControlsMantine";
import TablePlaceholder from "../shared/TablePlaceholder";
import {
  SomaticMutations,
  DEFAULT_SMTABLE_ORDER,
  SsmToggledHandler,
} from "./types";
import { Column, SelectedReducer, SelectReducerAction } from "../shared/types";
import { default as TableFilters } from "../shared/TableFiltersMantine";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import { useDebouncedValue } from "@mantine/hooks";
// import saveAs from "file-saver";
// import { convertDateToString } from "src/utils/date";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName } from "src/utils";
import { FiDownload } from "react-icons/fi";
import FunctionButton from "@/components/FunctionButton";
import useSWRMutation from "swr/mutation";
import { GDC_APP_API_AUTH } from "@gff/core/src/constants";
import { fetcher } from "../utils/fetcher";

export const SelectedRowContext =
  createContext<
    [
      SelectedReducer<SomaticMutations>,
      (action: SelectReducerAction<SomaticMutations>) => void,
    ]
  >(undefined);

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
  isDemoMode?: boolean;
  /*
   * boolean used to determine if the links need to be opened in a summary modal or a Link
   */
  isModal?: boolean;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSurvivalPlotToggled = (_1: string, _2: string, _3: string) => null,
  columnsList = DEFAULT_SMTABLE_ORDER,
  geneSymbol = undefined,
  genomicFilters = { mode: "and", root: {} },
  cohortFilters = { mode: "and", root: {} },
  handleSsmToggled = () => null,
  toggledSsms = [],
  isDemoMode = false,
  isModal = false,
}: SMTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 400);
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(columnsList);
  const [visibleColumns, setVisibleColumns] = useState(
    columnsList.filter((col) => col.visible),
  );

  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [tableData, setTableData] = useState<GDCSsmsTable>({
    cases: 0,
    filteredCases: 0,
    ssmsTotal: 0,
    pageSize: 10,
    offset: 0,
    ssms: [],
  });

  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);
  const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSetPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(0);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };
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

  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * page,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
  });

  const { ssmsTotal } = data ?? { ssmsTotal: 0 };

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

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

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
      : combinedFilters;

  // todo: refactor to use REST endpt for json

  const {
    trigger: mutationsFreqTrigger,
    isMutating: mutationsFreqIsMutating,
    data: mutationsFreqData,
  } = useSWRMutation(
    {
      url: `${GDC_APP_API_AUTH}/graphql`,
      query: `query MutationsFreqQuery(
        $filters_consequence: FiltersArgument
        $filters_ssms_table: FiltersArgument
        $score: String
        $sort: [Sort]
        $offset: Int
        $size: Int
        ) {
          viewer {
            explore {
              ssms {
                hits(first: $size, offset: $offset, filters: $filters_ssms_table, score: $score, sort: $sort) {
                  total
                  edges {
                    node {
                      id
                      score
                      genomic_dna_change
                      mutation_subtype
                      ssm_id
                      consequence {
                        hits(first: 1, filters: $filters_consequence) {
                          edges {
                            node {
                              transcript {
                                is_canonical
                                annotation {
                                vep_impact
                                polyphen_impact
                                sift_impact
                                }
                                consequence_type
                                gene {
                                  gene_id
                                  symbol
                                }
                                aa_change
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
      variables: combinedFilters,
    },
    ({ url, query, variables }) =>
      fetcher(url, query, variables, "mutations-frequency-table-json"),
  );

  useEffect(() => {
    console.log("mutationsFreqData", mutationsFreqData);
  }, [mutationsFreqData]);

  // const { trigger: mutationsFreqTSVTrigger, isMutating: mutationsFreqTSVIsMutating, data: mutationsFreqTSVData } = useSWRMutation(
  //   {
  //     url: `${GDC_APP_API_AUTH}/graphql`,
  //     query: `query mutationsFreqTSVQuery(${getGQLParams(ids, version)}
  //     ){
  //       explore {
  //         cases {
  //         denominators: aggregations(filters: $filters_case) {
  //           project__project_id {
  //               buckets {
  //                   key
  //                   doc_count
  //               }
  //           }
  //         }`,
  //     variables: combinedFilters,
  //   },
  //   ({ url, query, variables }) => fetcher(url, query, variables),
  // );

  // const {
  //   data: mutationsFreqData,
  //   isFetching: mutationsFreqFetching,
  //   // isError: mutationsFreqError,
  // } = useMutationsFreqData({
  //   size: pageSize * (page + 1),
  //   genomicFilters,
  // });

  // const {
  //   data: mutationsFreqTSVData,
  //   isFetching: mutationsFreqTSVFetching,
  //   // isError: mutationsFreqTSVError,
  // } = useMutationsFreqDLQuery({
  //   tableData,
  //   ssmsIds: tableData.ssms.map(({ ssm_id: ssm_id }) => ssm_id),
  // });

  // const exportMutationsFreq = useCallback(() => {
  //   const now = new Date();
  //   const fileName = `mutations.${convertDateToString(now)}.json`;
  //   if (mutationsFreqData?.mutations) {
  //     const blob = new Blob(
  //       [JSON.stringify(mutationsFreqData?.mutations, null, 2)],
  //       {
  //         type: "text/json",
  //       },
  //     );
  //     saveAs(blob, fileName);
  //   }
  // }, [mutationsFreqData?.mutations]);

  // const exportMutationsFreqTSV = useCallback(() => {
  //   const now = new Date();
  //   const fileName = `frequent-mutations.${convertDateToString(now)}.tsv`;

  //   const headers = [
  //     "DNA Change",
  //     "Protein Change",
  //     "Mutation ID",
  //     "Type",
  //     "Consequences",
  //     "# Affected Cases in Cohort",
  //     "# Affected Cases Across the GDC",
  //     "Impact",
  //   ];
  //   const body = (mutationsFreqTSVData?.results || [])
  //     .map(
  //       ({
  //         dnaChange,
  //         proteinChange,
  //         mutationId,
  //         type,
  //         consequences,
  //         ssmsAffectedCasesInCohort,
  //         ssmsAffectedCasesAcrossGDC,
  //         impact,
  //       }) => {
  //         return [
  //           dnaChange,
  //           proteinChange,
  //           mutationId,
  //           type,
  //           consequences,
  //           ssmsAffectedCasesInCohort,
  //           ssmsAffectedCasesAcrossGDC,
  //           impact,
  //         ].join("\t");
  //       },
  //     )
  //     .join("\n");

  //   const tsv = [headers.join("\t"), body].join("\n");

  //   const blob = new Blob([tsv as BlobPart], { type: "text/tsv" });

  //   saveAs(blob, fileName);
  // }, [mutationsFreqTSVData?.results]);

  return (
    <>
      <SelectedRowContext.Provider
        value={[selectedMutations, setSelectedMutations]}
      >
        {showSaveModal && (
          <SaveSelectionAsSetModal
            filters={setFilters}
            sort="occurrence.case.project.project_id"
            initialSetName={
              Object.keys(selectedMutations).length === 0
                ? filtersToName(setFilters)
                : "Custom Mutation Selection"
            }
            saveCount={
              Object.keys(selectedMutations).length === 0
                ? ssmsTotal
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
                ? ssmsTotal
                : Object.keys(selectedMutations).length
            }
            setType={"ssms"}
            setTypeLabel="mutation"
            countHook={useSsmSetCountQuery}
            appendSetHook={useAppendToSsmSetMutation}
            closeModal={() => setShowAddModal(false)}
            field={"ssms.ssm_id"}
          />
        )}
        {showRemoveModal && (
          <RemoveFromSetModal
            filters={setFilters}
            removeFromCount={
              Object.keys(selectedMutations).length === 0
                ? ssmsTotal
                : Object.keys(selectedMutations).length
            }
            setType={"ssms"}
            setTypeLabel="mutation"
            countHook={useSsmSetCountQuery}
            closeModal={() => setShowRemoveModal(false)}
            removeFromSetHook={useRemoveFromSsmSetMutation}
          />
        )}
        <div className="flex flex-row justify-between items-center flex-nowrap w-100">
          <TableControls
            total={ssmsTotal}
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
                {mutationsFreqIsMutating ? (
                  <FunctionButton disabled={true}>
                    <Loader size="sm" className="p-1" />
                    <FiDownload title="download" size={16} />
                  </FunctionButton>
                ) : (
                  <ButtonTooltip
                    label={`${
                      mutationsFreqIsMutating ? "" : "Export All Except #Cases"
                    }`}
                  >
                    <FunctionButton
                      disabled={true}
                      onClick={() => mutationsFreqTrigger()}
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      {"JSON"}
                    </FunctionButton>
                  </ButtonTooltip>
                )}
                {mutationsFreqIsMutating ? (
                  <FunctionButton disabled={true}>
                    <Loader size="sm" className="p-1" />
                    <FiDownload title="download" size={16} />
                  </FunctionButton>
                ) : (
                  <ButtonTooltip
                    label={`${
                      mutationsFreqIsMutating ? "" : "Export current view"
                    }`}
                  >
                    <FunctionButton
                      // onClick={() => mutationsFreqTSVTrigger()}
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      {"TSV"}
                    </FunctionButton>
                  </ButtonTooltip>
                )}
              </div>
            }
          />

          <TableFilters
            search={searchTerm}
            handleSearch={handleSearch}
            columnListOrder={columnListOrder}
            handleColumnChange={handleColumnChange}
            showColumnMenu={showColumnMenu}
            setShowColumnMenu={setShowColumnMenu}
            defaultColumns={DEFAULT_SMTABLE_ORDER}
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
                pageSize={pageSize}
                page={page}
                selectedMutations={selectedMutations}
                setSelectedMutations={setSelectedMutations}
                columnListOrder={columnListOrder}
                visibleColumns={visibleColumns}
                searchTerm={searchTerm}
                handleSsmToggled={handleSsmToggled}
                toggledSsms={toggledSsms}
                isDemoMode={isDemoMode}
                isModal={isModal}
                geneSymbol={geneSymbol}
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
                  <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
                  <span className="my-auto mx-1">Entries</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center text-sm">
              <span>
                Showing
                <span className="font-bold">{` ${(
                  page * pageSize +
                  1
                ).toLocaleString("en-US")} `}</span>
                -
                <span className="font-bold">{`${((page + 1) * pageSize <
                ssmsTotal
                  ? (page + 1) * pageSize
                  : ssmsTotal
                ).toLocaleString("en-US")} `}</span>
                of
                <span className="font-bold">{` ${ssmsTotal.toLocaleString(
                  "en-US",
                )} `}</span>
                somatic mutations
              </span>
            </div>
            <div className="m-auto mr-0">
              <PageStepper
                page={page}
                totalPages={Math.ceil(ssmsTotal / pageSize)}
                handlePage={handleSetPage}
              />
            </div>
          </div>
        ) : null}
      </SelectedRowContext.Provider>
    </>
  );
};

export default SMTableContainer;
