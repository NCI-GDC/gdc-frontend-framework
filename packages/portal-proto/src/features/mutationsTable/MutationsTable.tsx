import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSsmsTable, useCoreDispatch, useSsmsTable } from "@gff/core";
import { VerticalTable } from "../shared/VerticalTable";
import { Loader, Pagination, Select, Switch, Tooltip } from "@mantine/core";
import _ from "lodash";
import { useMeasure } from "react-use";
import {
  ssmsKeys,
  customSsmsKeys,
  filterMutationType,
  formatImpact,
  truncateAfterMarker,
} from "./constants";

interface MutationTableProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

const MutationsTable: React.FC<MutationTableProps> = ({
  handleSurvivalPlotToggled,
  selectedSurvivalPlot,
}: MutationTableProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [ref, { width }] = useMeasure();
  const [tableData, setTableData] = useState([]);
  const [columnListOrder, setColumnListOrder] = useState([]);
  const [columnListCells, setColumnListCells] = useState([]);

  const coreDispatch = useCoreDispatch();
  // using the useSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, isFetching } = useSsmsTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchSsmsTable({ pageSize: pageSize, offset: offset }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, offset]);

  useEffect(() => {
    setActivePage(1);
  }, [pageSize]);

  useEffect(() => {
    const getTableDataMapping = (data) => {
      setTotalResults(data.ssms.filteredCases);
      setPages(Math.ceil(data.ssms.filteredCases / pageSize));
      const DNA_CHANGE_MARKERS = ["del", "ins", ">"];
      const ssmsTableMapping = data.ssms.ssms.map((s) => {
        return {
          DNAChange: truncateAfterMarker(
            s.genomic_dna_change,
            DNA_CHANGE_MARKERS,
            "…",
          ),
          type: filterMutationType(s.mutation_subtype),
          consequences:
            _.startCase(_.toLower(s.consequence[0].consequence_type)) +
            " " +
            s.consequence[0].gene.symbol +
            " " +
            s.consequence[0].aa_change,
          affectedCasesInCohort: `${
            s.filteredOccurrences + " / " + data.ssms.filteredCases
          } (${(
            (100 * s.filteredOccurrences) /
            data.ssms.filteredCases
          ).toFixed(2)}%)`,
          affectedCasesAcrossTheGDC: `${
            s.occurrence + " / " + data.ssms.cases
          } (${((100 * s.occurrence) / data.ssms.cases).toFixed(2)}%)`,
          impact: formatImpact(s.consequence[0].annotation),
          survival: {
            label:
              s.consequence[0].gene.symbol + " " + s.consequence[0].aa_change,
            name: s.genomic_dna_change,
            symbol: s.ssm_id,
            checked: s.ssm_id == selectedSurvivalPlot?.symbol,
          },
        };
      });
      return ssmsTableMapping;
    };
    if (data.status === "fulfilled") {
      setTableData(getTableDataMapping(data));
    }
  }, [data, pageSize, selectedSurvivalPlot]);

  const getCustomGridCell = (key) => {
    switch (key) {
      case "impact":
        return {
          Header: "Impact",
          accessor: "impact",
          Cell: ({ value }: any) => (
            <>
              <div className="grid place-items-center">
                <div className="flex flex-row space-x-3">
                  {value.vepImpact !== null ? (
                    <Tooltip label={`VEP Impact: ${value.vepImpact}`}>
                      <div
                        className={`${value.vepColor} rounded-md flex justify-center items-center h-8 w-8 text-primary-content-min`}
                      >
                        {value.vepText}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="flex justify-center items-center rounded-md h-8 w-8">
                      -
                    </div>
                  )}
                  {value.siftScore !== null ? (
                    <Tooltip
                      label={`SIFT Impact: ${value.siftImpact} / SIFT Score: ${value.siftScore}`}
                    >
                      <div
                        className={`${value.siftColor} rounded-md flex justify-center items-center h-8 w-8 text-primary-content-min`}
                      >
                        {value.siftText}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="flex justify-center items-center rounded-md h-8 w-8">
                      -
                    </div>
                  )}
                  {value.polyScore !== null ? (
                    <Tooltip
                      label={`PolyPhen Impact: ${value.polyImpact} / PolyPhen Score: ${value.polyScore}`}
                    >
                      <div
                        className={`${value.polyColor} rounded-md flex justify-center items-center h-8 w-8 text-primary-content-min`}
                      >
                        {value.polyText}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="flex justify-center items-center rounded-xl h-8 w-8">
                      -
                    </div>
                  )}
                </div>
              </div>
            </>
          ),
        };
      case "survival":
        return {
          Header: "Survival",
          accessor: "survival",

          Cell: ({ value }: any) => (
            <Tooltip label={`Click icon to plot ${value.symbol}`}>
              <Switch
                radius="xs"
                size="sm"
                id={`ssmstable-survival-${value.symbol}`}
                checked={value.checked}
                onChange={() => {
                  handleSurvivalPlotToggled(
                    value.symbol,
                    value.label,
                    "gene.ssm.ssm_id",
                  );
                }}
                classNames={{
                  input:
                    "bg-base-light checked:bg-primary-dark  checked:bg-none",
                }}
              />
            </Tooltip>
          ),
        };
      default:
        return;
    }
  };

  const getTableCellMapping = useCallback(() => {
    const cellMapping = ssmsKeys.map((key) => {
      return customSsmsKeys.includes(key)
        ? getCustomGridCell(key)
        : {
            Header: _.startCase(key),
            accessor: key,
            width:
              width / ssmsKeys.length > 110 ? width / ssmsKeys.length : 110,
          };
    });
    return cellMapping;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurvivalPlot, width]);

  const getTableColumnMapping = () => {
    return ssmsKeys.map((key, idx) => {
      return {
        id: idx,
        columnName: key,
        visible: true,
      };
    });
  };

  useEffect(() => {
    setColumnListOrder(getTableColumnMapping());
    setColumnListCells(getTableCellMapping());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setColumnListCells(getTableCellMapping());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurvivalPlot]);

  const handlePageSizeChange = (x: string) => {
    setOffset((activePage - 1) * parseInt(x));
    setPageSize(parseInt(x));
  };

  const handlePageChange = (x: number) => {
    setOffset((x - 1) * pageSize);
    setActivePage(x);
  };

  const updateTableCells = () => {
    const filteredColumnList = columnListOrder.filter((item) => item.visible);
    const headingOrder = filteredColumnList.map((item) => {
      return columnListCells[
        columnListCells.findIndex((find) => find.accessor === item.columnName)
      ];
    });
    headingOrder.forEach((heading) => {
      heading.width =
        width / headingOrder.length > 110 ? width / headingOrder.length : 110;
    });
    return headingOrder;
  };

  const columnCells = useMemo(
    () => updateTableCells(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, columnListOrder],
  );

  const handleColumnChange = (update) => {
    setColumnListOrder(update);
  };

  return (
    <div className="flex flex-col w-screen pb-3 pt-3">
      <div ref={ref} className={`flex flex-row w-9/12`}>
        {data && !isFetching ? (
          <VerticalTable
            tableData={tableData}
            columnListOrder={columnListOrder}
            columnCells={columnCells}
            handleColumnChange={handleColumnChange}
            selectableRow={false}
            tableTitle={`Showing ${(activePage - 1) * pageSize + 1} - ${
              activePage * pageSize
            } of  ${totalResults} somatic mutations`}
            pageSize={pageSize.toString()}
          ></VerticalTable>
        ) : (
          <div className="grid place-items-center h-96 w-full pt-64 pb-72">
            <div className="flex flex-row">
              <Loader color="gray" size={24} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-start border-t border-base-light w-9/12">
        <p className="px-2">Page Size:</p>
        <Select
          size="sm"
          radius="md"
          onChange={handlePageSizeChange}
          value={pageSize.toString()}
          data={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "40", label: "40" },
            { value: "100", label: "100" },
          ]}
        />
        <Pagination
          size="sm"
          radius="md"
          color="gray"
          className="ml-auto"
          page={activePage}
          onChange={(x) => handlePageChange(x)}
          total={pages}
        />
      </div>
    </div>
  );
};

export default MutationsTable;
