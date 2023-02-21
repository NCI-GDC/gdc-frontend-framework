import React, { useMemo } from "react";
import { Tooltip } from "@mantine/core";
import { Row } from "react-table";
import Link from "next/link";
import {
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
  useGetProjectsQuery,
  CancerDistributionTableData,
  FilterSet,
  joinFilters,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import FunctionButton from "@/components/FunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import { processFilters } from "src/utils";

interface GeneCancerDistributionTableProps {
  readonly gene: string;
  readonly symbol: string;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}
export const GeneCancerDistributionTable: React.FC<
  GeneCancerDistributionTableProps
> = ({
  gene,
  symbol,
  genomicFilters = undefined,
  cohortFilters = undefined,
}: GeneCancerDistributionTableProps) => {
  const contextFilters = processFilters(genomicFilters, cohortFilters);

  const { data, isFetching, isError, isSuccess } =
    useGetGeneCancerDistributionTableQuery({ gene, contextFilters });
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
  readonly symbol: string;
}

interface CellProps {
  value: string[];
  row: Row;
}

export const SSMSCancerDistributionTable: React.FC<
  SSMSCancerDistributionTableProps
> = ({ ssms, symbol }: SSMSCancerDistributionTableProps) => {
  const { data, isFetching, isError, isSuccess } =
    useGetSSMSCancerDistributionTableQuery({ ssms });
  return (
    <CancerDistributionTable
      data={data}
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
      symbol={symbol}
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
  const { data: projects, isFetching: projectsFetching } = useGetProjectsQuery({
    filters: {
      op: "in",
      content: {
        field: "project_id",
        value: data?.projects.map((p) => p.key),
      },
    },
    expand: [
      "summary",
      "summary.data_categories",
      "summary.experimental_strategies",
      "program",
    ],
    size: data?.projects.length,
  });

  const projectsById = Object.fromEntries(
    (projects?.projectData || []).map((project) => [
      project.project_id,
      project,
    ]),
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
        columnName: (
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
        visible: true,
      },
    ];
    return [
      ...columns,
      ...(isGene
        ? [
            {
              id: "cnv_gains",
              columnName: (
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
              visible: true,
            },
            {
              id: "cnv_losses",
              columnName: (
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
              visible: true,
            },
            {
              id: "num_mutations",
              columnName: (
                <div>
                  <Tooltip
                    label={`# Unique Simple Somatic Mutations observed in ${symbol} in the Project`}
                    multiline
                    withArrow
                  >
                    <span className="underline decoration-dashed">
                      # Mutations
                    </span>
                  </Tooltip>
                </div>
              ),
              visible: true,
            },
          ]
        : []),
    ];
  }, [isGene, symbol]);

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
                ssm_affected_cases: `${(
                  data.ssmFiltered[d.key] || 0
                ).toLocaleString()} / ${data.ssmTotal[
                  d.key
                ].toLocaleString()} (${(
                  (data.ssmFiltered[d.key] || 0) / data.ssmTotal[d.key]
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
                      cnv_gains: `${(
                        data.cnvGain[d.key] || 0
                      ).toLocaleString()} / ${(
                        data.cnvTotal[d.key] || 0
                      ).toLocaleString()} (${(
                        data.cnvGain[d.key] / data.cnvTotal[d.key] || 0
                      ).toLocaleString(undefined, {
                        style: "percent",
                        minimumFractionDigits: 2,
                      })})`,
                      cnv_losses: `${(
                        data.cnvLoss[d.key] || 0
                      ).toLocaleString()} / ${(
                        data.cnvTotal[d.key] || 0
                      ).toLocaleString()} (${(
                        data.cnvLoss[d.key] / data.cnvTotal[d.key] || 0
                      ).toLocaleString(undefined, {
                        style: "percent",
                        minimumFractionDigits: 2,
                      })})`,
                      num_mutations:
                        (data.ssmFiltered[d.key] || 0) === 0
                          ? 0
                          : d.doc_count.toLocaleString(),
                    }
                  : {}),
              };
            })
            .sort((a, b) => b.ssm_percent - a.ssm_percent)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSuccess, projectsFetching],
  );

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(formattedData);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  return (
    <VerticalTable
      tableData={displayedData}
      columns={columnListOrder}
      selectableRow={false}
      showControls={false}
      additionalControls={
        <div className="flex gap-2">
          <FunctionButton>JSON</FunctionButton>
          <FunctionButton>TSV</FunctionButton>
        </div>
      }
      pagination={{
        page,
        pages,
        size,
        from,
        total,
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
      handleChange={handleChange}
    />
  );
};
