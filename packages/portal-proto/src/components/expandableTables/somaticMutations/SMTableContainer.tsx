import { useSsmsTable } from "@gff/core";
import { useEffect, useState, useReducer, createContext } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import { Button, Loader } from "@mantine/core";
import { default as PageStepper } from "../shared/PageStepperMantine";
import { default as PageSize } from "../shared/PageSizeMantine";
import { default as TableControls } from "../shared/TableControlsMantine";
import TablePlaceholder from "../shared/TablePlaceholder";
import { SomaticMutations, DEFAULT_SMTABLE_ORDER } from "./types";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { TableFilters } from "../shared/TableFilters";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import { GDCSsmsTable } from "@gff/core/dist/dts";
import { useDebouncedValue } from "@mantine/hooks";

export const SelectedRowContext =
  createContext<
    [
      SelectedReducer<SomaticMutations>,
      (action: SelectReducerAction<SomaticMutations>) => void,
    ]
  >(undefined);

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: SMTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [deboucedSearchTern] = useDebouncedValue(searchTerm, 400);
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_SMTABLE_ORDER);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_SMTABLE_ORDER.filter((col) => col.visible),
  );

  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  // const [tableData, setTableData] = useState<GDCSsmsTable>(undefined);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSetPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

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

  const { data } = useSsmsTable({
    pageSize: pageSize,
    offset: pageSize * page,
    searchTerm: deboucedSearchTern.length > 0 ? deboucedSearchTern : undefined,
  });

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const { status, ssms: initialData } = data;

  const { cases, filteredCases } = initialData as GDCSsmsTable;

  return (
    <>
      <SelectedRowContext.Provider
        value={[selectedMutations, setSelectedMutations]}
      >
        <div className="flex flex-row justify-between items-center flex-nowrap w-[80%]">
          <div className="flex flex-row ml-2 mb-4">
            <TableControls
              total={smTotal}
              numSelected={Object.keys(selectedMutations).length ?? 0}
              label={`Somatic Mutation`}
              options={[
                { label: "Save/Edit Mutation Set", value: "placeholder" },
                { label: "Save as new mutation set", value: "save" },
                { label: "Add to existing mutation set", value: "add" },
                { label: "Remove from existing mutation set", value: "remove" },
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
        <div ref={ref} className="h-full w-[90%]">
          {!visibleColumns.length ? (
            <TablePlaceholder
              cellWidth={`w-[75px]`}
              rowHeight={60}
              numOfColumns={15}
              numOfRows={pageSize}
              content={<span>No columns selected</span>}
            />
          ) : status === "fulfilled" && cases && filteredCases ? (
            <div ref={ref} className="h-full w-[90%]">
              <SomaticMutationsTable
                initialData={initialData}
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
              />
            </div>
          ) : (
            <TablePlaceholder
              cellWidth={`w-[75px]`}
              rowHeight={60}
              numOfColumns={15}
              numOfRows={10}
              content={<Loader />}
            />
          )}
        </div>
        {visibleColumns.length ? (
          <div className={`flex flex-row ml-2 m-auto w-9/12 mb-2`}>
            <div className="flex flex-row flex-nowrap items-center m-auto ml-0">
              <span className=" mx-1 text-xs">Show</span>
              <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
              <span className="my-auto mx-1 text-xs">Entries</span>
            </div>
            <div
              className={`flex flex-row justify-between items-center  text-sm`}
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
