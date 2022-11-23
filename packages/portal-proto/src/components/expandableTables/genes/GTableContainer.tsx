import { useGenesTable } from "@gff/core";
import { createContext, useEffect, useReducer, useState } from "react";
import { DEFAULT_GTABLE_ORDER, Genes, GeneToggledHandler } from "./types";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Button, Loader } from "@mantine/core";
import { default as PageStepper } from "../shared/PageStepperMantine";
import { default as TableControls } from "../shared/TableControlsMantine";
import TablePlaceholder from "../shared/TablePlaceholder";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { TableFilters } from "../shared/TableFilters";
import { default as PageSize } from "@/components/expandableTables/shared/PageSizeMantine";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import { useDebouncedValue } from "@mantine/hooks";

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
}

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
}: GTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageAndSearch, setPageAndSearch] = useState({
    page: 0,
    searchTerm: "",
  });
  const [debouncedSearchTerm] = useDebouncedValue(
    pageAndSearch.searchTerm,
    400,
  );
  // TODO when move to React 18 (batches setState), split pageAndSearch state into:
  // const [page, setPage] = useState(0);
  // const [searchTerm, setSearchTerm] = useState("");
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_GTABLE_ORDER);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_GTABLE_ORDER.filter((col) => col.visible),
  );
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const handleSearch = (term: string) => {
    setPageAndSearch({ page: 0, searchTerm: term });
  };

  const handleSetPage = (pageIndex: number) => {
    setPageAndSearch((previousState) => ({
      page: pageIndex,
      searchTerm: previousState.searchTerm,
    }));
  };

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
    offset: pageAndSearch.page * pageSize,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
  });

  useEffect(() => {
    setPageAndSearch((previousState) => ({
      page: 0,
      searchTerm: previousState.searchTerm,
    }));
  }, [pageSize]);

  const { status, genes: initialData } = data;

  const { cases, filteredCases, mutationCounts } = initialData;

  return (
    <>
      <SelectedRowContext.Provider value={[selectedGenes, setSelectedGenes]}>
        <div className="flex flex-row justify-between items-center flex-nowrap w-[80%]">
          <div className="flex flex-row ml-2 mb-4">
            <TableControls
              total={gTotal}
              numSelected={Object.keys(selectedGenes).length ?? 0}
              label={`Gene`}
              options={[
                { label: "Save/Edit Gene Set", value: "placeholder" },
                { label: "Save as new gene set", value: "save" },
                { label: "Add to existing gene set", value: "add" },
                { label: "Remove from existing gene set", value: "remove" },
              ]}
              additionalControls={
                <div className="flex flex-row gap-2">
                  <ButtonTooltip label="Export All Except #Cases and #Mutations">
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
              search={pageAndSearch.searchTerm}
              handleSearch={handleSearch}
              columnListOrder={columnListOrder}
              handleColumnChange={handleColumnChange}
              showColumnMenu={showColumnMenu}
              setShowColumnMenu={setShowColumnMenu}
              defaultColumns={DEFAULT_GTABLE_ORDER}
            />
          </div>
        </div>
        <div className="h-full w-[90%]">
          {!visibleColumns.length ? (
            <TablePlaceholder
              cellWidth="w-24"
              rowHeight={60}
              numOfColumns={15}
              numOfRows={pageSize}
              content={<span>No columns selected</span>}
            />
          ) : status === "fulfilled" &&
            mutationCounts &&
            filteredCases &&
            cases ? (
            <div ref={ref} className="h-full w-[90%]">
              <GenesTable
                initialData={initialData}
                selectedSurvivalPlot={selectedSurvivalPlot}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                handleGeneToggled={handleGeneToggled}
                width={width}
                pageSize={pageSize}
                page={pageAndSearch.page}
                selectedGenes={selectedGenes}
                setSelectedGenes={setSelectedGenes}
                handleGTotal={setGTotal}
                columnListOrder={columnListOrder}
                visibleColumns={visibleColumns}
                searchTerm={pageAndSearch.searchTerm}
              />
            </div>
          ) : (
            <TablePlaceholder
              cellWidth="w-24"
              rowHeight={60}
              numOfColumns={15}
              numOfRows={pageSize}
              content={<Loader />}
            />
          )}
        </div>
        {visibleColumns.length ? (
          <div className="flex flex-row w-9/12 ml-2 mt-0 m-auto">
            <div className="flex flex-row items-center m-auto ml-0">
              <span className="my-auto mx-1 text-sm">Show</span>
              <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
              <span className="my-auto mx-1 text-xs">Entries</span>
            </div>
            <div className={`m-auto text-sm`}>
              <span>
                Showing
                <span className="font-bold">{` ${(
                  pageAndSearch.page * pageSize +
                  1
                ).toLocaleString("en-US")} `}</span>
                -
                <span className="font-bold">
                  {`${((pageAndSearch.page + 1) * pageSize < gTotal
                    ? (pageAndSearch.page + 1) * pageSize
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
            <div className="m-auto mr-0">
              <PageStepper
                page={pageAndSearch.page}
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
