import React, { useEffect, useState, useMemo } from "react";
import { Tooltip } from "@mantine/core";
import {
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
  useProjects,
  CancerDistributionTableData,
} from "@gff/core";
import VerticalTable from "@/features/shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import { Row } from "react-table";
import Link from "next/link";

interface GeneCancerDistributionTableProps {
  readonly gene: string;
  readonly symbol: string;
}
export const GeneCancerDistributionTable: React.FC<
  GeneCancerDistributionTableProps
> = ({ gene, symbol }: GeneCancerDistributionTableProps) => {
  const { data, isFetching, isError, isSuccess } =
    useGetGeneCancerDistributionTableQuery({ gene });
  return (
    <CancerDistributionTable
      data={data}
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
      symbol={symbol}
      isGene
    />
  );
};

interface SSMSCancerDistributionTableProps {
  readonly ssms: string;
}

interface CellProps {
  value: string[];
  row: Row;
}

export const SSMSCancerDistributionTable: React.FC<
  SSMSCancerDistributionTableProps
> = ({ ssms }: SSMSCancerDistributionTableProps) => {
  const { data, isFetching, isError, isSuccess } =
    useGetSSMSCancerDistributionTableQuery({ ssms });
  return (
    <CancerDistributionTable
      data={data}
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
      symbol={ssms}
      isGene={false}
    />
  );
};

interface CancerDistributionTableProps {
  readonly data: CancerDistributionTableData;
  readonly isFetching: boolean;
  readonly isError: boolean;
  readonly isSuccess: boolean;
  readonly symbol: string;
  readonly isGene: boolean;
}

