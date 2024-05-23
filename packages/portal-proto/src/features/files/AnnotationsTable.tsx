import React, { useMemo, useState, useEffect } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  VisibilityState,
  ColumnOrderState,
  ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { FileAnnotationsType, useCoreDispatch } from "@gff/core";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import FunctionButton from "@/components/FunctionButton";
import VerticalTable from "@/components/Table/VerticalTable";
import { HandleChangeInput } from "@/components/Table/types";
import { HeaderTitle } from "@/components/tailwindComponents";
import useStandardPagination from "@/hooks/useStandardPagination";
import { downloadTSV } from "@/components/Table/utils";

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

const matchSearchTerm = (field: string, searchTerm: string) =>
  field?.toLowerCase().indexOf(searchTerm) > -1;
const annotationsTableColumnHelper = createColumnHelper<AnnotationTableData>();

const AnnotationsTable: React.FC<AnnotationsTableProps> = ({
  annotations,
}: AnnotationsTableProps) => {
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    // case_id: false,
    entity_id: false,
    status: false,
    notes: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const memoizedAnnotations = useDeepCompareMemo(
    () => [...annotations],
    [annotations],
  );

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

  useEffect(() => {
    if (searchTerm) {
      setFilteredTableData(
        memoizedAnnotations.filter((annotation) => {
          return (
            matchSearchTerm(annotation?.annotation_id, searchTerm) ||
            matchSearchTerm(annotation?.case_id, searchTerm) ||
            matchSearchTerm(annotation?.case_submitter_id, searchTerm) ||
            matchSearchTerm(annotation?.entity_id, searchTerm) ||
            matchSearchTerm(annotation?.entity_submitter_id, searchTerm)
          );
        }),
      );
    } else {
      setFilteredTableData(memoizedAnnotations);
    }
  }, [searchTerm, memoizedAnnotations]);

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
  } = useStandardPagination(filteredTableData);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => column.id as string),
  );

  useEffect(() => handleSortByChange(sorting), [sorting, handleSortByChange]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch?.toLowerCase());
        break;
    }
  };

  const coreDispatch = useCoreDispatch();

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "annotations",
      method: "POST",
      params: {
        filters: {
          op: "=",
          content: {
            field: "annotation_id",
            value: memoizedAnnotations.map(
              (annotation) => annotation.annotation_id,
            ),
          },
        },
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
      tableData: displayedData,
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
        data={displayedData}
        columns={columns}
        showControls
        search={{
          enabled: true,
          tooltip: "e.g. TCGA-ZX-AA5X, c8449103-afb0-4e43-ac04-c4ef54a8cdb0",
        }}
        baseZIndex={400}
        pagination={{
          page,
          pages,
          size,
          from,
          total,
          label: "annotations",
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
