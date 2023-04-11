import {
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
import { useEffect, useState, useReducer, createContext } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
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
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName } from "src/utils";
import FunctionButton from "@/components/FunctionButton";
import useSWRMutation from "swr/mutation";
import { GDC_APP_API_AUTH } from "@gff/core/src/constants";
import { getFilters } from "../shared/utils/fetcher";
import { swrFetcher } from "@gff/core/src/features/gdcapi/swr";

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
  const [smTotal, setSMTotal] = useState(0);

  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * page,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
  });

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

  const {
    trigger: mutationsFreqJSONTrigger,
    isMutating: mutationsFreqJSONIsMutating,
    data: mutationsFreqJSONData,
  } = useSWRMutation(
    {
      endpoint: `${GDC_APP_API_AUTH}/ssms?fields=genomic_dna_change,mutation_subtype,consequence.transcript.consequence_type,consequence.transcript.annotation.vep_impact,consequence.transcript.annotation.sift_impact,consequence.transcript.annotation.polyphen_impact,consequence.transcript.is_canonical,consequence.transcript.gene.gene_id,consequence.transcript.gene.symbol,consequence.transcript.aa_change,ssm_id&size=${100}&%2Cmutation_subtype%2Cconsequence.transcript.consequence_type%2Cconsequence.transcript.annotation.vep_impact%2Cconsequence.transcript.annotation.sift_impact%2Cconsequence.transcript.annotation.polyphen_impact%2Cconsequence.transcript.is_canonical%2Cconsequence.transcript.gene.gene_id%2Cconsequence.transcript.gene.symbol%2Cconsequence.transcript.aa_change%2Cssm_id&filters=%7B%22content%22%3A%5B%7B%22content%22%3A%7B%22field%22%3A%22genes.is_cancer_gene_census%22%2C%22value%22%3A%5B%22true%22%5D%7D%2C%22op%22%3A%22in%22%7D%5D%2C%22op%22%3A%22and%22%7D`,
    },
    ({ endpoint }) => swrFetcher(endpoint, "mutations-frequency-table-json"),
  );
  // {"content":[{"content":{"field":"genes.is_cancer_gene_census","value":["true"]},"op":"in"}],"op":"and"}

  // &filters=%7B%22content%22%3A%5B%7B%22content%22%3A%7B%22field%22%3A%22genes.is_cancer_gene_census%22%2C%22value%22%3A%5B%22true%22%5D%7D%2C%22op%22%3A%22in%22%7D%5D%2C%22op%22%3A%22and%22%7D

  useEffect(() => {
    console.log("mtnsfreqjsondata", mutationsFreqJSONData);
  }, [mutationsFreqJSONData]);

  const {
    trigger: mutationsFreqTSVTrigger,
    isMutating: mutationsFreqTSVIsMutating,
    data: mutationsFreqTSVData,
  } = useSWRMutation(
    {
      endpoint: `${GDC_APP_API_AUTH}/graphql`,
      query: ``,
      variables: getFilters(
        "mutationsFreqTSV",
        tableData?.ssms.map(({ ssm_id: ssm_id }) => ssm_id),
      ),
    },
    ({ endpoint, query, variables }) => swrFetcher(endpoint, query, variables),
  );

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
                ? smTotal
                : Object.keys(selectedMutations).length
            }
            setType={"ssms"}
            setTypeLabel="mutation"
            countHook={useSsmSetCountQuery}
            closeModal={() => setShowRemoveModal(false)}
            removeFromSetHook={useRemoveFromSsmSetMutation}
          />
        )}
        <div className="flex justify-between items-center mb-2">
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
                  <FunctionButton onClick={() => mutationsFreqJSONTrigger()}>
                    JSON
                  </FunctionButton>
                </ButtonTooltip>
                <ButtonTooltip label="Export current view">
                  <FunctionButton onClick={() => mutationsFreqTSVTrigger()}>
                    TSV
                  </FunctionButton>
                </ButtonTooltip>
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
                handleSMTotal={setSMTotal}
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
                <span className="font-bold">{`${((page + 1) * pageSize < smTotal
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
      </SelectedRowContext.Provider>
    </>
  );
};

export default SMTableContainer;
