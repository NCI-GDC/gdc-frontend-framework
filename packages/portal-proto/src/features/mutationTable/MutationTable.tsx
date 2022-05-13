import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchSsmsTable,
  useCoreDispatch,
  useSsmsTable,
  GDCSsmsTable,
} from "@gff/core";
import RingLoader from "react-spinners/RingLoader";
import { VerticalTable } from "../shared/VerticalTable";
import { Pagination, Select, Switch, Tooltip } from "@mantine/core";
import _ from "lodash";
import { useMeasure } from "react-use";
import {
  ssmsKeys,
  customSsmsKeys,
  filterMutationType,
  formatImpact,
  truncateAfterMarker,
} from "./constants";

interface MutationTableProps extends GDCSsmsTable {
  readonly selectedSurvivalPlot: Record<string, string>;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

const MutationTable: React.FC<MutationTableProps> = ({
  handleSurvivalPlotToggled,
  selectedSurvivalPlot,
}: MutationTableProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);
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
  }, [pageSize, offset]);

  useEffect(() => {
    const getTableDataMapping = (data) => {
      if (data.status === "fulfilled") {
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
            survival: { name: s.genomic_dna_change, symbol: s.ssm_id },
          };
        });
        console.log("ssms data", data);
        return ssmsTableMapping;
      }
    };
    if (data.status === "fulfilled") {
      setTableData(getTableDataMapping(data));
    }
  }, [data]);

  const getCustomGridCell = (key, selectedSurvivalPlot) => {
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
                        className={`${value.vepColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}
                      >
                        {value.vepText}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="flex justify-center items-center rounded-xl h-8 w-8">
                      -
                    </div>
                  )}
                  {value.siftScore !== null ? (
                    <Tooltip
                      label={`SIFT Impact: ${value.siftImpact} / SIFT Score: ${value.siftScore}`}
                    >
                      <div
                        className={`${value.siftColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}
                      >
                        {value.siftText}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="flex justify-center items-center rounded-xl h-8 w-8">
                      -
                    </div>
                  )}
                  {value.polyScore !== null ? (
                    <Tooltip
                      label={`PolyPhen Impact: ${value.polyImpact} / PolyPhen Score: ${value.polyScore}`}
                    >
                      <div
                        className={`${value.polyColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}
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
                checked={
                  selectedSurvivalPlot
                    ? selectedSurvivalPlot.symbol === value.symbol
                    : false
                }
                onChange={() => {
                  handleSurvivalPlotToggled(
                    value.symbol,
                    value.name,
                    "gene.ssm.ssm_id",
                  );
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
        ? getCustomGridCell(key, selectedSurvivalPlot)
        : {
            Header: _.startCase(key),
            accessor: key,
            width:
              width / ssmsKeys.length > 110 ? width / ssmsKeys.length : 110,
          };
    });
    return cellMapping;
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
  }, []);

  useEffect(() => {
    setColumnListCells(getTableCellMapping());
  }, [selectedSurvivalPlot]);

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  };

  const handlePageChange = (x: number) => {
    setOffset((x - 1) * pageSize);
    setPage(x);
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
          ></VerticalTable>
        ) : (
          <div className="grid place-items-center h-96 w-full pt-64 pb-72">
            <div className="flex flex-row">
              <RingLoader color={"lightblue"} loading={true} size={100} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-start border-t border-nci-gray-light w-9/12">
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
          classNames={{
            active: "bg-nci-gray",
          }}
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

export default MutationTable;