const CancerDistributionTable: React.FC<CancerDistributionTableProps> = ({
  data,
  isFetching,
  isError,
  isSuccess,
  symbol,
  isGene,
}: CancerDistributionTableProps) => {
  const { data: projects, isFetching: projectsFetching } = useProjects({
    filters: {
      op: "in",
      content: {
        field: "project_id",
        value: data?.projects.map((p) => p.key),
      },
    },
    size: data?.projects.length,
  });
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [displayedData, setDisplayedData] = useState([]);

  const projectsById = Object.fromEntries(
    (projects || []).map((project) => [project.project_id, project]),
  );
  const columnListOrder = useMemo(() => {
    const columns = [
      { id: "project", columnName: "Project", visible: true },
      {
        id: "disease_type",
        columnName: "Disease Type",
        visible: true,
        Cell: ({ value, row }: CellProps) => (
          <CollapsibleRow value={value} row={row} label={"Disease Types"} />
        ),
      },
      {
        id: "primary_site",
        columnName: "Primary Site",
        visible: true,
        Cell: ({ value, row }: CellProps) => (
          <CollapsibleRow value={value} row={row} label={"Primary Site"} />
        ),
      },
      {
        id: "ssm_affected_cases",
        columnName: "# SSM Affected Cases",
        visible: true,
      },
    ];
    return [
      ...columns,
      ...(isGene
        ? [
            { id: "cnv_gains", columnName: "# CNV Gains", visible: true },
            { id: "cnv_losses", columnName: "# CNV Losses", visible: true },
            { id: "num_mutations", columnName: "# Mutations", visible: true },
          ]
        : []),
    ];
  }, [isGene]);

  const columnCells = useMemo(() => {
    const columns = [
      { Header: "Project", accessor: "project" },
      {
        Header: "Disease Type",
        accessor: "disease_type",
        Cell: ({ value, row }: CellProps) => (
          <CollapsibleRow value={value} row={row} label={"Disease Types"} />
        ),
      },
      {
        Header: "Primary Site",
        accessor: "primary_site",
        Cell: ({ value, row }: CellProps) => (
          <CollapsibleRow value={value} row={row} label={"Primary Sites"} />
        ),
      },
      {
        Header: (
          <div>
            <Tooltip
              label={`# Cases tested for Simple Somatic Mutations in the Project affected by ${symbol} 
    / # Cases tested for Simple Somatic Mutations in the Project`}
              multiline
              withArrow
            >
              <span className="underline decoration-dashed">
                # SSM Affected Cases
              </span>
            </Tooltip>
          </div>
        ),
        accessor: "ssm_affected_cases",
      },
    ];
    return [
      ...columns,
      ...(isGene
        ? [
            {
              Header: (
                <div>
                  <Tooltip
                    label={`# Cases tested for CNV in the Project affected by CNV gain event in ${symbol} 
          / # Cases tested for Copy Number Variation in the Project
          `}
                    multiline
                    withArrow
                  >
                    <span className="underline decoration-dashed">
                      # CNV Gains
                    </span>
                  </Tooltip>
                </div>
              ),
              accessor: "cnv_gains",
            },
            {
              Header: (
                <div>
                  <Tooltip
                    label={`# Cases tested for CNV in Project affected by CNV loss event in ${symbol} 
          / # Cases tested for Copy Number Variation in Project
          `}
                    multiline
                    withArrow
                  >
                    <span className="underline decoration-dashed">
                      # CNV Losses
                    </span>
                  </Tooltip>
                </div>
              ),
              accessor: "cnv_losses",
            },
            {
              Header: (
                <div>
                  <Tooltip
                    label={`# Cases tested for CNV in Project affected by CNV loss event in ${symbol} 
          / # Cases tested for Copy Number Variation in Project
          `}
                    multiline
                    withArrow
                  >
                    <span className="underline decoration-dashed">
                      # Mutations
                    </span>
                  </Tooltip>
                </div>
              ),
              accessor: "num_mutations",
            },
          ]
        : []),
    ];
  }, [symbol, isGene]);

  const formattedData = useMemo(
    () =>
      isSuccess
        ? data?.projects
            .map((d) => {
              const row = {
                project: (
                  <Link href={`/projects/${d.key}`}>
                    <a className="text-utility-link underline">{d.key}</a>
                  </Link>
                ),
                disease_type: projectsById[d.key]?.disease_type || [],
                primary_site: projectsById[d.key]?.primary_site || [],
                ssm_affected_cases: `${data.ssmFiltered[d.key]} / ${
                  data.ssmTotal[d.key]
                } (${(
                  data.ssmFiltered[d.key] / data.ssmTotal[d.key]
                ).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })})`,
                ssm_percent: data.ssmFiltered[d.key] / data.ssmTotal[d.key],
              };
              return {
                ...row,
                ...(isGene
                  ? {
                      cnv_gains: `${data.cnvGain[d.key] || 0} / ${
                        data.cnvTotal[d.key] || 0
                      } (${(
                        data.cnvGain[d.key] / data.cnvTotal[d.key] || 0
                      ).toLocaleString(undefined, {
                        style: "percent",
                        minimumFractionDigits: 2,
                      })})`,
                      cnv_losses: `${data.cnvLoss[d.key] || 0} / ${
                        data.cnvTotal[d.key] || 0
                      } (${(
                        data.cnvLoss[d.key] / data.cnvTotal[d.key] || 0
                      ).toLocaleString(undefined, {
                        style: "percent",
                        minimumFractionDigits: 2,
                      })})`,
                      num_mutations: d.doc_count.toLocaleString(),
                    }
                  : {}),
              };
            })
            .sort((a, b) => b.ssm_percent - a.ssm_percent)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSuccess, projectsFetching],
  );

  useEffect(() => {
    setDisplayedData(
      formattedData.slice((activePage - 1) * pageSize, activePage * pageSize),
    );
  }, [formattedData, activePage, pageSize]);

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
    setActivePage(1);
  };

  const handlePageChange = (x: number) => {
    setActivePage(x);
  };

  return (
    <VerticalTable
      tableData={displayedData}
      columnListOrder={columnListOrder}
      columnCells={columnCells}
      selectableRow={false}
      handleColumnChange={undefined}
      showControls={false}
      pagination={{
        handlePageSizeChange,
        handlePageChange,
        page: activePage,
        pages: Math.ceil(data?.projects?.length / pageSize),
        size: pageSize,
        from: (activePage - 1) * pageSize,
        total: data?.projects?.length,
      }}
      status={
        isFetching
          ? "pending"
          : isSuccess
          ? "fulfilled"
          : isError
          ? "rejected"
          : "uninitialized"
      }
    />
  );
};
