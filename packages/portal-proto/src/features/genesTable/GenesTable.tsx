import React, { useEffect, useMemo, useState } from "react";
import { useGenesTable } from "@gff/core";
import { VerticalTable, HandleChangeInput } from "../shared/VerticalTable";
import { Box, Switch, Tooltip } from "@mantine/core";
import { SiMicrogenetics as GeneAnnotationIcon } from "react-icons/si";
import _ from "lodash";
import { geneKeys } from "./constants";

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
  const [tableData, setTableData] = useState([]);

  // using the useSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, isFetching, isSuccess, isError } = useGenesTable({
    pageSize: pageSize,
    offset: offset,
  });
  useEffect(() => {
    setActivePage(1);
  }, [pageSize]);

  useEffect(() => {
    const getTableDataMapping = (data) => {
      setTotalResults(data.genes.genes_total);
      setPages(Math.ceil(data.genes.genes_total / pageSize));
      const genesTableMapping = data.genes.genes.map((g) => {
        return {
          symbol: g.symbol,
          name: g.name,
          survival: {
            name: g.name,
            symbol: g.symbol,
            checked: g.symbol == selectedSurvivalPlot?.symbol,
          },
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
        };
      });
      return genesTableMapping;
    };
    if (data.status === "fulfilled") {
      setTableData(getTableDataMapping(data));
    }
  }, [data, pageSize, selectedSurvivalPlot]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setOffset((activePage - 1) * parseInt(obj.newPageSize));
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setOffset((obj.newPageNumber - 1) * pageSize);
        setActivePage(obj.newPageNumber);
        break;
    }
  };

  const columnListOrder = useMemo(() => {
    return geneKeys.map((key) => {
      const colObj: {
        id: string;
        columnName: string;
        visible: boolean;
        Cell?: (value: any) => JSX.Element;
      } = {
        id: key,
        columnName: _.startCase(key),
        visible: true,
      };
      switch (key) {
        case "annotations":
          colObj.Cell = ({ value }: any) => (
            <div className="grid place-items-center">
              {value ? (
                <Tooltip label="Is Cancer Census">
                  <Box>
                    <GeneAnnotationIcon size="1.15rem" />
                  </Box>
                </Tooltip>
              ) : null}
            </div>
          );
          break;
        case "survival": {
          colObj.Cell = ({ value }: any) => (
            <Tooltip label={`Click icon to plot ${value.symbol}`}>
              <Switch
                radius="xs"
                size="sm"
                id={`genetable-survival-${value.symbol}`}
                checked={value.checked}
                onChange={() => {
                  handleSurvivalPlotToggled(
                    value.symbol,
                    value.name,
                    "gene.symbol",
                  );
                }}
                classNames={{
                  input:
                    "bg-base-light checked:bg-primary-dark  checked:bg-none",
                }}
              />
            </Tooltip>
          );
        }
      }
      return colObj;
    });
  }, [handleSurvivalPlotToggled]);

  return (
    <div className="flex flex-col w-screen pb-3 pt-3">
      <div className={`flex flex-row w-9/12`}>
        <VerticalTable
          tableData={tableData}
          columns={columnListOrder}
          selectableRow={false}
          tableTitle={`Showing ${(activePage - 1) * pageSize + 1} - ${
            activePage * pageSize
          } of   ${totalResults} genes`}
          pagination={{
            page: activePage,
            pages: pages,
            size: pageSize,
            from: (activePage - 1) * pageSize,
            total: totalResults,
            label: "genes",
          }}
          status={
            // convert to CoreSelector status
            isFetching
              ? "pending"
              : isSuccess
              ? "fulfilled"
              : isError
              ? "rejected"
              : "uninitialized"
          }
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default GenesTable;
