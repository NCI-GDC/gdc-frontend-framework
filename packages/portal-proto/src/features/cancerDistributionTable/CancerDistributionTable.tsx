import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  useGetProjectsQuery,
  FilterSet,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
} from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import {
  calculatePercentageAsNumber,
  processFilters,
  statusBooleansToDataStatus,
} from "src/utils";
import CohortCreationButton from "@/components/CohortCreationButton";
import {
  ExpandedState,
  Row,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { HeaderTooltip } from "@/components/Table/HeaderTooltip";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  CancerDistributionDataType,
  CancerDistributionTableProps,
  handleJSONDownload,
  handleTSVDownload,
} from "./utils";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";
import NumeratorDenominator from "@/components/NumeratorDenominator";
import { useDeepCompareMemo } from "use-deep-compare";
import SubrowPrimarySiteDiseaseType from "@/components/SubrowPrimarySiteDiseaseType/SubrowPrimarySiteDiseaseType";

const CancerDistributionTable: React.FC<CancerDistributionTableProps> = ({
  data,
  isFetching,
  isError,
  isSuccess,
  symbol,
  id,
  isGene,
  cohortFilters,
  genomicFilters,
}: CancerDistributionTableProps) => {
  const [createSet] = useCreateCaseSetFromFiltersMutation();

  const contextFilters = useDeepCompareMemo(
    () => processFilters(genomicFilters, cohortFilters),
    [cohortFilters, genomicFilters],
  );

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

  const projectsById = useMemo(
    () =>
      Object.fromEntries(
        (projects?.projectData || []).map((project) => [
          project.project_id,
          project,
        ]),
      ),
    [projects?.projectData],
  );

  const formattedData = useMemo(
    () =>
      isSuccess && !projectsFetching
        ? data?.projects.map((d) => {
            const row = {
              project: d.key,
              disease_type:
                projectsById[d.key]?.disease_type?.slice().sort() || [],
              primary_site:
                projectsById[d.key]?.primary_site?.slice().sort() || [],
              ssm_affected_cases: {
                numerator: data.ssmFiltered[d.key] || 0,
                denominator: data.ssmTotal[d.key] || 0,
              },
              ssm_percent: calculatePercentageAsNumber(
                data.ssmFiltered[d.key] || 0,
                data.ssmTotal[d.key] || 0,
              ),
            };
            return {
              ...row,
              ...(isGene
                ? {
                    cnv_gains: {
                      numerator: data.cnvGain[d.key] || 0,
                      denominator: data.cnvTotal[d.key] || 0,
                    },
                    cnv_gains_percent: calculatePercentageAsNumber(
                      data.cnvGain[d.key] || 0,
                      data.cnvTotal[d.key] || 0,
                    ),
                    cnv_losses: {
                      numerator: data.cnvLoss[d.key] || 0,
                      denominator: data.cnvTotal[d.key] || 0,
                    },
                    cnv_losses_percent: calculatePercentageAsNumber(
                      data.cnvLoss[d.key] || 0,
                      data.cnvTotal[d.key] || 0,
                    ),
                    num_mutations:
                      (data.ssmFiltered[d.key] || 0) === 0 ? 0 : d.doc_count,
                  }
                : {}),
            };
          })
        : [],
    [data, projectsById, isGene, isSuccess, projectsFetching],
  );

  const getRowId = (originalRow: CancerDistributionDataType) => {
    return originalRow.project;
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [expandedColumnId, setExpandedColumnId] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "#_ssm_affected_cases",
      desc: true,
    },
  ]);

  const cancerDistributionTableColumnHelper = useMemo(
    () => createColumnHelper<CancerDistributionDataType>(),
    [],
  );

  const createSSMAffectedFilters = useCallback(
    async (
      project: string,
      id: string,
      contextFilters: FilterSet,
      genomicFilters: FilterSet = undefined,
    ): Promise<FilterSet> => {
      return await createSet({
        filters: buildCohortGqlOperator(contextFilters),
      })
        .unwrap()
        .then((setId) => {
          if (isGene) {
            return {
              mode: "and",
              root: {
                "cases.case_id": {
                  field: "cases.case_id",
                  operands: [`set_id:${setId}`],
                  operator: "includes",
                },
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
                ...genomicFilters?.root,
              },
            };
          } else {
            return {
              mode: "and",
              root: {
                "cases.case_id": {
                  field: "cases.case_id",
                  operands: [`set_id:${setId}`],
                  operator: "includes",
                },
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
        });
    },
    [createSet, isGene],
  );

  const createCNVGainLossFilters = useCallback(
    async (
      project: string,
      filter: "Loss" | "Gain",
      contextFilters: FilterSet,
      genomicFilters: FilterSet = undefined,
    ): Promise<FilterSet> => {
      return await createSet({
        filters: buildCohortGqlOperator(contextFilters),
      })
        .unwrap()
        .then((setId) => {
          return {
            mode: "and",
            root: {
              "cases.case_id": {
                field: "cases.case_id",
                operands: [`set_id:${setId}`],
                operator: "includes",
              },
              "cases.project.project_id": {
                field: "cases.project.project_id",
                operator: "includes",
                operands: [project],
              },
              "genes.gene_id": {
                field: "genes.gene_id",
                operator: "=",
                operand: id,
              },
              "genes.cnv.cnv_change": {
                field: "genes.cnv.cnv_change",
                operator: "=",
                operand: filter,
              },
              ...genomicFilters?.root,
            },
          };
        });
    },
    [createSet, id],
  );

  const cancerDistributionTableColumns = useDeepCompareMemo(
    () => [
      cancerDistributionTableColumnHelper.accessor("project", {
        id: "project",
        header: "Project",
        cell: ({ getValue }) => (
          <Link
            href={`/projects/${getValue()}`}
            className="text-utility-link underline"
          >
            {getValue()}
          </Link>
        ),
        enableSorting: false,
      }),
      cancerDistributionTableColumnHelper.accessor("disease_type", {
        id: "disease_type",
        header: "Disease Type",
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Disease Types"
            isRowExpanded={row.getIsExpanded()}
            isColumnExpanded={expandedColumnId === "disease_type"}
          />
        ),
      }),
      cancerDistributionTableColumnHelper.accessor("primary_site", {
        id: "primary_site",
        header: "Primary Site",
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Primary Sites"
            isRowExpanded={row.getIsExpanded()}
            isColumnExpanded={expandedColumnId === "primary_site"}
          />
        ),
      }),
      cancerDistributionTableColumnHelper.accessor("ssm_percent", {
        id: "#_ssm_affected_cases",
        header: () => (
          <HeaderTooltip
            title="# SSM Affected Cases"
            tooltip={`# Cases tested for Simple Somatic Mutations in the Project affected by ${symbol}
        / # Cases tested for Simple Somatic Mutations in the Project`}
          />
        ),
        cell: ({ row }) => (
          <CohortCreationButton
            numCases={row.original.ssm_affected_cases.numerator || 0}
            filtersCallback={async () =>
              createSSMAffectedFilters(
                row.original.project,
                id,
                contextFilters,
                genomicFilters,
              )
            }
            label={
              <NumeratorDenominator
                numerator={row.original.ssm_affected_cases.numerator || 0}
                denominator={row.original.ssm_affected_cases.denominator || 0}
                boldNumerator
              />
            }
          />
        ),
        meta: {
          sortingFn: (rowA, rowB) => {
            if (rowA.ssm_percent > rowB.ssm_percent) {
              return 1;
            }
            if (rowA.ssm_percent < rowB.ssm_percent) {
              return -1;
            }
            return 0;
          },
        },
        enableSorting: true,
      }),
      ...(isGene
        ? [
            cancerDistributionTableColumnHelper.accessor("cnv_gains_percent", {
              id: "#_cnv_gains",
              header: () => (
                <HeaderTooltip
                  title="# CNV Gains"
                  tooltip={`# Cases tested for CNV in the Project affected by CNV gain event in ${symbol}
                  / # Cases tested for Copy Number Variation in the Project
                  `}
                />
              ),
              cell: ({ row }) => (
                <CohortCreationButton
                  numCases={row.original.cnv_gains.numerator || 0}
                  filtersCallback={async () =>
                    createCNVGainLossFilters(
                      row.original.project,
                      "Gain",
                      contextFilters,
                      genomicFilters,
                    )
                  }
                  label={
                    <NumeratorDenominator
                      numerator={row.original.cnv_gains.numerator || 0}
                      denominator={row.original.cnv_gains.denominator || 0}
                      boldNumerator
                    />
                  }
                />
              ),
              meta: {
                sortingFn: (rowA, rowB) => {
                  if (rowA.cnv_gains_percent > rowB.cnv_gains_percent) {
                    return 1;
                  }
                  if (rowA.cnv_gains_percent < rowB.cnv_gains_percent) {
                    return -1;
                  }
                  return 0;
                },
              },
              enableSorting: true,
            }),
            cancerDistributionTableColumnHelper.accessor("cnv_losses_percent", {
              id: "#_cnv_losses",
              header: () => (
                <HeaderTooltip
                  title="# CNV Losses"
                  tooltip={`# Cases tested for CNV in the Project affected by CNV loss event in ${symbol}
                  / # Cases tested for Copy Number Variation in the Project
                  `}
                />
              ),
              cell: ({ row }) => (
                <CohortCreationButton
                  numCases={row.original.cnv_losses.numerator || 0}
                  filtersCallback={async () =>
                    createCNVGainLossFilters(
                      row.original.project,
                      "Loss",
                      contextFilters,
                      genomicFilters,
                    )
                  }
                  label={
                    <NumeratorDenominator
                      numerator={row.original.cnv_losses.numerator || 0}
                      denominator={row.original.cnv_losses.denominator || 0}
                      boldNumerator
                    />
                  }
                />
              ),
              meta: {
                sortingFn: (rowA, rowB) => {
                  if (rowA.cnv_losses_percent > rowB.cnv_losses_percent) {
                    return 1;
                  }
                  if (rowA.cnv_losses_percent < rowB.cnv_losses_percent) {
                    return -1;
                  }
                  return 0;
                },
              },
              enableSorting: true,
            }),
            cancerDistributionTableColumnHelper.accessor("num_mutations", {
              id: "#_mutations",
              header: () => (
                <HeaderTooltip
                  title="# Mutations"
                  tooltip={`# Unique Simple Somatic Mutations observed in ${symbol} in the Project`}
                />
              ),
              enableSorting: true,
              cell: ({ row }) => row.original.num_mutations.toLocaleString(),
              meta: {
                sortingFn: (rowA, rowB) => {
                  if (rowA.num_mutations > rowB.num_mutations) {
                    return 1;
                  }
                  if (rowA.num_mutations < rowB.num_mutations) {
                    return -1;
                  }
                  return 0;
                },
              },
            }),
          ]
        : []),
    ],
    [
      cancerDistributionTableColumnHelper,
      isGene,
      expandedColumnId,
      symbol,
      createSSMAffectedFilters,
      id,
      contextFilters,
      genomicFilters,
      createCNVGainLossFilters,
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
    updatedFullData,
  } = useStandardPagination(formattedData, cancerDistributionTableColumns);

  useEffect(() => handleSortByChange(sorting), [sorting, handleSortByChange]);

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

  const handleExpand = (
    row: Row<CancerDistributionDataType>,
    columnId: string,
  ) => {
    if (
      Object.keys(expanded).length > 0 &&
      row.original.project === expandedRowId &&
      columnId === expandedColumnId
    ) {
      setExpanded({});
    } else if ((row.original[columnId] as string[]).length > 1) {
      setExpanded({ [row.original.project]: true });
      setExpandedColumnId(columnId);
      setExpandedRowId(row.original.project);
    }
  };

  return (
    <>
      <VerticalTable
        data={displayedData}
        columns={cancerDistributionTableColumns}
        columnSorting="manual"
        additionalControls={
          <div className="flex gap-2 mb-2">
            <FunctionButton
              onClick={() => handleJSONDownload(formattedData, isGene)}
              disabled={isFetching}
            >
              JSON
            </FunctionButton>
            <FunctionButton
              onClick={() =>
                handleTSVDownload(
                  updatedFullData,
                  cancerDistributionTableColumns,
                  isGene,
                )
              }
              disabled={isFetching}
            >
              TSV
            </FunctionButton>
          </div>
        }
        expandableColumnIds={["disease_type", "primary_site"]}
        sorting={sorting}
        setSorting={setSorting}
        expanded={expanded}
        getRowCanExpand={() => true}
        setExpanded={handleExpand}
        renderSubComponent={({ row, clickedColumnId }) => (
          <SubrowPrimarySiteDiseaseType row={row} columnId={clickedColumnId} />
        )}
        pagination={{
          page,
          pages,
          size,
          from,
          total,
        }}
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        handleChange={handleChange}
        getRowId={getRowId}
      />
    </>
  );
};

export default CancerDistributionTable;
