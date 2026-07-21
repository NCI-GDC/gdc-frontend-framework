import { createColumnHelper } from "@tanstack/react-table";
import { useDeepCompareMemo } from "use-deep-compare";
import Link from "next/link";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";
import { HeaderTooltip } from "@/components/Table/HeaderTooltip";
import CohortCreationButton from "@/components/CohortCreationButton";
import NumeratorDenominator from "@/components/NumeratorDenominator";
import { FilterSet } from "@gff/core";
import { CancerDistributionSSMType } from "../types";

const createSSMAffectedFilters = (
  project: string,
  ssm_id: string,
): FilterSet => {
  {
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
          operands: [ssm_id],
        },
      },
    };
  }
};

const cancerDistributionTableColumnHelper =
  createColumnHelper<CancerDistributionSSMType>();

export const useSSMCancerDistributionColumns = ({
  symbol,
  expandedColumnId,
  ssm_id,
}: {
  symbol: string;
  expandedColumnId?: string;
  ssm_id: string;
}) => {
  return useDeepCompareMemo(() => {
    const baseColumns = [
      cancerDistributionTableColumnHelper.accessor("project", {
        id: "project" as const,
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
        id: "disease_type" as const,
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
        id: "primary_site" as const,
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
      cancerDistributionTableColumnHelper.accessor(
        "ssm_affected_cases_percent",
        {
          id: "#_ssm_affected_cases" as const,
          header: () => (
            <HeaderTooltip
              title="# SSM Affected Cases"
              tooltip={`# Cases in the Project affected by ${symbol} / # Cases tested for Simple Somatic Mutations in the Project`}
            />
          ),
          cell: ({ row }) => (
            <CohortCreationButton
              numCases={row.original.ssm_affected_cases.numerator || 0}
              filters={createSSMAffectedFilters(row.original.project, ssm_id)}
              label={
                <NumeratorDenominator
                  numerator={row.original.ssm_affected_cases.numerator || 0}
                  denominator={row.original.ssm_affected_cases.denominator || 0}
                  boldNumerator
                />
              }
              createStaticCohort
            />
          ),
          meta: {
            sortingFn: (rowA, rowB) => {
              if (
                rowA.ssm_affected_cases_percent >
                rowB.ssm_affected_cases_percent
              ) {
                return 1;
              }
              if (
                rowA.ssm_affected_cases_percent <
                rowB.ssm_affected_cases_percent
              ) {
                return -1;
              }
              return 0;
            },
          },
          enableSorting: true,
        },
      ),
    ];

    return baseColumns;
  }, [symbol, expandedColumnId, ssm_id]);
};
