import {
  GDCGenesTable,
  useGenesTable,
  FilterSet,
  useMutationFreqDLQuery,
} from "@gff/core";
import { createContext, useEffect, useReducer, useState } from "react";
import { DEFAULT_GTABLE_ORDER, Genes, GeneToggledHandler } from "./types";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Button, Loader } from "@mantine/core";
import { default as PageStepper } from "../shared/PageStepperMantine";
import { default as TableControls } from "../shared/TableControlsMantine";
import TablePlaceholder from "../shared/TablePlaceholder";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { default as TableFilters } from "../shared/TableFiltersMantine";
import { default as PageSize } from "@/components/expandableTables/shared/PageSizeMantine";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import { useDebouncedValue } from "@mantine/hooks";
import DL from "./DL";
import saveAs from "file-saver";
import { convertDateToString } from "src/utils/date";

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
  toggledGenes?: ReadonlyArray<string>;
}

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  genomicFilters,
  toggledGenes = [],
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
  const [dl, setDl] = useState<string>("");

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

  const handleJSON = () => {
    // todo: pass filename and content as params to function
    // return all entries in table, not just currently displayed
    const fileName = `mutations.${convertDateToString(new Date())}.json`;
    const content = tableData.genes.map(
      ({
        case_cnv_gain,
        case_cnv_loss,
        cnv_case,
        id,
        numCases,
        ssm_case,
        ...fields
      }) => fields,
    );
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "text/json",
    });
    saveAs(blob, fileName);
    setDl("");
  };

  return (
    <>
      <SelectedRowContext.Provider value={[selectedGenes, setSelectedGenes]}>
        <div className="flex flex-row justify-between items-center flex-nowrap w-100">
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
                  <ButtonTooltip
                    label="Export All Except #Cases and #Mutations"
                    comingSoon={true}
                  >
                    <Button
                      onClick={() => (dl === "json" ? setDl("") : handleJSON())}
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      {dl === "json" ? <Loader /> : "JSON"}
                    </Button>
                  </ButtonTooltip>
                  <ButtonTooltip label="Export current view" comingSoon={true}>
                    <Button
                      onClick={() => (dl === "tsv" ? setDl("") : setDl("tsv"))}
                      className={
                        "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                      }
                    >
                      {dl === "tsv" ? <Loader /> : "TSV"}
                    </Button>
                  </ButtonTooltip>
                  {dl === "tsv" && (
                    <DL
                      dataHook={useMutationFreqDLQuery}
                      queryParams={{
                        // tableData,
                        geneIds: tableData.genes.map(
                          ({ gene_id: geneId }) => geneId,
                        ),
                      }}
                      headers={[
                        "Symbol",
                        "Name",
                        "# SSM Affected Cases in Cohort",
                        "# SSM Affected Cases Across the GDC",
                        "# CNV Gain",
                        "# CNV Loss",
                        "# Mutations",
                        "Annotations",
                        "Survival",
                      ]}
                      fileName={`frequent-mutations.${convertDateToString(
                        new Date(),
                      )}.tsv`}
                      setDl={setDl}
                    />
                  )}
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
              defaultColumns={DEFAULT_GTABLE_ORDER}
            />
          </div>
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
              />
            </div>
          )}
        </div>
        {visibleColumns.length ? (
          <div className="flex flex-row w-100 ml-2 mt-0 font-heading items-center">
            <div className={"grow-0"}>
              <div className="flex flex-row items-center text-sm ml-0">
                <span className="my-auto mx-1 ">Show</span>
                <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
                <span className="my-auto mx-1 ">Entries</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center grow text-sm">
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
