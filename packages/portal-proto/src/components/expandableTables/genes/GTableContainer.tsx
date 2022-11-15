import { useGenesTable } from "@gff/core";
import {
  useState,
  useEffect,
  useReducer,
  createContext,
  PropsWithChildren,
} from "react";
import { Genes, DEFAULT_GTABLE_ORDER } from "./types";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Button, Loader, Text, Tooltip } from "@mantine/core";
import PageStepper from "../shared/PageStepper";
import TableControls from "../shared/TableControls";
import TablePlaceholder from "../shared/TablePlaceholder";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { TableFilters } from "../shared/TableFilters";
import PageSize from "@/components/expandableTables/shared/PageSize";

interface ButtonTooltipPros {
  label: string;
  width?: number | "auto";
}

/**
 * Styled Tooltip to for buttons
 * @param children - child component to wrap tooltip with
 * @param label - the text label
 * @param width - width of the tooltip. Default: "auto"
 */
const ButtonTooltip: React.FC<ButtonTooltipPros> = ({
  children,
  label,
  width = "auto",
}: PropsWithChildren<ButtonTooltipPros>) => {
  return (
    <Tooltip
      label={<Text className="text-xs whitespace-pre-line">{label}</Text>}
      disabled={!label?.length}
      width={width}
      withArrow
      arrowSize={6}
      transition="fade"
      transitionDuration={200}
      multiline
      classNames={{
        tooltip:
          "bg-base-lightest text-base-contrast-lightest font-heading text-left",
      }}
    >
      {children}
    </Tooltip>
  );
};

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
}

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: GTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [ref, { width }] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_GTABLE_ORDER);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_GTABLE_ORDER.filter((col) => col.visible),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
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
        <div className={`w-9/12`}>
          <div className={`flex flex-row float-left ml-2 mb-4`}>
            <TableControls
              total={gTotal}
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
                  <ButtonTooltip
                    label={`Export All Except #Genes and #Mutations`}
                  >
                    <Button
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      JSON
                    </Button>
                  </ButtonTooltip>
                  <ButtonTooltip label={`Export current view`}>
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

          <div className={`flex flex-row float-right mr-2`}>
            <TableFilters
              search={searchTerm}
              handleSearch={setSearchTerm}
              columnListOrder={columnListOrder}
              handleColumnChange={handleColumnChange}
              showColumnMenu={showColumnMenu}
              setShowColumnMenu={setShowColumnMenu}
              defaultColumns={DEFAULT_GTABLE_ORDER}
            />
          </div>
        </div>
        <div>
          {!visibleColumns.length ? (
            <TablePlaceholder
              cellWidth="w-24"
              rowHeight={60}
              numOfColumns={15}
              numOfRows={10}
              content={<span>No columns selected</span>}
            />
          ) : status === "fulfilled" &&
            mutationCounts &&
            filteredCases &&
            cases ? (
            <div ref={ref} className={`h-full w-9/12`}>
              <GenesTable
                initialData={initialData}
                selectedSurvivalPlot={selectedSurvivalPlot}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                width={width}
                pageSize={pageSize}
                page={page}
                selectedGenes={selectedGenes}
                setSelectedGenes={setSelectedGenes}
                handleGTotal={setGTotal}
                columnListOrder={columnListOrder}
                visibleColumns={visibleColumns}
                searchTerm={searchTerm}
              />
            </div>
          ) : (
            <TablePlaceholder
              cellWidth="w-24"
              rowHeight={60}
              numOfColumns={15}
              numOfRows={10}
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
                <span className={`font-bold`}>{` ${(
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
            <div className="m-auto mr-0">
              <PageStepper
                page={page}
                totalPages={Math.ceil(gTotal / pageSize)}
                handlePage={setPage}
              />
            </div>
          </div>
        ) : null}
      </SelectedRowContext.Provider>
    </>
  );
};
