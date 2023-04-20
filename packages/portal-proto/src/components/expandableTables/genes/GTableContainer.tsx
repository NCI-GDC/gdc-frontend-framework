import {
  GDCGenesTable,
  useGenesTable,
  FilterSet,
  usePrevious,
  useCreateGeneSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  useGeneSetCountQuery,
  useAppendToGeneSetMutation,
  useRemoveFromGeneSetMutation,
  joinFilters,
  buildCohortGqlOperator,
  useCoreDispatch,
} from "@gff/core";
import { createContext, useEffect, useReducer, useState } from "react";
import { DEFAULT_GTABLE_ORDER, Genes, GeneToggledHandler } from "./types";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Button, Loader } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { default as PageStepper } from "../shared/PageStepperMantine";
import { default as TableControls } from "../shared/TableControlsMantine";
import TablePlaceholder from "../shared/TablePlaceholder";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { default as TableFilters } from "../shared/TableFiltersMantine";
import { default as PageSize } from "@/components/expandableTables/shared/PageSizeMantine";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import { useDebouncedValue } from "@mantine/hooks";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import download from "src/utils/download";
import { filtersToName } from "src/utils";

export const SelectedRowContext =
  createContext<
    [SelectedReducer<Genes>, (action: SelectReducerAction<Genes>) => void]
  >(undefined);

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
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
}: GTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 400);
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_GTABLE_ORDER);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_GTABLE_ORDER.filter((col) => col.visible),
  );
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [tableData, setTableData] = useState<GDCGenesTable>({
    cases: 0,
    cnvCases: 0,
    filteredCases: 0,
    genes_total: 0,
    genes: [],
  });
  const dispatch = useCoreDispatch();
  const [
    mutatedGenesFrequencyDownloadActive,
    setMutatedGenesFrequencyDownloadActive,
  ] = useState(false);

  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);
  const sets = useCoreSelector((state) => selectSetsByType(state, "genes"));

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0);
  };

  const handleSetPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(0);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  const gReducer = (
    selected: SelectedReducer<Genes>,
    action: SelectReducerAction<Genes>,
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
          | SelectedReducer<Genes>;
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

  const [selectedGenes, setSelectedGenes] = useReducer(
    gReducer,
    {} as SelectedReducer<Genes>,
  );
  const [gTotal, setGTotal] = useState(0);

  const { data } = useGenesTable({
    pageSize: pageSize,
    offset: page * pageSize,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
    genomicFilters: genomicFilters,
    isDemoMode: isDemoMode,
    overwritingDemoFilter: cohortFilters,
  });

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const { status, genes: initialData } = data;

  useEffect(() => {
    if (status === "fulfilled") {
      setTableData(initialData);
    }
  }, [status, initialData]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const setFilters =
    Object.keys(selectedGenes).length > 0
      ? ({
          root: {
            "genes.gene_id": {
              field: "genes.gene_id",
              operands: Object.keys(selectedGenes),
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : joinFilters(cohortFilters, genomicFilters);

  return (
    <>
      <SelectedRowContext.Provider value={[selectedGenes, setSelectedGenes]}>
        {showSaveModal && (
          <SaveSelectionAsSetModal
            filters={buildCohortGqlOperator(setFilters)}
            initialSetName={
              Object.keys(selectedGenes).length === 0
                ? filtersToName(setFilters)
                : "Custom Gene Selection"
            }
            sort="case.project.project_id"
            saveCount={
              Object.keys(selectedGenes).length === 0
                ? gTotal
                : Object.keys(selectedGenes).length
            }
            setType={"genes"}
            setTypeLabel="gene"
            createSetHook={useCreateGeneSetFromFiltersMutation}
            closeModal={() => setShowSaveModal(false)}
          />
        )}
        {showAddModal && (
          <AddToSetModal
            filters={setFilters}
            addToCount={
              Object.keys(selectedGenes).length === 0
                ? gTotal
                : Object.keys(selectedGenes).length
            }
            setType={"genes"}
            setTypeLabel="gene"
            countHook={useGeneSetCountQuery}
            appendSetHook={useAppendToGeneSetMutation}
            closeModal={() => setShowAddModal(false)}
            field={"genes.gene_id"}
          />
        )}
        {showRemoveModal && (
          <RemoveFromSetModal
            filters={setFilters}
            removeFromCount={
              Object.keys(selectedGenes).length === 0
                ? gTotal
                : Object.keys(selectedGenes).length
            }
            setType={"genes"}
            setTypeLabel="gene"
            countHook={useGeneSetCountQuery}
            closeModal={() => setShowRemoveModal(false)}
            removeFromSetHook={useRemoveFromGeneSetMutation}
          />
        )}

        <div className="flex justify-between items-center mb-2 mt-8">
          <TableControls
            total={gTotal}
            numSelected={Object.keys(selectedGenes).length ?? 0}
            label={`Gene`}
            options={[
              { label: "Save/Edit Gene Set", value: "placeholder" },
              {
                label: "Save as new gene set",
                value: "save",
                onClick: () => setShowSaveModal(true),
              },
              {
                label: "Add to existing gene set",
                value: "add",
                disabled: Object.keys(sets || {}).length === 0,
                onClick: () => setShowAddModal(true),
              },
              {
                label: "Remove from existing gene set",
                value: "remove",
                disabled: Object.keys(sets || {}).length === 0,
                onClick: () => setShowRemoveModal(true),
              },
            ]}
            additionalControls={
              <div className="flex gap-2">
                <ButtonTooltip label="Export All Except #Cases and #Mutations">
                  <Button
                    variant="outline"
                    leftIcon={
                      mutatedGenesFrequencyDownloadActive ? (
                        <Loader size={20} />
                      ) : (
                        <DownloadIcon size="1.25em" />
                      )
                    }
                    onClick={() => {
                      setMutatedGenesFrequencyDownloadActive(true);
                      download({
                        endpoint: "genes",
                        method: "POST",
                        options: {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        },
                        dispatch,
                        params: {
                          fields: [
                            "symbol",
                            "name",
                            "cytoband",
                            "biotype",
                            "gene_id",
                            "is_cancer_gene_census",
                          ].join(","),
                          filters: buildCohortGqlOperator(
                            joinFilters(cohortFilters, genomicFilters),
                          ),
                          size: gTotal,
                        },
                        done: () => {
                          setMutatedGenesFrequencyDownloadActive(false);
                        },
                      });
                    }}
                  >
                    JSON
                  </Button>
                </ButtonTooltip>
                <ButtonTooltip label="Export current view" comingSoon={true}>
                  <Button>TSV</Button>
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
            defaultColumns={DEFAULT_GTABLE_ORDER}
          />
        </div>
        <div ref={ref}>
          {!visibleColumns.length ? (
            <TablePlaceholder
              cellWidth="w-24"
              rowHeight={60}
              numOfColumns={15}
              numOfRows={pageSize}
              content={<span>No columns selected</span>}
            />
          ) : (
            <div ref={ref}>
              <GenesTable
                status={status}
                initialData={tableData}
                selectedSurvivalPlot={selectedSurvivalPlot}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                handleGeneToggled={handleGeneToggled}
                width={width}
                pageSize={pageSize}
                page={page}
                toggledGenes={toggledGenes}
                selectedGenes={selectedGenes}
                setSelectedGenes={setSelectedGenes}
                handleGTotal={setGTotal}
                columnListOrder={columnListOrder}
                visibleColumns={visibleColumns}
                searchTerm={searchTerm}
                isDemoMode={isDemoMode}
                genomicFilters={genomicFilters}
              />
            </div>
          )}
        </div>
        {visibleColumns.length ? (
          <div className="flex flex-row w-100 ml-2 mt-0 font-heading items-center">
            <div className={"grow-0"}>
              <div className="flex items-center text-sm ml-0">
                <span className="my-auto mx-1">Show</span>
                <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
                <span className="my-auto mx-1">Entries</span>
              </div>
            </div>
            <div className="flex items-center justify-center grow text-sm">
              <span>
                Showing
                <span className="font-bold">{` ${(
                  page * pageSize +
                  1
                ).toLocaleString("en-US")} `}</span>
                -
                <span className="font-bold">
                  {`${((page + 1) * pageSize < gTotal
                    ? (page + 1) * pageSize
                    : gTotal
                  ).toLocaleString("en-US")} `}
                </span>
                of
                <span className="font-bold">{` ${gTotal.toLocaleString(
                  "en-US",
                )} `}</span>
                genes
              </span>
            </div>
            <div className="grow-0 mr-0">
              <PageStepper
                page={page}
                totalPages={Math.ceil(gTotal / pageSize)}
                handlePage={handleSetPage}
              />
            </div>
          </div>
        ) : null}
      </SelectedRowContext.Provider>
    </>
  );
};
