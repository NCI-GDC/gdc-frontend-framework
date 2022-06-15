import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCoreDispatch, fetchGenesTable, useGenesTable } from "@gff/core";
import { VerticalTable } from "../shared/VerticalTable";
import { Loader, Pagination, Select, Switch, Tooltip } from "@mantine/core";
import { SiMicrogenetics as GeneAnnotationIcon } from "react-icons/si";
import _ from "lodash";
import { useMeasure } from "react-use";
import { geneKeys, customGeneKeys } from "./constants";

interface GenesTableProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

const GenesTable: React.FC<GenesTableProps> = ({
  handleSurvivalPlotToggled,
  selectedSurvivalPlot,
}: GenesTableProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [ref, { width }] = useMeasure();
  const [tableData, setTableData] = useState([]);
  const [columnListOrder, setColumnListOrder] = useState([]);
  const [columnListCells, setColumnListCells] = useState([]);

  const [selectedRowsMap, setSelectedRowsMap] = useState({});
  const [uuidRowParam] = useState("symbol");

  const coreDispatch = useCoreDispatch();

  // using the useSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, isFetching } = useGenesTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchGenesTable({ pageSize: pageSize, offset: offset }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, offset]);

  useEffect(() => {
    setActivePage(1);
  }, [pageSize]);

  useEffect(() => {
    console.log("selectedRowsMap:", selectedRowsMap);
  }, [selectedRowsMap]);

  const handleRowSelectChange = (rowUpdate, select, selectAll) => {
    switch (select) {
      case "all":
        if (!selectAll) {
          // select all rows [displayed] that aren't already selected
          setSelectedRowsMap((currentMap) => {
            const newMap = { ...currentMap };
            for (const singleRow of rowUpdate) {
              if (!(singleRow.original[uuidRowParam] in currentMap)) {
                newMap[singleRow.original[uuidRowParam]] =
                  singleRow.original[uuidRowParam];
              }
            }
            return newMap;
          });
        } else {
          // deselect all rows [displayed] that are selected
          setSelectedRowsMap((currentMap) => {
            const newMap = { ...currentMap };
            for (const singleRow of rowUpdate) {
              if (singleRow.original[uuidRowParam] in currentMap) {
                delete newMap[singleRow.original[uuidRowParam]];
              }
            }
            return newMap;
          });
        }
        break;
      case "single":
        if (rowUpdate in selectedRowsMap) {
          // deselect single row
          setSelectedRowsMap((currentMap) => {
            const newMap = { ...currentMap };
            delete newMap[rowUpdate];
            return newMap;
          });
        } else {
          // select single row
          setSelectedRowsMap((currentMap) => {
            return { ...currentMap, [rowUpdate]: rowUpdate };
          });
        }
        break;
    }
  };

  useEffect(() => {
    const getTableDataMapping = (data) => {
      setTotalResults(data.genes.genes_total);
      setPages(Math.ceil(data.genes.genes_total / pageSize));
      const genesTableMapping = data.genes.genes.map((g) => {
        return {
          symbol: g.symbol,
          name: g.name,
          SSMSAffectedCasesInCohort:
            g.cnv_case > 0
              ? `${g.cnv_case + " / " + data.genes.filteredCases} (${(
                  (100 * g.cnv_case) /
                  data.genes.filteredCases
                ).toFixed(2)}%)`
              : `0`,
          SSMSAffectedCasesAcrossTheGDC:
            g.ssm_case > 0
              ? `${g.ssm_case + " / " + data.genes.cases} (${(
                  (100 * g.ssm_case) /
                  data.genes.cases
                ).toFixed(2)}%)`
              : `0`,
          CNVGain:
            data.genes.cnvCases > 0
              ? `${g.case_cnv_gain + " / " + data.genes.cnvCases} (${(
                  (100 * g.case_cnv_gain) /
                  data.genes.cnvCases
                ).toFixed(2)}%)`
              : `0%`,
          CNVLoss:
            data.genes.cnvCases > 0
              ? `${g.case_cnv_loss + " / " + data.genes.cnvCases} (${(
                  (100 * g.case_cnv_loss) /
                  data.genes.cnvCases
                ).toFixed(2)}%)`
              : `0%`,
          mutations: data.genes.mutationCounts[g.gene_id],
          annotations: g.is_cancer_gene_census,
          survival: {
            name: `${g.name}`,
            symbol: `${g.symbol}`,
          },
        };
      });
      return genesTableMapping;
    };
    if (data.status === "fulfilled") {
      setTableData(getTableDataMapping(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageSize]);

  const getCustomGridCell = (key: string, selectedSurvivalPlot: any) => {
    switch (key) {
      case "annotations":
        return {
          Header: "Annotations",
          accessor: "annotations",
          Cell: ({ value }: any) => (
            <div className="grid place-items-center">
              {value ? (
                <Tooltip label="Is Cancer Census">
                  {" "}
                  <GeneAnnotationIcon size="1.15rem" />{" "}
                </Tooltip>
              ) : null}
            </div>
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
                    "gene.symbol",
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
    const cellMapping = geneKeys.map((key) => {
      return customGeneKeys.includes(key)
        ? getCustomGridCell(key, selectedSurvivalPlot)
        : {
            Header: _.startCase(key),
            accessor: key,
            width:
              width / geneKeys.length > 110 ? width / geneKeys.length : 110,
          };
    });
    return cellMapping;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurvivalPlot, width]);

  const getTableColumnMapping = () => {
    return geneKeys.map((key, idx) => {
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

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  return (
    <div className="flex flex-col w-screen pb-3 pt-3">
      <div>
        Showing {(activePage - 1) * pageSize + 1} - {activePage * pageSize} of{" "}
        {totalResults} genes
      </div>
      <div className={`flex flex-row`}>
        <div className={`flex-2 p-2`}>
          {Object.keys(selectedRowsMap).length} Map Length?
        </div>
        <div className={`flex-2 p-2`}>JSON</div>
        <div className={`flex-2 p-2`}>TSV</div>
      </div>
      <div ref={ref} className={`flex flex-row w-9/12`}>
        {data && !isFetching ? (
          <VerticalTable
            tableData={tableData}
            columnListOrder={columnListOrder}
            columnCells={columnCells}
            handleColumnChange={handleColumnChange}
            handleRowSelectChange={handleRowSelectChange}
            uuidRowParam={uuidRowParam}
            selectedRowsMap={selectedRowsMap}
            tableTitle={"Genes Table"}
            pageSize={pageSize.toString()}
            selectableRow={true}
          ></VerticalTable>
        ) : (
          <div className="grid place-items-center h-96 w-full pt-64 pb-72">
            <div className="flex flex-row">
              <Loader color="gray" size={24} />
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

export default GenesTable;
