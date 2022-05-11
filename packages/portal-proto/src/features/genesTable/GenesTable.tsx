import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  useGenesTable,
  GenesTableState,
} from "@gff/core";
import RingLoader from "react-spinners/RingLoader";
import VerticalTable from "../shared/VerticalTable";
import { Pagination, Select, Switch, Tooltip } from "@mantine/core";
import { SiMicrogenetics as GeneAnnotationIcon } from "react-icons/si";
import _ from "lodash";
import { useMeasure } from "react-use";
import { geneKeys, customGeneKeys } from "./constants";

interface GenesTableResponse {
  readonly data?: GDCGenesTable;
  readonly mutationsCount?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const GenesTable = ({ handleSurvivalPlotToggled, selectedSurvivalPlot }) => {
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
  const { data, error, isUninitialized, isFetching, isError } = useGenesTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchGenesTable({ pageSize: pageSize, offset: offset }));
  }, [pageSize, offset]);

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

  const getTableColumnMapping = () => {
    return geneKeys.map((key, idx) => {
      return {
        id: idx,
        columnName: key,
        visible: true,
      };
    });
  };

  const getTableCellMapping = useCallback(() => {
    return geneKeys.map((key) => {
      return customGeneKeys.includes(key)
        ? getCustomGridCell(key, selectedSurvivalPlot)
        : {
            Header: _.startCase(key),
            accessor: key,
            width:
              width / geneKeys.length > 110 ? width / geneKeys.length : 110,
          };
    });
  }, [selectedSurvivalPlot, width]);

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
          selectedId: `${g.ssm_id}`,
        },
      };
    });
    return genesTableMapping;
  };

  const getCustomGridCell = useCallback(
    (key: any, selectedSurvivalPlot) => {
      switch (key) {
        case "annotations":
          return {
            Header: "Annotations",
            accessor: "annotations",
            Cell: ({ value, row }) => (
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
            Cell: ({ value, row }) => (
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
    },
    [selectedSurvivalPlot],
  );

  useEffect(() => {
    if (data.status === "fulfilled") {
      setTableData(getTableDataMapping(data));
    }
  }, [data]);

  useEffect(() => {
    setColumnListOrder(getTableColumnMapping());
    setColumnListCells(getTableCellMapping());
  }, []);

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
    <div className="flex flex-col w-screen">
      <div ref={ref} className={`flex flex-row w-9/12`}>
        {data ? (
          <VerticalTable
            tableData={tableData}
            columnListOrder={columnListOrder}
            columnCells={columnCells}
            handleColumnChange={handleColumnChange}
          ></VerticalTable>
        ) : (
          <div className="grid place-items-center h-96">
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
