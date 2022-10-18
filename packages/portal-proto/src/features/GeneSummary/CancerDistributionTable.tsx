import React, { useEffect, useState, useMemo } from "react";
import { Tooltip } from "@mantine/core";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowUp as UpIcon,
} from "react-icons/md";
import { useGetCancerDistributionTableQuery, useProjects } from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { createKeyboardAccessibleFunction } from "src/utils";

const CollapsibleRow = ({
  value,
  label,
}: {
  value: string[];
  label: string;
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);

  if (value.length === 1) {
    return <>{value[0]}</>;
  } else {
    return (
      <>
        {collapsed ? (
          <span
            onClick={() => setCollapsed(false)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              setCollapsed(false),
            )}
            className="text-primary cursor-pointer flex items-center"
          >
            {value.length} {label} <DownIcon />
          </span>
        ) : (
          <>
            <ul className="list-disc">
              {value.map((v) => (
                <li>{v}</li>
              ))}
            </ul>
            <span
              onClick={() => setCollapsed(true)}
              onKeyDown={createKeyboardAccessibleFunction(() =>
                setCollapsed(true),
              )}
              className="text-primary cursor-pointer flex items-center"
            >
              collapse <UpIcon />
            </span>
          </>
        )}
      </>
    );
  }
};

interface CancerDistributionTableProps {
  readonly gene: string;
  readonly symbol: string;
}

const CancerDistributionTable: React.FC<CancerDistributionTableProps> = ({
  gene,
  symbol,
}: CancerDistributionTableProps) => {
  const { data, isFetching, isError, isSuccess } =
    useGetCancerDistributionTableQuery({ gene });
  const { data: projects } = useProjects({ size: 1000 });
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [displayedData, setDisplayedData] = useState([]);

  const projectsById = Object.fromEntries(
    (projects || []).map((project) => [project.project_id, project]),
  );
  const columnListOrder = useMemo(
    () => [
      { id: "project", columnName: "Project", visible: true },
      { id: "disease_type", columnName: "Disease Type", visible: true },
      { id: "primary_site", columnName: "Primary Site", visible: true },
      {
        id: "ssm_affected_cases",
        columnName: "# SSM Affected Cases",
        visible: true,
      },
      { id: "cnv_gains", columnName: "# CNV Gains", visible: true },
      { id: "cnv_losses", columnName: "# CNV Losses", visible: true },
      { id: "num_mutations", columnName: "# Mutations", visible: true },
    ],
    [],
  );

  const columnCells = useMemo(
    () => [
      { Header: "Project", accessor: "project" },
      {
        Header: "Disease Type",
        accessor: "disease_type",
        Cell: ({ value }) => (
          <CollapsibleRow value={value} label={"Disease Types"} />
        ),
      },
      {
        Header: "Primary Site",
        accessor: "primary_site",
        Cell: ({ value }) => (
          <CollapsibleRow value={value} label={"Primary Sites"} />
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
              <span className="underline decoration-dashed"># CNV Gains</span>
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
              <span className="underline decoration-dashed"># CNV Losses</span>
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
              <span className="underline decoration-dashed"># Mutations</span>
            </Tooltip>
          </div>
        ),
        accessor: "num_mutations",
      },
    ],
    [symbol],
  );

  const formattedData = useMemo(
    () =>
      isSuccess
        ? data?.projects.map((d) => ({
            project: d.key,
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
            num_mutations: d.doc_count,
          }))
        : [],
    [isSuccess],
  );

  useEffect(() => {
    setDisplayedData(
      formattedData.slice((activePage - 1) * pageSize, activePage * pageSize),
    );
  }, [formattedData, activePage, pageSize]);

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
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
        pages: data?.projects?.length / pageSize,
        size: pageSize,
        from: (activePage - 1) * pageSize,
        total: data?.projects?.length,
        label: "",
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

export default CancerDistributionTable;
