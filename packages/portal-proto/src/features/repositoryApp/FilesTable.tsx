import { useState, useContext, useEffect, useMemo } from "react";
import { capitalize } from "lodash";
import fileSize from "filesize";
import { SingleItemAddToCartButton } from "../cart/updateCart";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  useTotalFileSizeQuery,
  GdcFile,
  Operation,
  useGetFilesQuery,
  SortBy,
  AccessType,
  FileCaseType,
  FileAnnotationsType,
} from "@gff/core";
import { MdSave, MdPerson } from "react-icons/md";
import { useAppSelector } from "@/features/repositoryApp/appApi";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import {
  useRemoveRepositoryFacetFilter,
  useUpdateRepositoryFacetFilter,
} from "@/features/repositoryApp/hooks";
import { SummaryModalContext } from "src/utils/contexts";
import {
  ColumnDef,
  ColumnOrderState,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import { downloadTSV } from "@/components/Table/utils";
import { statusBooleansToDataStatus } from "src/utils";
import { useDeepCompareEffect } from "use-deep-compare";

export type FilesTableDataType = {
  file: GdcFile;
  file_uuid: string;
  access: AccessType;
  file_name: string;
  project: string;
  cases: FileCaseType;
  data_category: string;
  data_type: string;
  data_format: string;
  experimental_strategy?: string;
  platform: string;
  file_size: string;
  annotations: FileAnnotationsType[];
};

const filesTableColumnHelper = createColumnHelper<FilesTableDataType>();

const FilesTables: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const [pageSize, setPageSize] = useState(20);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  // TODO fix filters
  const buildSearchFilters = (term: string): Operation => {
    return {
      operator: "or",
      operands: [
        {
          operator: "=",
          field: "files.file_name",
          operand: `*${term}*`,
        },
        {
          operator: "=",
          field: "files.file_id",
          operand: `*${term}*`,
        },
        {
          operator: "=",
          field: "cases.case_id",
          operand: `*${term}*`,
        },
        {
          operator: "=",
          field: "cases.submitter_id",
          operand: `*${term}*`,
        },
      ],
    };
  };

  const updateFilter = useUpdateRepositoryFacetFilter();
  const removeFilter = useRemoveRepositoryFacetFilter();

  useEffect(() => {
    if (searchTerm.length > 0)
      updateFilter("joinOrToAllfilesSearch", buildSearchFilters(searchTerm));
    else {
      removeFilter("joinOrToAllfilesSearch");
    }

    return () => removeFilter("joinOrToAllfilesSearch");
  }, [searchTerm, updateFilter, removeFilter]);

  useDeepCompareEffect(() => {
    setPageSize(20);
    setOffset(0);
  }, [cohortFilters, repositoryFilters]);

  const { data, isFetching, isError, isSuccess } = useGetFilesQuery({
    case_filters: buildCohortGqlOperator(cohortFilters),
    filters: buildCohortGqlOperator(repositoryFilters),
    expand: [
      "annotations", //annotations
      "cases.project", //project_id
      "cases",
    ],
    size: pageSize,
    from: offset * pageSize,
    sortBy: sortBy,
  });

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

  const [formattedTableData, tempPagination] = useMemo(() => {
    if (!isFetching && isSuccess) {
      return [
        data?.files.map((file: GdcFile) => ({
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
        })) as FilesTableDataType[],
        data?.pagination,
      ];
    } else
      return [
        [] as FilesTableDataType[],
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
  }, [isFetching, isSuccess, data?.files, data?.pagination]);

  const filesTableDefaultColumns = useMemo<ColumnDef<FilesTableDataType>[]>(
    () => [
      filesTableColumnHelper.display({
        id: "cart",
        header: "Cart",
        cell: ({ row }) => (
          <SingleItemAddToCartButton file={row.original.file} />
        ),
      }),
      filesTableColumnHelper.accessor("file_uuid", {
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
      filesTableColumnHelper.accessor("access", {
        id: "access",
        header: "Access",
        cell: ({ getValue }) => <FileAccessBadge access={getValue()} />,
        enableSorting: true,
      }),
      filesTableColumnHelper.accessor("file_name", {
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
      filesTableColumnHelper.display({
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
      filesTableColumnHelper.accessor("project", {
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
      filesTableColumnHelper.accessor("data_category", {
        id: "data_category",
        header: "Data Category",
        enableSorting: true,
      }),
      filesTableColumnHelper.accessor("data_type", {
        id: "data_type",
        header: "Data Type",
        enableSorting: true,
      }),
      filesTableColumnHelper.accessor("data_format", {
        id: "data_format",
        header: "Data Format",
        enableSorting: true,
      }),
      filesTableColumnHelper.accessor("experimental_strategy", {
        id: "experimental_strategy",
        header: "Experimental Strategy",
        enableSorting: true,
      }),
      filesTableColumnHelper.accessor("platform", {
        id: "platform",
        header: "Platform",
        enableSorting: true,
      }),
      filesTableColumnHelper.accessor("file_size", {
        id: "file_size",
        header: "File Size",
        enableSorting: true,
      }),
      filesTableColumnHelper.display({
        id: "annotations",
        header: "Annotations",
        cell: ({ row }) => row.original?.annotations?.length ?? 0,
      }),
    ],
    [setEntityMetadata],
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    sortByActions(sorting);
  }, [sorting]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setOffset(0);
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setOffset(obj.newPageNumber - 1);
        break;
      case "newSearch":
        setOffset(0);
        setSearchTerm(obj.newSearch);
        break;
    }
  };

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "files",
      method: "POST",
      params: {
        case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
        filters: buildCohortGqlOperator(repositoryFilters) ?? {},
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
      dispatch: coreDispatch,
    });
  };

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    filesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    file_uuid: false,
    data_type: false,
    experimental_strategy: false,
    platform: false,
  });

  const handleDownloadTSV = () => {
    downloadTSV<FilesTableDataType>({
      tableData: formattedTableData,
      columnOrder,
      columnVisibility,
      columns: filesTableDefaultColumns,
      fileName: `files-table.${convertDateToString(new Date())}.tsv`,
      option: {
        blacklist: ["cart"],
        overwrite: {
          cases: {
            composer: (file) => file.cases?.length.toLocaleString() || 0,
          },
          access: {
            composer: (file) => capitalize(file.access),
          },
          annotations: {
            composer: (file) => file.annotations?.length || 0,
          },
        },
      },
    });
  };

  //update everything that uses table component
  let totalFileSize = <strong>--</strong>;
  let totalCaseCount = "--";

  const fileSizeSliceData = useTotalFileSizeQuery({
    cohortFilters: buildCohortGqlOperator(cohortFilters),
    localFilters: buildCohortGqlOperator(repositoryFilters),
  });
  if (fileSizeSliceData.isSuccess && fileSizeSliceData?.data) {
    const fileSizeObj = fileSize(fileSizeSliceData.data?.total_file_size || 0, {
      output: "object",
    });
    totalFileSize = (
      <>
        <strong>{fileSizeObj.value}</strong> {fileSizeObj.unit}
      </>
    );
    totalCaseCount = fileSizeSliceData.data.total_case_count.toLocaleString();
  }

  console.log({ isFetching, isSuccess, isError });
  const Stats = () => (
    <div className="flex gap-1 text-xl items-center uppercase">
      <div>
        Total of{" "}
        <strong>{tempPagination?.total?.toLocaleString() || "--"}</strong>{" "}
        {tempPagination?.total > 1 || tempPagination?.total === 0
          ? "Files"
          : "File"}
      </div>
      <div>
        <MdPerson className="ml-2 mr-1 mb-1 inline-block" aria-hidden="true" />
        <strong className="mr-1">{totalCaseCount}</strong>
        {fileSizeSliceData?.data?.total_case_count > 1 ||
        fileSizeSliceData?.data?.total_case_count === 0
          ? "Cases"
          : "Case"}
      </div>
      <div>
        <MdSave className="ml-2 mr-1 mb-1 inline-block" aria-hidden="true" />
        {totalFileSize}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex xl:justify-end Custom-Repo-Width:hidden">
        <Stats />
      </div>
      <div className="">
        <VerticalTable
          additionalControls={
            <div className="flex gap-2 items-center justify-between">
              <FunctionButton
                onClick={handleDownloadJSON}
                data-testid="button-json-files-table"
                disabled={isFetching}
              >
                JSON
              </FunctionButton>
              <FunctionButton
                onClick={handleDownloadTSV}
                data-testid="button-tsv-files-table"
                disabled={isFetching}
              >
                TSV
              </FunctionButton>
            </div>
          }
          tableTitle={
            <div
              data-testid="text-counts-files-table"
              className="hidden Custom-Repo-Width:block"
            >
              <Stats />
            </div>
          }
          data={formattedTableData}
          columns={filesTableDefaultColumns}
          pagination={{
            ...tempPagination,
            label: "files",
          }}
          status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
          handleChange={handleChange}
          search={{
            enabled: true,
            tooltip:
              "e.g. HCM-CSHL-0062-C18.json, 4b5f5ba0-3010-4449-99d4-7bd7a6d73422, HCM-CSHL-0062-C18",
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
      </div>
    </>
  );
};

export default FilesTables;
