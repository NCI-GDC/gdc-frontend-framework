import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import fileSize from "filesize";
import { capitalize } from "lodash";
import {
  useCoreSelector,
  selectCart,
  useGetFilesQuery,
  useCoreDispatch,
  CartFile,
  SortBy,
} from "@gff/core";
import { RemoveFromCartButton } from "./updateCart";
import FunctionButton from "@/components/FunctionButton";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import {
  getAnnotationsLinkParamsFromFiles,
  statusBooleansToDataStatus,
} from "../shared/utils";
import { SummaryModalContext } from "src/utils/contexts";
import Link from "next/link";
import { FilesTableDataType } from "../repositoryApp/FilesTable";
import {
  ColumnDef,
  ColumnOrderState,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from "@tanstack/react-table";
import VerticalTable from "@/components/Table/VerticalTable";
import { HandleChangeInput } from "@/components/Table/types";
import { downloadTSV } from "@/components/Table/utils";

interface FilesTableProps {
  readonly filesByCanAccess: Record<string, CartFile[]>;
}

const FilesTable: React.FC<FilesTableProps> = () => {
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const cart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [tableData, setTableData] = useState<FilesTableDataType[]>([]);
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const sortByActions = (sortByObj: SortingState) => {
    const tempSortBy: SortBy[] = sortByObj.map((sortObj) => {
      let tempSortId = sortObj.id;
      // map sort ids to api ids
      if (sortObj.id === "project") {
        tempSortId = "cases.project.project_id";
      } else if (sortObj.id === "file_uuid") {
        tempSortId = "file_id";
      }
      return {
        field: tempSortId,
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
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
            field: "files.file_id",
            value: cart.map((f) => f.file_id),
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
    expand: ["annotations", "cases", "cases.project"],
    sortBy: sortBy,
  });

  useEffect(() => {
    setTableData(
      isSuccess
        ? (data?.files.map((file) => ({
            file: file,
            file_uuid: file.file_id,
            access: file.access,
            file_name: file.file_name,
            cases: file.cases,
            project: file.project_id,
            data_category: file.data_category,
            data_type: file.data_type,
            data_format: file.data_format,
            experimental_strategy: file.experimental_strategy || "--",
            platform: file.platform || "--",
            file_size: fileSize(file.file_size),
            annotations: file.annotations,
          })) as FilesTableDataType[])
        : [],
    );
  }, [isSuccess, data?.files, setEntityMetadata]);

  const cartFilesTableColumnHelper = createColumnHelper<FilesTableDataType>();
  const cartFilesTableDefaultColumns = useMemo<ColumnDef<FilesTableDataType>[]>(
    () => [
      cartFilesTableColumnHelper.display({
        id: "remove",
        header: "Remove",
        cell: ({ row }) => (
          <RemoveFromCartButton files={[row.original.file]} iconOnly />
        ),
      }),
      cartFilesTableColumnHelper.accessor("file_uuid", {
        id: "file_uuid",
        header: "File UUID",
        cell: ({ getValue }) => (
          <PopupIconButton
            handleClick={() =>
              setEntityMetadata({
                entity_type: "file",
                entity_id: getValue(),
              })
            }
            label={getValue()}
            customStyle="text-utility-link underline font-content text-left"
          />
        ),
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("access", {
        id: "access",
        header: "Access",
        cell: ({ getValue }) => <FileAccessBadge access={getValue()} />,
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("file_name", {
        id: "file_name",
        header: "File Name",
        cell: ({ getValue, row }) => (
          <PopupIconButton
            handleClick={() =>
              setEntityMetadata({
                entity_type: "file",
                entity_id: row.original.file_uuid,
              })
            }
            label={getValue()}
            customStyle="text-utility-link underline font-content text-left"
          />
        ),
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.display({
        id: "cases",
        header: "Cases",
        cell: ({ row }) => (
          <PopupIconButton
            handleClick={() => {
              if (row.original.cases?.length === 0) return;
              setEntityMetadata({
                entity_type: row.original.cases?.length === 1 ? "case" : "file",
                entity_id:
                  row.original.cases?.length === 1
                    ? row.original.cases?.[0].case_id
                    : row.original.file_uuid,
              });
            }}
            label={row.original.cases?.length.toLocaleString() || 0}
            customAriaLabel={`Open ${
              row.original.cases?.length === 1 ? "case" : "file"
            } information in modal`}
            customStyle={`font-content ${
              row.original.cases?.length > 0
                ? "text-utility-link underline"
                : "cursor-default"
            }`}
          />
        ),
      }),
      cartFilesTableColumnHelper.accessor("project", {
        id: "project",
        header: "Project",
        cell: ({ getValue }) => (
          <PopupIconButton
            handleClick={() =>
              setEntityMetadata({
                entity_type: "project",
                entity_id: getValue(),
              })
            }
            label={getValue()}
            customStyle="text-utility-link underline font-content"
          />
        ),
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("data_category", {
        id: "data_category",
        header: "Data Category",
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("data_type", {
        id: "data_type",
        header: "Data Type",
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("data_format", {
        id: "data_format",
        header: "Data Format",
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("experimental_strategy", {
        id: "experimental_strategy",
        header: "Experimental Strategy",
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("platform", {
        id: "platform",
        header: "Platform",
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.accessor("file_size", {
        id: "file_size",
        header: "File Size",
        enableSorting: true,
      }),
      cartFilesTableColumnHelper.display({
        id: "annotations",
        header: "Annotations",
        cell: ({ row }) => (
          <span className="font-content">
            {getAnnotationsLinkParamsFromFiles(row.original.file) ? (
              <Link
                href={getAnnotationsLinkParamsFromFiles(row.original.file)}
                passHref
              >
                <a
                  className="text-utility-link underline font-content"
                  target="_blank"
                >
                  {row.original.annotations.length}
                </a>
              </Link>
            ) : (
              row.original?.annotations?.length ?? 0
            )}
          </span>
        ),
      }),
    ],
    [cartFilesTableColumnHelper, setEntityMetadata],
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    cartFilesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    file_uuid: false,
    data_type: false,
    experimental_strategy: false,
    platform: false,
  });

  const handleChange = useCallback((obj: HandleChangeInput) => {
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
  }, []);

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "files",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
      params: {
        filters: {
          op: "in",
          content: {
            field: "files.file_id",
            value: cart.map((f) => f.file_id),
          },
        },
        size: 10000,
        attachment: true,
        format: "JSON",
        pretty: true,
        annotations: true,
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
          "annotations.annotation_id",
        ].join(","),
      },
      dispatch,
      queryParams: `?${new URLSearchParams({
        annotations: "true",
        related_files: "true",
      }).toString()}`,
    });
  };

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    sortByActions(sorting);
  }, [sorting]);

  const handleDownloadTSV = () => {
    downloadTSV({
      tableData,
      columnOrder,
      fileName: `files-table.${convertDateToString(new Date())}.tsv`,
      columnVisibility,
      columns: cartFilesTableDefaultColumns,
      option: {
        blacklist: ["remove"],
        overwrite: {
          access: {
            composer: (file) => capitalize(file.access),
          },
          cases: {
            composer: (file) => file.cases?.length.toLocaleString() || 0,
          },
          annotations: {
            composer: (file) => file.annotations?.length || 0,
          },
        },
      },
    });
  };

  return (
    <VerticalTable
      data={tableData}
      columns={cartFilesTableDefaultColumns}
      additionalControls={
        <div className="flex gap-2 mb-2">
          <FunctionButton onClick={handleDownloadJSON}>JSON</FunctionButton>
          <FunctionButton onClick={handleDownloadTSV}>TSV</FunctionButton>
        </div>
      }
      pagination={{
        ...data?.pagination,
        label: "files",
      }}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      handleChange={handleChange}
      search={{
        enabled: true,
      }}
      showControls={true}
      setColumnVisibility={setColumnVisibility}
      columnVisibility={columnVisibility}
      columnOrder={columnOrder}
      columnSorting="manual"
      sorting={sorting}
      setSorting={setSorting}
      setColumnOrder={setColumnOrder}
    />
  );
};

export default FilesTable;
