import VerticalTable from "@/components/Table/VerticalTable";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { upperFirst } from "lodash";
import { useMemo, useState } from "react";
import { SelectedEntities } from "./types";

type SummaryTableDataType = {
  idx: number;
  entityType: string;
  name: string;
  count: string | number;
};

export const SetOperationsSummaryTable = ({
  sets,
  countHook,
  entityType,
}: {
  sets: SelectedEntities;
  countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
  entityType: "cohort" | "genes" | "mutations";
}): JSX.Element => {
  const { data: summaryCounts, isFetching } = countHook({
    setIds: sets.map((s) => s.id),
  });
  const summaryTableData: SummaryTableDataType[] = useMemo(
    () =>
      sets.map((set, idx) => ({
        idx,
        entityType: upperFirst(entityType),
        name: set.name,
        count: isFetching ? "..." : summaryCounts?.[set.id],
      })),
    [entityType, isFetching, sets, summaryCounts],
  );

  const [summaryTableSorting, setSummaryTableSorting] = useState<SortingState>(
    [],
  );
  const summaryTableColumnsHelper = createColumnHelper<SummaryTableDataType>();
  const summaryTableColumns = useMemo(
    () => [
      summaryTableColumnsHelper.display({
        id: "alias",
        header: "Alias",
        cell: ({ row }) => (
          <span>
            S<sub>{row.original.idx + 1}</sub>
          </span>
        ),
      }),
      summaryTableColumnsHelper.accessor("entityType", {
        id: "entityType",
        header: "Entity Type",
        enableSorting: false,
      }),
      summaryTableColumnsHelper.accessor("name", {
        id: "name",
        header: "Name",
        enableSorting: false,
      }),
      summaryTableColumnsHelper.accessor("count", {
        header: "# Items",
        enableSorting: true,
        cell: ({ getValue }) =>
          getValue() !== undefined ? getValue().toLocaleString() : "...",
      }),
    ],
    [summaryTableColumnsHelper],
  );

  return (
    <VerticalTable
      customDataTestID="table-summary-set-operations"
      data={summaryTableData}
      columns={summaryTableColumns}
      showControls={false}
      sorting={summaryTableSorting}
      setSorting={setSummaryTableSorting}
      columnSorting="enable"
      status={isFetching ? "pending" : "fulfilled"}
      customAriaLabel={"Summary Table"}
    />
  );
};
