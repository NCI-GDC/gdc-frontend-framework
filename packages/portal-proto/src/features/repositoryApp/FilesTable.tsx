import { useState, useContext } from "react";
import { capitalize } from "lodash";
import fileSize from "filesize";
import {
  VerticalTable,
  HandleChangeInput,
  Columns,
  filterColumnCells,
} from "../shared/VerticalTable";
import { downloadTSV } from "../shared/TableUtils";
import { SingleItemAddToCartButton } from "../cart/updateCart";
import Link from "next/link";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  joinFilters,
  useFilesSize,
  GdcFile,
  Operation,
  useGetFilesQuery,
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
import { getAnnotationsLinkParamsFromFiles } from "../shared/utils";
import { SummaryModalContext } from "src/utils/contexts";

const FilesTables: React.FC = () => {
  //This if for hanadling pagination changes
  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const cohortGqlOperator = buildCohortGqlOperator(allFilters);

  const [sortBy, setSortBy] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [offset, setOffset] = useState(0);

  const coreDispatch = useCoreDispatch();
  const {
    data: { files, pagination } = {},
    isFetching,
    isError,
    isSuccess,
  } = useGetFilesQuery({
    filters: cohortGqlOperator,
    expand: [
      "annotations", //annotations
      "cases.project", //project_id
      "cases",
    ],
    size: pageSize,
    from: offset * pageSize,
    sortBy: sortBy,
  });

  const columnListOrder: Columns[] = [
    {
      id: "cart",
      columnName: "Cart",
      visible: true,
      arrangeable: false,
      disableSortBy: true,
    },
    { id: "file_id", columnName: "File UUID", visible: false },
    { id: "access", columnName: "Access", visible: true },
    { id: "file_name", columnName: "File Name", visible: true },
    { id: "cases", columnName: "Cases", visible: true, disableSortBy: true },
    { id: "project_id", columnName: "Project", visible: true },
    { id: "data_category", columnName: "Data Category ", visible: true },
    { id: "data_type", columnName: "Data Type", visible: false },
    { id: "data_format", columnName: "Data Format", visible: true },
    {
      id: "experimental_strategy",
      columnName: "Experimental Strategy",
      visible: false,
    },
    { id: "platform", columnName: "Platform", visible: false },
    { id: "file_size", columnName: "File Size", visible: true },
    {
      id: "annotations",
      columnName: "Annotations",
      visible: true,
      disableSortBy: true,
    },
  ];
  const [columns, setColumns] = useState(columnListOrder);
  const [columnCells, setColumnCells] = useState(
    filterColumnCells(columnListOrder),
  );

  let formattedTableData = [],
    tempPagination = {
      count: undefined,
      from: undefined,
      page: undefined,
      pages: undefined,
      size: undefined,
      sort: undefined,
      total: undefined,
    };

  const { setEntityMetadata } = useContext(SummaryModalContext);

  if (!isFetching && isSuccess) {
    tempPagination = pagination;
    formattedTableData = files.map((file: GdcFile) => ({
      cart: <SingleItemAddToCartButton file={file} iconOnly />,
      file_id: (
        <PopupIconButton
          handleClick={() =>
            setEntityMetadata({
              entity_type: "file",
              entity_id: file.file_id,
            })
          }
          label={file.file_id}
          customStyle="text-utility-link underline font-content text-left"
        />
      ),
      access: <FileAccessBadge access={file.access} />,
      file_name: (
        <PopupIconButton
          handleClick={() =>
            setEntityMetadata({
              entity_type: "file",
              entity_id: file.file_id,
            })
          }
          label={file.file_name}
          customStyle="text-utility-link underline font-content text-left"
        />
      ),
      cases: (
        <PopupIconButton
          handleClick={() => {
            if (file.cases?.length === 0) return;
            setEntityMetadata({
              entity_type: file.cases?.length === 1 ? "case" : "file",
              entity_id:
                file.cases?.length === 1
                  ? file.cases?.[0].case_id
                  : file.file_id,
            });
          }}
          label={file.cases?.length.toLocaleString() || 0}
          customAriaLabel={`Open ${
            file.cases?.length === 1 ? "case" : "file"
          } information in modal`}
          customStyle={`font-content ${
            file.cases?.length > 0
              ? "text-utility-link underline"
              : "cursor-default"
          }`}
        />
      ),
      project_id: (
        <PopupIconButton
          handleClick={() =>
            setEntityMetadata({
              entity_type: "project",
              entity_id: file.project_id,
            })
          }
          label={file.project_id}
          customStyle="text-utility-link underline font-content"
        />
      ),
      data_category: file.data_category,
      data_type: file.data_type,
      data_format: file.data_format,
      experimental_strategy: file.experimental_strategy || "--",
      platform: file.platform || "--",
      file_size: fileSize(file.file_size),
      annotations: (
        <span className="font-content">
          {getAnnotationsLinkParamsFromFiles(file) ? (
            <Link href={getAnnotationsLinkParamsFromFiles(file)} passHref>
              <a
                className="text-utility-link underline font-content"
                target="_blank"
              >
                {file.annotations.length}
              </a>
            </Link>
          ) : (
            file?.annotations?.length ?? 0
          )}
        </span>
      ),
    }));
  }

  const sortByActions = (sortByObj) => {
    const tempSortBy = sortByObj.map((sortObj) => {
      let tempSortId = sortObj.id;
      // map sort ids to api ids
      if (sortObj.id === "project_id") {
        //cases.project.project_id = project_id
        tempSortId = "cases.project.project_id";
      }
      return {
        field: tempSortId,
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
    setSortBy(tempSortBy);
  };
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
      ],
    };
  };

  const updateFilter = useUpdateRepositoryFacetFilter();
  const removeFilter = useRemoveRepositoryFacetFilter();
  const newSearchActions = (searchTerm: string) => {
    //TODO if lots of calls fast last call might not be displayed
    if (searchTerm.length > 0)
      updateFilter("joinOrToAllfilesSearch", buildSearchFilters(searchTerm));
    else {
      removeFilter("joinOrToAllfilesSearch");
    }
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        sortByActions(obj.sortBy);
        break;
      case "newPageSize":
        setOffset(0);
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setOffset(obj.newPageNumber - 1);
        break;
      case "newSearch":
        setOffset(0);
        newSearchActions(obj.newSearch);
        break;
      case "newHeadings":
        setColumnCells(filterColumnCells(obj.newHeadings));
        setColumns(obj.newHeadings);
        break;
    }
  };

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
        filters: buildCohortGqlOperator(allFilters) ?? {},
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
      queryParams: `?${new URLSearchParams({
        annotations: "true",
        related_files: "true",
      }).toString()}`,
    });
  };

  const handleDownloadTSV = () => {
    downloadTSV(
      files,
      columnCells,
      `files-table.${convertDateToString(new Date())}.tsv`,
      {
        blacklist: ["cart"],
        overwrite: {
          access: {
            composer: (file) => capitalize(file.access),
          },
          cases: {
            composer: (file) => file.cases?.length.toLocaleString() || 0,
          },
          file_size: {
            composer: (file) => fileSize(file.file_size),
          },
          annotations: {
            composer: (file) => file.annotations?.length || 0,
          },
          experimental_strategy: {
            composer: (file) => file.experimental_strategy || "--",
          },
          platform: {
            composer: (file) => file.platform || "--",
          },
        },
      },
    );
  };

  //update everything that uses table component
  let totalFileSize = <strong>--</strong>;
  let totalCaseCount = "--";

  const fileSizeSliceData = useFilesSize(cohortGqlOperator);
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

  return (
    <VerticalTable
      additionalControls={
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <FunctionButton
              onClick={handleDownloadJSON}
              data-testid="button-json-files-table"
            >
              JSON
            </FunctionButton>
            <FunctionButton
              onClick={handleDownloadTSV}
              data-testid="button-tsv-files-table"
            >
              TSV
            </FunctionButton>
          </div>
          <div className="flex gap-1 text-xl">
            <div>
              Total of{" "}
              <strong>{tempPagination?.total?.toLocaleString() || "--"}</strong>{" "}
              {tempPagination?.total > 1 || tempPagination?.total === 0
                ? "Files"
                : "File"}
            </div>
            <div>
              <MdPerson className="ml-2 mr-1 mb-1 inline-block" />
              <strong className="mr-1">{totalCaseCount}</strong>
              {fileSizeSliceData?.data?.total_case_count > 1 ||
              fileSizeSliceData?.data?.total_case_count === 0
                ? "Cases"
                : "Case"}
            </div>
            <div>
              <MdSave className="ml-2 mr-1 mb-1 inline-block" />
              {totalFileSize}
            </div>
          </div>
        </div>
      }
      tableData={formattedTableData}
      columns={columns}
      columnSorting={"manual"}
      selectableRow={false}
      pagination={{
        ...tempPagination,
        label: "files",
      }}
      status={
        isFetching
          ? "pending"
          : isSuccess
          ? "fulfilled"
          : isError
          ? "rejected"
          : "uninitialized"
      }
      handleChange={handleChange}
      search={{
        enabled: true,
      }}
    />
  );
};

export default FilesTables;
