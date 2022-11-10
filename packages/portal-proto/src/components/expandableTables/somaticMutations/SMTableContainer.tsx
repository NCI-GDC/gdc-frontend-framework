import { useSsmsTable } from "@gff/core";
import { useEffect, useState, useReducer, createContext } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import { Button, Loader } from "@mantine/core";
import PageStepper from "../shared/PageStepper";
import PageSize from "../shared/PageSize";
import { TableControls } from "../shared/TableControls";
import TablePlaceholder from "../shared/TablePlaceholder";
import { SomaticMutations, DEFAULT_SMTABLE_ORDER } from "./types";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { TableFilters } from "../shared/TableFilters";

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
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_SMTABLE_ORDER);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_SMTABLE_ORDER.filter((col) => col.visible),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const reducer = (
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
        //todo https://github.com/microsoft/TypeScript/issues/29259
        const deselect = rows.map(({ original: { select } }) => select)[0];
        const { [deselect]: deselected, ...remaining } = selected as
          | any
          | SelectedReducer<SomaticMutations>;
        return remaining;
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
    reducer,
    {} as SelectedReducer<SomaticMutations>,
  );
  const [smTotal, setSMTotal] = useState(0);

  const { data } = useSsmsTable({
    pageSize: pageSize,
    offset: pageSize * page,
  });

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const { status, ssms: initialData } = data;

  const { cases, filteredCases } = initialData;

  return (
    <>
      <SelectedRowContext.Provider
        value={[selectedMutations, setSelectedMutations]}
      >
        <div className={`w-9/12`}>
          <div className={`flex flex-row float-left ml-2 mb-4`}>
            <TableControls
              numSelected={Object.keys(selectedMutations).length ?? 0}
              label={`Mutation`}
              options={[
                { label: "Save/Edit Gene Set", value: "placeholder" },
                { label: "Save as new gene set", value: "save" },
                { label: "Add existing gene set", value: "add" },
                { label: "Remove from existing gene set", value: "remove" },
              ]}
              additionalControls={
                <div className="flex gap-2">
                  <Button
                    className={
                      "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                    }
                  >
                    JSON
                  </Button>
                  <Button
                    className={
                      "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                    }
                  >
                    TSV
                  </Button>
                </div>
              }
            />
          </div>
          <div className={`flex flex-row float-right mr-2`}>
            <TableFilters
              search={searchTerm}
              handleSearch={setSearchTerm}
              columnListOrder={columnListOrder}
              handleColumnChange={handleColumnChange}
              showColumnMenu={showColumnMenu}
              setShowColumnMenu={setShowColumnMenu}
              defaultColumns={DEFAULT_SMTABLE_ORDER}
            />
          </div>
        </div>
        <div>
          {!visibleColumns.length ? (
            <TablePlaceholder
              cellWidth={`w-[75px]`}
              rowHeight={60}
              numOfColumns={15}
              numOfRows={10}
              content={<span>No columns selected</span>}
            />
          ) : status === "fulfilled" && cases && filteredCases ? (
            <div ref={ref} className={`h-full w-9/12`}>
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
          <div className={`flex flex-row w-9/12 ml-2 m-auto mb-2`}>
            <div className="m-auto ml-0">
              <span className="my-auto mx-1 text-xs">Show</span>
              <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
              <span className="my-auto mx-1 text-xs">Entries</span>
            </div>
            <div className={`m-auto text-sm`}>
              <span>
                Showing
                <span className={`font-bold`}>{` ${
                  page * pageSize + 1
                } `}</span>
                -
                <span className={`font-bold`}>{` ${
                  (page + 1) * pageSize < smTotal
                    ? (page + 1) * pageSize
                    : smTotal
                } `}</span>
                of
                <span className={`font-bold`}>{` ${smTotal} `}</span>
                mutations
              </span>
            </div>
            <div className={`m-auto mr-0`}>
              <PageStepper
                page={page}
                totalPages={Math.ceil(smTotal / pageSize)}
                handlePage={setPage}
              />
            </div>
          </div>
        ) : null}
      </SelectedRowContext.Provider>
    </>
  );
};

export default SMTableContainer;
