import {
  GDCSsmsTable,
  FilterSet,
  usePrevious,
  useCoreSelector,
  selectCurrentCohortFilters,
  mergeGenomicAndCohortFilters,
  useGetSssmTableDataQuery,
} from "@gff/core";
import { useEffect, useState, useReducer, createContext } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import { Button } from "@mantine/core";
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
  contextSensitive?: boolean;
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
  contextSensitive = false,
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

  const localPlusCohortFilters = useCoreSelector((state) =>
    mergeGenomicAndCohortFilters(state, genomicFilters),
  );

  const currentCohortFilter = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * page,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
    genomicFilters: genomicFilters,
    geneSymbol: geneSymbol,
    isDemoMode: isDemoMode,
    overwritingDemoFilter: cohortFilters,
    currentCohortFilter: contextSensitive
      ? currentCohortFilter
      : { mode: "and", root: {} },
    localPlusCohortFilters: contextSensitive
      ? localPlusCohortFilters
      : { mode: "and", root: {} },
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

  return (
    <>
      <SelectedRowContext.Provider
        value={[selectedMutations, setSelectedMutations]}
      >
        <div className="flex flex-row justify-between items-center flex-nowrap w-100">
          <div className="flex flex-row ml-2 mb-4">
            <TableControls
              total={smTotal}
              numSelected={Object.keys(selectedMutations).length ?? 0}
              label={`Somatic Mutation`}
              options={[
                { label: "Save/Edit Mutation Set", value: "placeholder" },
                { label: "Save as new mutation set", value: "save" },
                { label: "Add to existing mutation set", value: "add" },
                {
                  label: "Remove from existing mutation set",
                  value: "remove",
                },
              ]}
              additionalControls={
                <div className="flex gap-2">
                  <ButtonTooltip label="Export All Except #Cases">
                    <Button
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      JSON
                    </Button>
                  </ButtonTooltip>
                  <ButtonTooltip label="Export current view">
                    <Button
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      TSV
                    </Button>
                  </ButtonTooltip>
                </div>
              }
            />
          </div>
          <div className="flex flex-row flex-nowrap mr-2">
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
        </div>
        <div ref={ref}>
          {!visibleColumns.length ? (
            <TablePlaceholder
              cellWidth={`w-48`}
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
              />
            </div>
          )}
        </div>
        {visibleColumns.length ? (
          <div
            className={`flex flex-row w-100 ml-2 mt-0 font-heading items-center`}
          >
            <div className="flex flex-row flex-nowrap items-center m-auto ml-0">
              <div className={"grow-0"}>
                <div className="flex flex-row items-center text-sm ml-0">
                  <span className="my-auto mx-1 ">Show</span>
                  <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
                  <span className="my-auto mx-1 ">Entries</span>
                </div>
              </div>
            </div>
            <div
              className={`flex flex-row justify-between items-center text-sm`}
            >
              <span>
                Showing
                <span className={`font-bold`}>{` ${(
                  page * pageSize +
                  1
                ).toLocaleString("en-US")} `}</span>
                -
                <span className={`font-bold`}>{`${((page + 1) * pageSize <
                smTotal
                  ? (page + 1) * pageSize
                  : smTotal
                ).toLocaleString("en-US")} `}</span>
                of
                <span className={`font-bold`}>{` ${smTotal.toLocaleString(
                  "en-US",
                )} `}</span>
                somatic mutations
              </span>
            </div>
            <div className={`m-auto mr-0`}>
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
