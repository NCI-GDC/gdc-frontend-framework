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
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import FunctionButton from "@/components/FunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import { processFilters } from "src/utils";
import { convertDateToString } from "src/utils/date";
import saveAs from "file-saver";

interface CancerDistributionTableTSVDownloadData {
  num_mutations?: number;
  cnv_losses?: string;
  cnv_gains?: string;
  project: string;
  disease_type: string[];
  primary_site: string[];
  ssm_affected_cases: string;
}
import { NumeratorDenominator } from "@/components/expandableTables/shared";

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
              width={250}
            >
              <span># SSM Affected Cases</span>
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
                    width={250}
                  >
                    <span># CNV Gains</span>
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
                    width={250}
                  >
                    <span># CNV Losses</span>
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
                    width={250}
                  >
                    <span># Mutations</span>
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

                ssm_affected_cases: (
                  <NumeratorDenominator
                    numerator={data.ssmFiltered[d.key] || 0}
                    denominator={data.ssmTotal[d.key] || 0}
                  />
                ),
                ssm_percent: data.ssmFiltered[d.key] / data.ssmTotal[d.key],
              };
              return {
                ...row,
                ...(isGene
                  ? {
                      cnv_gains: (
                        <NumeratorDenominator
                          numerator={data.cnvGain[d.key] || 0}
                          denominator={data.cnvTotal[d.key] || 0}
                        />
                      ),
                      cnv_losses: (
                        <NumeratorDenominator
                          numerator={data.cnvLoss[d.key] || 0}
                          denominator={data.cnvTotal[d.key] || 0}
                        />
                      ),
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

  const cancerDistributionTableDownloadData = useMemo(
    () =>
      data?.projects
        .map((d) => {
          return {
            project: d.key,
            disease_type: projectsById[d.key]?.disease_type
              ? [...projectsById[d.key]?.disease_type].sort()
              : [],
            primary_site: projectsById[d.key]?.primary_site
              ? [...projectsById[d.key]?.primary_site].sort()
              : [],
            ssm_percent: data.ssmFiltered[d.key] / data.ssmTotal[d.key],
            ssm_affected_cases: `${data.ssmFiltered[d.key] || 0} / ${
              data.ssmTotal[d.key] || 0
            } (${
              data.ssmTotal[d.key]
                ? (
                    (100 * (data.ssmFiltered[d.key] || 0)) /
                    (data.ssmTotal[d.key] || 1)
                  ).toFixed(2) ?? `0.00`
                : `0.00`
            }%)`,
            ...(isGene && {
              cnv_gains: `${data.cnvGain[d.key] || 0} / ${
                data.cnvTotal[d.key] || 0
              } (${
                data.cnvTotal
                  ? (
                      (100 * (data.cnvGain[d.key] || 0)) /
                      (data.cnvTotal[d.key] || 1)
                    ).toFixed(2) ?? `0.00`
                  : `0.00`
              }%)`,
            }),
            ...(isGene && {
              cnv_losses: `${data.cnvLoss[d.key] || 0} / ${
                data.cnvTotal[d.key] || 0
              } (${
                data.cnvTotal
                  ? (
                      (100 * (data.cnvLoss[d.key] || 0)) /
                      (data.cnvTotal[d.key] || 1)
                    ).toFixed(2) ?? `0.00`
                  : `0.00`
              }%)`,
            }),
            ...(isGene && {
              num_mutations:
                (data.ssmFiltered[d.key] || 0) === 0 ? 0 : d.doc_count,
            }),
          };
        })
        .sort(
          (a, b) => b.ssm_percent - a.ssm_percent,
        ) as CancerDistributionTableTSVDownloadData[],
    [
      projectsById,
      data?.projects,
      data?.cnvGain,
      data?.cnvLoss,
      data?.cnvTotal,
      data?.ssmFiltered,
      data?.ssmTotal,
      isGene,
    ],
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
        <div className="flex gap-2 mb-2">
          <FunctionButton>JSON</FunctionButton>
          <FunctionButton
            onClick={() => {
              const now = new Date();
              const fileName = `cancer-distribution-table.${convertDateToString(
                now,
              )}.tsv`;
              const headers = isGene
                ? [
                    "Project",
                    "Disease Type",
                    "Primary Site",
                    "# SSM Affected Cases",
                    "# CNV Gains",
                    "# CNV Losses",
                    "# Mutations",
                  ]
                : [
                    "Project",
                    "Disease Type",
                    "Primary Site",
                    "# SSM Affected Cases",
                  ];
              const body = isGene
                ? cancerDistributionTableDownloadData
                    .map(
                      ({
                        project,
                        disease_type,
                        primary_site,
                        ssm_affected_cases,
                        cnv_gains,
                        cnv_losses,
                        num_mutations,
                      }) => {
                        return [
                          project,
                          disease_type,
                          primary_site,
                          ssm_affected_cases,
                          cnv_gains,
                          cnv_losses,
                          num_mutations,
                        ].join("\t");
                      },
                    )
                    .join("\n")
                : cancerDistributionTableDownloadData
                    .map(
                      ({
                        project,
                        disease_type,
                        primary_site,
                        ssm_affected_cases,
                      }) => {
                        return [
                          project,
                          disease_type,
                          primary_site,
                          ssm_affected_cases,
                        ].join("\t");
                      },
                    )
                    .join("\n");
              const tsv = [headers.join("\t"), body].join("\n");
              const blob = new Blob([tsv as BlobPart], { type: "text/tsv" });
              saveAs(blob, fileName);
            }}
          >
            TSV
          </FunctionButton>
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
