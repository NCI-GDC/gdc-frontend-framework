import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import Link from "next/link";
import {
  useGetProjectsQuery,
  FilterSet,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  addNewCohortWithFilterAndMessage,
  useCoreDispatch,
} from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import { calculatePercentageAsNumber } from "src/utils";
import {
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { NumeratorDenominator } from "@/components/expandableTables/shared";
import { CohortCreationButton } from "@/components/CohortCreationButton/";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import {
  ExpandedState,
  Row,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { HeaderTooltip } from "@/components/Table/HeaderTooltip";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import { statusBooleansToDataStatus } from "../shared/utils";
import {
  CancerDistributionDataType,
  CancerDistributionTableProps,
  CreateSSMCohortParams,
  handleJSONDownload,
  handleTSVDownload,
} from "./utils";
import SubrowPrimarySiteDiseaseType from "../shared/SubrowPrimarySiteDiseaseType";

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
  const coreDispatch = useCoreDispatch();
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const [loading, setLoading] = useState(false);
  const [createCohortParams, setCreateCohortParams] = useState<
    CreateSSMCohortParams | undefined
  >(undefined);
  const [showCreateCohort, setShowCreateCohort] = useState(false);

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

  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [response.isLoading]);

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
                    cnv_loss: {
                      numerator: data.cnvLoss[d.key] || 0,
                      denominator: data.cnvLoss[d.key] || 0,
                    },
                    cnv_loss_percent: calculatePercentageAsNumber(
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

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [expandedColumnId, setExpandedColumnId] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(-1);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "#_ssm_affected_cases",
      desc: true,
    },
  ]);

  const generateSortingFn =
    (property: string) =>
    (rowA: CancerDistributionDataType, rowB: CancerDistributionDataType) => {
      if (rowA[property] > rowB[property]) {
        return 1;
      }
      if (rowA[property] < rowB[property]) {
        return -1;
      }
      return 0;
    };

  const customSortingFns = useMemo(
    () => ({
      "#_ssm_affected_cases": generateSortingFn("ssm_percent"),
      "#_cnv_gains": generateSortingFn("cnv_gains_percent"),
      "#_cnv_loss": generateSortingFn("cnv_loss_percent"),
      "#_mutations": generateSortingFn("num_mutations"),
    }),
    [],
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
  } = useStandardPagination(formattedData, customSortingFns);

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
      row.index === expandedRowId &&
      columnId === expandedColumnId
    ) {
      setExpanded({});
    } else if ((row.original[columnId] as string[]).length > 1) {
      setExpanded({ [row.index]: true });
      setExpandedColumnId(columnId);
      setExpandedRowId(row.index);
    }
  };

  const cancerDistributionTableColumnHelper =
    createColumnHelper<CancerDistributionDataType>();

  const cancerDistributionTableColumns = useMemo(
    () => [
      cancerDistributionTableColumnHelper.accessor("project", {
        id: "project",
        header: "Project",
        cell: ({ getValue }) => (
          <Link href={`/projects/${getValue()}`}>
            <a className="text-utility-link underline">{getValue()}</a>
          </Link>
        ),
        enableSorting: false,
      }),
      cancerDistributionTableColumnHelper.accessor("disease_type", {
        id: "disease_type",
        header: "Disease Type",
        cell: ({ row, getValue }) => {
          return getValue()?.length === 0
            ? "--"
            : getValue()?.length === 1
            ? getValue()
            : row.getCanExpand() && (
                <div
                  aria-label="Expand section"
                  className="flex items-center text-primary cursor-pointer gap-2"
                >
                  {row.getIsExpanded() &&
                  expandedColumnId === "disease_type" ? (
                    <UpIcon size="1.25em" className="text-accent" />
                  ) : (
                    <DownIcon size="1.25em" className="text-accent" />
                  )}
                  <span
                    className={`whitespace-nowrap ${
                      row.getIsExpanded() &&
                      expandedColumnId === "disease_type" &&
                      "font-bold"
                    }`}
                  >
                    {getValue()?.length.toLocaleString().padStart(6)} Disease
                    Types
                  </span>
                </div>
              );
        },
      }),
      cancerDistributionTableColumnHelper.accessor("primary_site", {
        id: "primary_site",
        header: "Primary Site",
        cell: ({ row, getValue }) => {
          return getValue()?.length === 0
            ? "--"
            : getValue()?.length === 1
            ? getValue()
            : row.getCanExpand() && (
                <div
                  aria-label="Expand section"
                  className="flex items-center text-primary cursor-pointer gap-2"
                >
                  {row.getIsExpanded() &&
                  expandedColumnId === "primary_site" ? (
                    <UpIcon size="1.25em" className="text-accent" />
                  ) : (
                    <DownIcon size="1.25em" className="text-accent" />
                  )}

                  <span
                    className={`whitespace-nowrap ${
                      row.getIsExpanded() &&
                      expandedColumnId === "primary_site" &&
                      "font-bold"
                    }`}
                  >
                    {getValue()?.length.toLocaleString().padStart(6)} Primary
                    Sites
                  </span>
                </div>
              );
        },
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
            handleClick={() => {
              setCreateCohortParams({
                project: row.original.project,
                id: id,
                mode: "SSM",
                gene: undefined,
                filter: undefined,
              });
              setShowCreateCohort(true);
            }}
            label={
              <NumeratorDenominator
                numerator={row.original.ssm_affected_cases.numerator || 0}
                denominator={row.original.ssm_affected_cases.denominator || 0}
                boldNumerator
              />
            }
          />
        ),
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
                  handleClick={() => {
                    setCreateCohortParams({
                      project: row.original.project,
                      id: id,
                      mode: "CNV",
                      gene: undefined,
                      filter: "Gain",
                    });
                    setShowCreateCohort(true);
                  }}
                  label={
                    <NumeratorDenominator
                      numerator={row.original.cnv_gains.numerator || 0}
                      denominator={row.original.cnv_gains.denominator || 0}
                      boldNumerator
                    />
                  }
                />
              ),
              enableSorting: true,
            }),
            cancerDistributionTableColumnHelper.accessor("cnv_loss_percent", {
              id: "#_cnv_loss",
              header: () => (
                <HeaderTooltip
                  title="# CNV Loss"
                  tooltip={`# Cases tested for CNV in the Project affected by CNV loss event in ${symbol}
                  / # Cases tested for Copy Number Variation in the Project
                  `}
                />
              ),
              cell: ({ row }) => (
                <CohortCreationButton
                  numCases={row.original.cnv_loss.numerator || 0}
                  handleClick={() => {
                    setCreateCohortParams({
                      project: row.original.project,
                      id: id,
                      mode: "CNV",
                      gene: undefined,
                      filter: "Loss",
                    });
                    setShowCreateCohort(true);
                  }}
                  label={
                    <NumeratorDenominator
                      numerator={row.original.cnv_loss.numerator || 0}
                      denominator={row.original.cnv_loss.denominator || 0}
                      boldNumerator
                    />
                  }
                />
              ),
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
            }),
          ]
        : []),
    ],
    [cancerDistributionTableColumnHelper, expandedColumnId, id, isGene, symbol],
  );

  const createSSMAffectedFilters = useCallback(
    async (project: string, id: string): Promise<FilterSet> => {
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
    [contextFilters, createSet, isGene],
  );

  const createSSMAffectedFiltersCohort = async (
    name: string,
    project: string,
    id: string,
  ) => {
    const mainFilter = await createSSMAffectedFilters(project, id);
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: mainFilter,
        name,
        message: "newCasesCohort",
      }),
    );
  };

  const createCNVGainLossFilters = useCallback(
    async (
      project: string,
      gene: string,
      filter: "Loss" | "Gain",
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
            },
          };
        });
    },
    [contextFilters, createSet, id],
  );

  const createCNVGainLossCohort = async (
    name: string,
    project: string,
    gene: string,
    filter: "Loss" | "Gain",
  ) => {
    const mainFilter = await createCNVGainLossFilters(project, gene, filter);
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: mainFilter,
        name,
        message: "newCasesCohort",
      }),
    );
  };

  return (
    <>
      {loading && <LoadingOverlay visible />}
      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            if (createCohortParams.mode === "SSM") {
              createSSMAffectedFiltersCohort(
                newName,
                createCohortParams.project,
                createCohortParams.id,
              );
            } else {
              createCNVGainLossCohort(
                newName,
                createCohortParams.project,
                createCohortParams.gene,
                createCohortParams.filter,
              );
            }
          }}
        />
      )}
      <VerticalTable
        data={displayedData}
        columns={cancerDistributionTableColumns}
        columnSorting="manual"
        additionalControls={
          <div className="flex gap-2 mb-2">
            <FunctionButton
              onClick={() => handleJSONDownload(formattedData, isGene)}
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
      />
    </>
  );
};

export default CancerDistributionTable;
