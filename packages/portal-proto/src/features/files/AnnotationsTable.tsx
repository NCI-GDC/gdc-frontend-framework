import React, { useMemo, useState, useEffect } from "react";
import {
  VisibilityState,
  ColumnOrderState,
  ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  FileAnnotationsType,
  useCoreDispatch,
  GqlUnion,
  GqlOperation,
  useGetAnnotationsQuery,
  SortBy,
  Pagination,
  AnnotationDefaults,
  GqlIncludes,
} from "@gff/core";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import FunctionButton from "@/components/FunctionButton";
import VerticalTable from "@/components/Table/VerticalTable";
import { HandleChangeInput } from "@/components/Table/types";
import { HeaderTitle } from "@/components/tailwindComponents";
import { downloadTSV } from "@/components/Table/utils";
import TotalItems from "@/components/Table/TotalItem";
import { useDeepCompareMemo } from "use-deep-compare";

interface AnnotationsTableProps {
  readonly annotations: ReadonlyArray<FileAnnotationsType>;
}
// TODO when DEV-2653 is fixed, re-add case ID col, hide case UUID col by default
type AnnotationTableData = Pick<
  FileAnnotationsType,
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
>;

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
    ],
  } as GqlUnion;
};

const annotationsTableColumnHelper = createColumnHelper<AnnotationTableData>();

const AnnotationsTable: React.FC<AnnotationsTableProps> = ({
  annotations,
}: AnnotationsTableProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    // TODO when DEV-2653 is fixed, re-add case ID col, hide case UUID col by default
    // case_id: false,
    entity_id: false,
    status: false,
    notes: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setSortBy(
      sorting.map((sort) => ({
        field: sort.id,
        direction: sort.desc ? "desc" : "asc",
      })),
    );
  }, [sorting]);

  const filters: GqlIncludes = {
    op: "in",
    content: {
      field: "annotation_id",
      value: annotations.map((annotation) => annotation.annotation_id),
    },
  };

  const tableFilters: GqlOperation = searchTerm
    ? filters
      ? {
          op: "and",
          content: [buildSearchFilters(searchTerm), filters],
        }
      : buildSearchFilters(searchTerm)
    : filters;

  const { data, isSuccess, isFetching } = useGetAnnotationsQuery({
    request: {
      filters: tableFilters,
      size: pageSize,
      from: (activePage - 1) * pageSize,
      sortBy,
    },
  });

  const [formattedTableData, pagination] = useDeepCompareMemo<
    [AnnotationDefaults[], Pagination]
  >(() => {
    if (isSuccess && !isFetching) {
      return [data?.hits ? [...data.hits] : [], data.pagination];
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
            href={`/annotations/${getValue()}`}
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
        // TODO when DEV-2653 is fixed, re-add case ID col, hide case UUID col by default
        // cell: ({ getValue }) => getValue() ?? "--",
        cell: ({ getValue, row }) =>
          getValue() ? (
            <Link
              href={`/cases/${row.original.case_id}`}
              className="text-utility-link underline font-content"
            >
              {getValue()}
            </Link>
          ) : (
            "--"
          ),
      }),
      // TODO when DEV-2653 is fixed, re-add case ID col, hide case UUID col by default
      // annotationsTableColumnHelper.accessor("case_submitter_id", {
      //   id: "case_submitter_id",
      //   header: "Case ID",
      //   cell: ({ getValue, row }) =>
      //     getValue() ? (
      //       <Link
      //         href={`/cases/${row.original.case_id}`}
      //         className="text-utility-link underline font-content"
      //       >
      //         {getValue()}
      //       </Link>
      //     ) : (
      //       "--"
      //     ),
      // }),
      annotationsTableColumnHelper.accessor("entity_type", {
        id: "entity_type",
        header: "Entity Type",
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("entity_id", {
        id: "entity_id",
        header: "Entity UUID",
        enableSorting: false,
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("entity_submitter_id", {
        id: "entity_submitter_id",
        header: "Entity ID",
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("category", {
        id: "category",
        header: "Category",
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("classification", {
        id: "classification",
        header: "Classification",
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("created_datetime", {
        id: "created_datetime",
        header: "Created Datetime",
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("status", {
        id: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ getValue }) => getValue() ?? "--",
      }),
      annotationsTableColumnHelper.accessor("notes", {
        id: "notes",
        header: "Notes",
        enableSorting: false,
        cell: ({ getValue }) => getValue() ?? "--",
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

  const coreDispatch = useCoreDispatch();

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "annotations",
      method: "POST",
      params: {
        filters: tableFilters,
        attachment: true,
        format: "JSON",
        pretty: true,
        fields: [
          "annotation_id",
          "case_id",
          "case_submitter_id",
          "project.program.name",
          "project.project_id",
          "entity_type",
          "entity_id",
          "entity_submitter_id",
          "category",
          "classification",
          "created_datetime",
          "status",
          "notes",
        ].join(","),
      },
      dispatch: coreDispatch,
    });
  };

  const handleDownloadTSV = () => {
    downloadTSV<AnnotationTableData>({
      tableData: formattedTableData,
      columnOrder,
      columnVisibility,
      columns,
      fileName: `annotations-table.${convertDateToString(new Date())}.tsv`,
    });
  };

  return (
    <>
      <HeaderTitle>Annotations</HeaderTitle>
      <VerticalTable
        customDataTestID="table-annotations-file-summary"
        tableTitle={
          <TotalItems total={annotations?.length} itemName="annotation" />
        }
        additionalControls={
          <div className="flex gap-2">
            <FunctionButton
              data-testid="button-json-projects-table"
              onClick={handleDownloadJSON}
            >
              JSON
            </FunctionButton>
            <FunctionButton
              data-testid="button-tsv-projects-table"
              onClick={handleDownloadTSV}
            >
              TSV
            </FunctionButton>
          </div>
        }
        data={formattedTableData}
        columns={columns}
        showControls
        search={{
          enabled: true,
          tooltip: "e.g. TCGA-ZX-AA5X, c8449103-afb0-4e43-ac04-c4ef54a8cdb0",
        }}
        baseZIndex={400}
        pagination={{
          label: "annotations",
          ...pagination,
        }}
        handleChange={handleChange}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnSorting="enable"
        sorting={sorting}
        setSorting={setSorting}
        status="fulfilled"
      />
    </>
  );
};

export default AnnotationsTable;
