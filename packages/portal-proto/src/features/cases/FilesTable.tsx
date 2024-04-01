import { FileAccessBadge } from "@/components/FileAccessBadge";
import FunctionButton from "@/components/FunctionButton";
import VerticalTable from "@/components/Table/VerticalTable";
import { HandleChangeInput } from "@/components/Table/types";
import { TableActionButtons } from "@/components/TableActionButtons";
import { HeaderTitle } from "@/components/tailwindComponents";
import {
  capitalize,
  fileInCart,
  statusBooleansToDataStatus,
} from "@/utils/index";
import {
  GdcFile,
  SortBy,
  selectCart,
  useCoreDispatch,
  useCoreSelector,
  useGetFilesQuery,
} from "@gff/core";
import { Tooltip } from "@mantine/core";
import {
  ColumnDef,
  ColumnOrderState,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from "@tanstack/react-table";
import fileSize from "filesize";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import { mapGdcFileToCartFile } from "../files/utils";
import download from "@/utils/download";
import { downloadTSV } from "@/components/Table/utils";
import { convertDateToString } from "@/utils/date";

interface FilesTableProps {
  caseId: string;
}

export type CaseFilesTableDataType = Pick<
  GdcFile,
  | "access"
  | "file_name"
  | "data_category"
  | "data_type"
  | "data_format"
  | "experimental_strategy"
  | "platform"
  | "file_size"
> & { file: GdcFile; file_uuid: string };

const caseFilesTableColumnHelper = createColumnHelper<CaseFilesTableDataType>();

const FilesTable = ({ caseId }: FilesTableProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [tableData, setTableData] = useState<CaseFilesTableDataType[]>([]);
  const [sortBy, setSortBy] = useState<SortBy[]>([
    { field: "experimental_strategy", direction: "asc" },
  ]);
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const sortByActions = (sortByObj: SortingState) => {
    const tempSortBy: SortBy[] = sortByObj.map((sortObj) => ({
      field: sortObj.id === "file_uuid" ? "file_id" : sortObj.id,
      direction: sortObj.desc ? "desc" : "asc",
    }));
    setSortBy(tempSortBy);
  };

  const { data, isFetching, isSuccess, isError } = useGetFilesQuery({
    size: pageSize,
    from: pageSize * (activePage - 1),
    filters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [caseId],
          },
        },
        {
          op: "or",
          content: [
            {
              op: "=",
              content: {
                field: "files.file_id",
                value: `*${searchTerm}*`,
              },
            },
            {
              op: "=",
              content: {
                field: "files.file_name",
                value: `*${searchTerm}*`,
              },
            },
          ],
        },
      ],
    },
    sortBy: sortBy,
  });

  useDeepCompareEffect(() => {
    setTableData(
      isSuccess
        ? (data?.files.map((file: GdcFile) => ({
            file: file,
            file_uuid: file.file_id,
            access: file.access,
            file_name: file.file_name,
            data_category: file.data_category,
            data_type: file.data_type,
            data_format: file.data_format,
            experimental_strategy: file.experimental_strategy || "--",
            platform: file.platform || "--",
            file_size: file.file_size,
            annotations: file.annotations,
          })) as CaseFilesTableDataType[])
        : [],
    );
  }, [isSuccess, data?.files]);

  const pagination = useDeepCompareMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (activePage - 1) * pageSize,
          page: activePage,
          pages: Math.ceil(data?.pagination?.total / pageSize),
          size: pageSize,
          total: data?.pagination?.total,
          sort: "None",
          label: "files",
        }
      : {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
        };
  }, [pageSize, activePage, data?.pagination?.total, isSuccess]);

  const caseFilesTableDefaultColumns = useDeepCompareMemo<
    ColumnDef<CaseFilesTableDataType>[]
  >(
    () => [
      caseFilesTableColumnHelper.accessor("access", {
        id: "access",
        header: "Access",
        cell: ({ getValue }) => <FileAccessBadge access={getValue()} />,
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("file_name", {
        id: "file_name",
        header: "File Name",
        cell: ({ row }) => (
          <Link
            href={`/files/${row.original.file_uuid}`}
            className="underline text-primary"
          >
            {row.original.file_name}
          </Link>
        ),
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("file_uuid", {
        id: "file_uuid",
        header: "File UUID",
        cell: ({ row }) => (
          <Link
            href={`/files/${row.original.file_uuid}`}
            className="underline text-primary"
          >
            {row.original.file_uuid}
          </Link>
        ),
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("data_category", {
        id: "data_category",
        header: "Data Category",
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("data_type", {
        id: "data_type",
        header: "Data Type",
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("data_format", {
        id: "data_format",
        header: "Data Format",
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("experimental_strategy", {
        id: "experimental_strategy",
        header: "Experimental Strategy",
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("platform", {
        id: "platform",
        header: "Platform",
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.accessor("file_size", {
        id: "file_size",
        header: "File Size",
        cell: ({ row }) => <>{fileSize(row.original.file_size)}</>,
        enableSorting: true,
      }),
      caseFilesTableColumnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const isOutputFileInCart = fileInCart(
            currentCart,
            row.original.file_uuid,
          );
          return (
            <TableActionButtons
              isOutputFileInCart={isOutputFileInCart}
              file={mapGdcFileToCartFile([row.original.file])}
              downloadFile={row.original.file}
            />
          );
        },
      }),
    ],
    [currentCart],
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    caseFilesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "experimental_strategy", desc: false },
  ]);
  useEffect(() => {
    sortByActions(sorting);
  }, [sorting]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    file_uuid: false,
    data_type: false,
    platform: false,
  });

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setActivePage(1);
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setActivePage(obj.newPageNumber);
        break;
      case "newSearch":
        setActivePage(1);
        setSearchTerm(obj.newSearch);
        break;
    }
  };

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "files",
      method: "POST",
      params: {
        filters: {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [caseId],
          },
        },
        size: 10000,
        attachment: true,
        format: "JSON",
        pretty: true,
        related_files: true,
        fields: [
          "file_id",
          "access",
          "file_name",
          "cases.case_id",
          "cases.project.project_id",
          "data_category",
          "data_type",
          "data_format",
          "experimental_strategy",
          "platform",
          "file_size",
        ].join(","),
      },
      dispatch,
    });
  };

  const handleDownloadTSV = () => {
    downloadTSV({
      tableData,
      columnOrder,
      fileName: `files-table.${convertDateToString(new Date())}.tsv`,
      columnVisibility,
      columns: caseFilesTableDefaultColumns,
      option: {
        blacklist: ["action"],
        overwrite: {
          access: {
            composer: (file) => capitalize(file.access),
          },
        },
      },
    });
  };

  return (
    <>
      <HeaderTitle>Files</HeaderTitle>
      <VerticalTable
        customDataTestID="table-files-project-summary"
        data={tableData}
        columns={caseFilesTableDefaultColumns}
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        additionalControls={
          <div className="flex gap-2 mb-2">
            <Tooltip label="Download JSON">
              <FunctionButton
                data-testid="button-json-files-case-summary"
                onClick={handleDownloadJSON}
                aria-label="Download JSON"
              >
                JSON
              </FunctionButton>
            </Tooltip>
            <Tooltip label="Download TSV">
              <FunctionButton
                data-testid="button-tsv-files-case-summary"
                onClick={handleDownloadTSV}
                aria-label="Download TSV"
              >
                TSV
              </FunctionButton>
            </Tooltip>
          </div>
        }
        showControls={true}
        setColumnVisibility={setColumnVisibility}
        columnVisibility={columnVisibility}
        columnOrder={columnOrder}
        columnSorting="manual"
        handleChange={handleChange}
        pagination={pagination}
        search={{
          enabled: true,
          tooltip:
            "e.g. HCM-CSHL-0062-C18.json, 4b5f5ba0-3010-4449-99d4-7bd7a6d73422",
        }}
        baseZIndex={400}
        sorting={sorting}
        setSorting={setSorting}
        setColumnOrder={setColumnOrder}
      />
    </>
  );
};

export default FilesTable;
