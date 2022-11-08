import { useGenesTable } from "@gff/core";
import { useState, useEffect, useReducer, createContext } from "react";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Button } from "@mantine/core";
import PageStepper from "../shared/PageStepper";
import PageSize from "../shared/PageSize";
import TableControls from "../shared/TableControls";
import TableLoader from "../shared/TableLoader";
import { Row } from "@tanstack/react-table";
import { GenesColumn } from "./types";

interface SelectReducerAction {
  type: "select" | "deselect" | "selectAll" | "deselectAll";
  rows: Row<GenesColumn>[];
}

export const SelectedRowContext =
  createContext<
    [Record<string, Row<GenesColumn>>, (action: SelectReducerAction) => void]
  >(undefined);

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: GTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [ref, { width }] = useMeasure();

  const reducer = (
    selected: Record<string, Row<GenesColumn>>,
    action: SelectReducerAction,
  ) => {
    const { type, rows } = action;
    const allSelected = { ...selected };
    switch (type) {
      case "select": {
        const select = rows.map(({ original: { select } }) => select);
        return { ...selected, [select[0]]: rows[0] };
      }
      case "deselect": {
        const deselect = rows.map(({ original: { select } }) => select);
        const { [deselect[0]]: deselected, ...remaining } = selected;
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

  const [selectedGenes, setSelectedGenes] = useReducer(
    reducer,
    {} as Record<string, Row<GenesColumn>>,
  );
  const [gTotal, setGTotal] = useState(0);

  const { data } = useGenesTable({
    pageSize: pageSize,
    offset: page * pageSize,
  });

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const { status, genes: initialData } = data;

  const { cases, filteredCases, mutationCounts } = initialData;

  return (
    <>
      <SelectedRowContext.Provider value={[selectedGenes, setSelectedGenes]}>
        <div className={`flex flex-row absolute w-60 ml-2`}>
          <TableControls
            numSelected={Object.keys(selectedGenes).length ?? 0}
            label={`Gene`}
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
        {status === "fulfilled" && mutationCounts && filteredCases && cases ? (
          <div ref={ref} className={`h-full w-9/12`}>
            <GenesTable
              initialData={data.genes}
              selectedSurvivalPlot={selectedSurvivalPlot}
              handleSurvivalPlotToggled={handleSurvivalPlotToggled}
              width={width}
              pageSize={pageSize}
              page={page}
              selectedGenes={selectedGenes}
              setSelectedGenes={setSelectedGenes}
              handleGTotal={setGTotal}
            />
          </div>
        ) : (
          <TableLoader
            cellWidth={`w-[75px]`}
            rowHeight={60}
            numOfColumns={15}
            numOfRows={10}
          />
        )}
        <div className={`flex flex-row w-9/12 ml-2 mt-0 m-auto mb-2`}>
          <div className="m-auto ml-0">
            <span className="my-auto mx-1 text-xs">Show</span>
            <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
            <span className="my-auto mx-1 text-xs">Entries</span>
          </div>
          <div className={`m-auto text-sm`}>
            <span>
              Showing
              <span className={`font-bold`}>{` ${page * pageSize + 1} `}</span>-
              <span className={`font-bold`}>
                {` ${
                  (page + 1) * pageSize < gTotal
                    ? (page + 1) * pageSize
                    : gTotal
                } `}
              </span>
              of
              <span className={`font-bold`}>{` ${gTotal} `}</span>
              genes
            </span>
          </div>
          <div className={`m-auto mr-0`}>
            <PageStepper
              page={page}
              totalPages={Math.ceil(gTotal / pageSize)}
              handlePage={setPage}
            />
          </div>
        </div>
      </SelectedRowContext.Provider>
    </>
  );
};
