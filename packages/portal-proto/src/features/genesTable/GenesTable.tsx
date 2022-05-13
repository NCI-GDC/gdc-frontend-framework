import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  useGenesTable,
} from "@gff/core";
import RingLoader from "react-spinners/RingLoader";
import { VerticalTable } from "../shared/VerticalTable";
import { Pagination, Select, Switch, Tooltip } from "@mantine/core";
import { SiMicrogenetics as GeneAnnotationIcon } from "react-icons/si";
import _ from "lodash";
import { useMeasure } from "react-use";
import { geneKeys, customGeneKeys } from "./constants";

interface GenesTableProps extends GDCGenesTable {
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
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);
  const [ref, { width }] = useMeasure();
  const [tableData, setTableData] = useState([]);
  const [columnListOrder, setColumnListOrder] = useState([]);
  const [columnListCells, setColumnListCells] = useState([]);

  const coreDispatch = useCoreDispatch();

  // using the useSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, isFetching } = useGenesTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchGenesTable({ pageSize: pageSize, offset: offset }));
  }, [coreDispatch, pageSize, offset]);

  useEffect(() => {
    const getTableDataMapping = (data) => {
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
      console.log("genesTable", genesTableMapping);
      return genesTableMapping;
    };
    if (data.status === "fulfilled") {
      setTableData(getTableDataMapping(data));
    }
  }, [data]);

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

export default GenesTable;
