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
import {
  NumeratorDenominator,
  ButtonTooltip,
} from "@/components/expandableTables/shared";
import { CohortCreationButtonWrapper } from "@/components/CohortCreationButton/";

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
      id={gene}
      contextFilters={contextFilters}
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
      id={ssms}
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
  readonly id: string;
  readonly isGene: boolean;
  readonly contextFilters?: FilterSet;
}

const CancerDistributionTable: React.FC<CancerDistributionTableProps> = ({
  data,
  isFetching,
  isError,
  isSuccess,
  symbol,
  id,
  isGene,
  contextFilters,
}: CancerDistributionTableProps) => {
  const { data: projects, isFetching: projectsFetching } = useGetProjectsQuery({
    filters: {
      op: "in",
      content: {
        field: "project_id",
        value: data?.projects.map((p) => p.key) ?? [],
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
  const calculatePercent = (numerator, denominator) => {
    if (numerator && denominator) {
      return numerator / denominator;
    }
    return 0;
  };
  const columnListOrder = useMemo(() => {
    const columns = [
      {
        id: "project",
        columnName: "Project",
        visible: true,
        disableSortBy: true,
      },
      {
        id: "disease_type",
        columnName: "Disease Type",
        visible: true,
        Cell: ({ value, row }: CellProps) => (
          <CollapsibleRow value={value} row={row} label={"Disease Types"} />
        ),
        disableSortBy: true,
      },
      {
        id: "primary_site",
        columnName: "Primary Site",
        visible: true,
        Cell: ({ value, row }: CellProps) => (
          <CollapsibleRow value={value} row={row} label={"Primary Site"} />
        ),
        disableSortBy: true,
      },
      {
        id: "ssm_affected_cases",
        columnName: (
          <div className="whitespace-normal">
            <Tooltip
              label={`# Cases tested for Simple Somatic Mutations in the Project affected by ${symbol}
    / # Cases tested for Simple Somatic Mutations in the Project`}
              multiline
              withArrow
              width={250}
            >
              <span className="whitespace-nowrap"># SSM Affected Cases</span>
            </Tooltip>
          </div>
        ),
        sortingFn: (rowA, rowB) => {
          if (rowA.ssm_percent < rowB.ssm_percent) {
            return 1;
          }
          if (rowA.ssm_percent > rowB.ssm_percent) {
            return -1;
          }
          return 0;
        },
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
                <div className="whitespace-normal">
                  <Tooltip
                    label={`# Cases tested for CNV in the Project affected by CNV gain event in ${symbol}
        / # Cases tested for Copy Number Variation in the Project
        `}
                    multiline
                    withArrow
                    width={250}
                  >
                    <span className="whitespace-nowrap"># CNV Gains</span>
                  </Tooltip>
                </div>
              ),
              sortingFn: (rowA, rowB) => {
                if (rowA.cnv_gains_percent < rowB.cnv_gains_percent) {
                  return 1;
                }
                if (rowA.cnv_gains_percent > rowB.cnv_gains_percent) {
                  return -1;
                }
                return 0;
              },
              visible: true,
            },
            {
              id: "cnv_losses",
              columnName: (
                <div className="whitespace-normal">
                  <Tooltip
                    label={`# Cases tested for CNV in Project affected by CNV loss event in ${symbol}
        / # Cases tested for Copy Number Variation in Project
        `}
                    multiline
                    withArrow
                    width={250}
                  >
                    <span className="whitespace-nowrap"># CNV Losses</span>
                  </Tooltip>
                </div>
              ),
              sortingFn: (rowA, rowB) => {
                if (rowA.cnv_losses_percent < rowB.cnv_losses_percent) {
                  return 1;
                }
                if (rowA.cnv_losses_percent > rowB.cnv_losses_percent) {
                  return -1;
                }
                return 0;
              },
              visible: true,
            },
            {
              id: "num_mutations",
              columnName: (
                <div className="whitespace-normal">
                  <Tooltip
                    label={`# Unique Simple Somatic Mutations observed in ${symbol} in the Project`}
                    multiline
                    withArrow
                    width={250}
                  >
                    <span className="whitespace-nowrap"># Mutations</span>
                  </Tooltip>
                </div>
              ),
              visible: true,
              Cell: ({ value }: CellProps) => {
                return <>{value.toLocaleString()}</>;
              },
            },
          ]
        : []),
    ];
  }, [isGene, symbol]);

  const createSSMAffectedFilters = (project: string, id: string): FilterSet => {
    if (isGene) {
      const geneFilters: FilterSet = {
        mode: "and",
        root: {
          "cases.project.project_id": {
            field: "cases.project.project_id",
            operator: "includes",
            operands: [project],
          },
          "genes.gene_id": {
            field: "genes.gene_id",
            operator: "includes",
            operands: [id],
          },
          "ssms.ssm_id": {
            field: "ssms.ssm_id",
            operator: "exists",
          },
        },
      };
      return contextFilters
        ? joinFilters(contextFilters, geneFilters)
        : geneFilters;
    } else {
      return {
        mode: "and",
        root: {
          "cases.project.project_id": {
            field: "cases.project.project_id",
            operator: "includes",
            operands: [project],
          },
          "ssms.ssm_id": {
            field: "ssms.ssm_id",
            operator: "includes",
            operands: [id],
          },
        },
      };
    }
  };

  const createCNVGainLossFilters = (
    project: string,
    gene: string,
    filter: "Loss" | "Gain",
  ) => {
    const gainLossFilters: FilterSet = {
      mode: "and",
      root: {
        "cases.project.project_id": {
          field: "cases.project.project_id",
          operator: "includes",
          operands: [project],
        },
        "genes.gene_id": {
          field: "genes.gene_id",
          operator: "includes",
          operands: [id],
        },
        "cnvs.cnv_change": {
          field: "cnvs.cnv_change",
          operator: "includes",
          operands: [filter],
        },
      },
    };

    return contextFilters
      ? joinFilters(contextFilters, gainLossFilters)
      : gainLossFilters;
  };

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
                  <CohortCreationButtonWrapper
                    numCases={data.ssmFiltered[d.key] || 0}
                    caseFilters={createSSMAffectedFilters(d.key, id)}
                    label={
                      <NumeratorDenominator
                        numerator={data.ssmFiltered[d.key] || 0}
                        denominator={data.ssmTotal[d.key] || 0}
                        boldNumerator
                      />
                    }
                  />
                ),
                ssm_percent: data.ssmFiltered[d.key] / data.ssmTotal[d.key],
              };
              return {
                ...row,
                ...(isGene
                  ? {
                      cnv_gains: (
                        <CohortCreationButtonWrapper
                          numCases={data.cnvGain[d.key] || 0}
                          caseFilters={createCNVGainLossFilters(
                            d.key,
                            id,
                            "Gain",
                          )}
                          label={
                            <NumeratorDenominator
                              numerator={data.cnvGain[d.key] || 0}
                              denominator={data.cnvTotal[d.key] || 0}
                              boldNumerator
                            />
                          }
                        />
                      ),
                      cnv_gains_percent: calculatePercent(
                        data.cnvGain[d.key] || 0,
                        data.cnvTotal[d.key] || 0,
                      ),
                      cnv_losses: (
                        <CohortCreationButtonWrapper
                          numCases={data.cnvLoss[d.key] || 0}
                          caseFilters={createCNVGainLossFilters(
                            d.key,
                            id,
                            "Loss",
                          )}
                          label={
                            <NumeratorDenominator
                              numerator={data.cnvLoss[d.key] || 0}
                              denominator={data.cnvTotal[d.key] || 0}
                              boldNumerator
                            />
                          }
                        />
                      ),
                      cnv_losses_percent: calculatePercent(
                        data.cnvLoss[d.key] || 0,
                        data.cnvTotal[d.key] || 0,
                      ),

                      num_mutations:
                        (data.ssmFiltered[d.key] || 0) === 0 ? 0 : d.doc_count,
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
    handleSortByChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(formattedData, columnListOrder);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
      case "sortBy":
        handleSortByChange(obj.sortBy);
        break;
    }
  };

  const handleTSVDownload = () => {
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
      : ["Project", "Disease Type", "Primary Site", "# SSM Affected Cases"];
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
            ({ project, disease_type, primary_site, ssm_affected_cases }) => {
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
  };

  return (
    <VerticalTable
      tableData={displayedData}
      columns={columnListOrder}
      columnSorting={"manual"}
      selectableRow={false}
      showControls={false}
      additionalControls={
        <div className="flex gap-2 mb-2">
          <ButtonTooltip label=" " comingSoon={true}>
            <FunctionButton>JSON</FunctionButton>
          </ButtonTooltip>
          <FunctionButton onClick={handleTSVDownload}>TSV</FunctionButton>
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
      initialSort={[
        {
          id: "ssm_affected_cases",
          desc: false,
        },
      ]}
    />
  );
};
