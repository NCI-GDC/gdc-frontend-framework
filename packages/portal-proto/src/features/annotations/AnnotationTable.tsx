import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  VisibilityState,
  ColumnOrderState,
  ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  AnnotationDefaults,
  buildCohortGqlOperator,
  useAnnotations,
  GqlUnion,
  SortBy,
  Pagination,
} from "@gff/core";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { statusBooleansToDataStatus } from "src/utils";
import VerticalTable from "@/components/Table/VerticalTable";
import FunctionButton from "@/components/FunctionButton";
import { HandleChangeInput } from "@/components/Table/types";
import { useAppSelector } from "./appApi";
import { selectFilters } from "./annotationBrowserFilterSlice";

type AnnotationTableData =
  | Pick<
      AnnotationDefaults,
      | "annotation_id"
      | "case_id"
      | "case_submitter_id"
      | "entity_type"
      | "entity_id"
      | "entity_submitter_id"
      | "category"
      | "classification"
      | "created_datetime"
      | "status"
      | "notes"
    > & {
      readonly program_name: string;
      readonly project_id: string;
    };

const annotationsTableColumnHelper = createColumnHelper<AnnotationTableData>();

const buildSearchFilters = (searchTerm: string) => {
  return {
    op: "or",
    content: [
      {
        op: "=",
        content: {
          field: "annotation_id",
          value: `*${searchTerm}*`,
        },
      },
      {
        op: "=",
        content: {
          field: "case_id",
          value: `*${searchTerm}*`,
        },
      },
      {
        op: "=",
        content: {
          field: "case_submitter_id",
          value: `*${searchTerm}*`,
        },
      },
      {
        op: "=",
        content: {
          field: "project.project_id",
          value: `*${searchTerm}*`,
        },
      },
      {
        op: "=",
        content: {
          field: "entity_id",
          value: `*${searchTerm}*`,
        },
      },
      {
        op: "=",
        content: {
          field: "entity_submitter_id",
          value: `*${searchTerm}*`,
        },
      },
    ],
  } as GqlUnion;
};

const AnnnotationTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    case_id: false,
    program_name: false,
    entity_id: false,
    status: false,
    notes: false,
  });

  const sortByActions = useCallback((sorting: SortingState) => {
    setSortBy(
      sorting.map((sort) => {
        return {
          field: sort.id === "project_id" ? "project.project_id" : sort.id,
          direction: sort.desc ? "desc" : "asc",
        };
      }),
    );
  }, []);

  useEffect(() => {
    sortByActions(sorting);
  }, [sorting, sortByActions]);

  const filters = useAppSelector((state) => selectFilters(state));

  const { data, isSuccess, isFetching, isError } = useAnnotations({
    filters: searchTerm
      ? buildCohortGqlOperator(filters)
        ? {
            op: "and",
            content: [
              buildSearchFilters(searchTerm),
              buildCohortGqlOperator(filters),
            ],
          }
        : buildSearchFilters(searchTerm)
      : buildCohortGqlOperator(filters),
    expand: ["project", "project.program"],
    size: pageSize,
    from: (activePage - 1) * pageSize,
    sortBy,
  });

  const [formattedTableData, pagination] = useDeepCompareMemo<
    [AnnotationTableData[], Pagination]
  >(() => {
    if (isSuccess && !isFetching) {
      return [
        data?.list.map((d) => ({
          ...d,
          program_name: d?.project?.program?.name,
          project_id: d?.project?.project_id,
        })),
        data.pagination,
      ];
    }

    return [
      [],
      {
        count: undefined,
        from: undefined,
        page: undefined,
        pages: undefined,
        size: undefined,
        sort: undefined,
        total: undefined,
      },
    ];
  }, [data, isSuccess, isFetching]);

  const columns = useMemo<ColumnDef<AnnotationTableData>[]>(
    () => [
      annotationsTableColumnHelper.accessor("annotation_id", {
        id: "annotation_id",
        header: "UUID",
        cell: ({ getValue }) => (
          <Link
            href={`annotations/${getValue()}`}
            className="text-utility-link underline font-content"
          >
            {getValue()}
          </Link>
        ),
      }),
      annotationsTableColumnHelper.accessor("case_id", {
        id: "case_id",
        header: "Case UUID",
        enableSorting: false,
      }),
      annotationsTableColumnHelper.accessor("case_submitter_id", {
        id: "case_submitter_id",
        header: "Case ID",
        cell: ({ getValue, row }) => (
          <Link
            href={`cases/${row.original.case_id}`}
            className="text-utility-link underline font-content"
          >
            {getValue()}
          </Link>
        ),
      }),
      annotationsTableColumnHelper.accessor("program_name", {
        id: "program_name",
        header: "Program",
        enableSorting: false,
      }),
      annotationsTableColumnHelper.accessor("project_id", {
        id: "project_id",
        header: "Project",
        cell: ({ getValue }) => (
          <Link
            href={`projects/${getValue()}`}
            className="text-utility-link underline font-content"
          >
            {getValue()}
          </Link>
        ),
      }),
      annotationsTableColumnHelper.accessor("entity_type", {
        id: "entity_type",
        header: "Entity Type",
      }),
      annotationsTableColumnHelper.accessor("entity_id", {
        id: "entity_id",
        header: "Entity UUID",
        enableSorting: false,
      }),
      annotationsTableColumnHelper.accessor("entity_submitter_id", {
        id: "entity_submitter_id",
        header: "Entity ID",
      }),
      annotationsTableColumnHelper.accessor("category", {
        id: "category",
        header: "Category",
      }),
      annotationsTableColumnHelper.accessor("classification", {
        id: "classification",
        header: "Classification",
      }),
      annotationsTableColumnHelper.accessor("created_datetime", {
        id: "created_datetime",
        header: "Created Datetime",
      }),
      annotationsTableColumnHelper.accessor("status", {
        id: "status",
        header: "Status",
        enableSorting: false,
      }),
      annotationsTableColumnHelper.accessor("notes", {
        id: "notes",
        header: "Notes",
        enableSorting: false,
      }),
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => column.id as string),
  );

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setActivePage(1);
        break;
      case "newPageNumber":
        setActivePage(obj.newPageNumber);
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch);
        setActivePage(1);
        break;
    }
  };

  return (
    <VerticalTable
      additionalControls={
        <div className="flex flex-row gap-2 items-center">
          <FunctionButton data-testid="button-json-projects-table">
            JSON
          </FunctionButton>
          <FunctionButton data-testid="button-tsv-projects-table">
            TSV
          </FunctionButton>
          <span className="font-normal text-xl ml-auto mr-2">
            Total of <strong>{data.count.toLocaleString()}</strong> Annotations
          </span>
        </div>
      }
      data={formattedTableData}
      columns={columns}
      showControls
      search={{
        enabled: true,
        tooltip:
          "e.g. TCGA-BRCA, TCGA-ZX-AA5X, c8449103-afb0-4e43-ac04-c4ef54a8cdb0",
      }}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      pagination={{
        label: "annotations",
        ...pagination,
      }}
      handleChange={handleChange}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnSorting="manual"
      sorting={sorting}
      setSorting={setSorting}
    />
  );
};

export default AnnnotationTable;
