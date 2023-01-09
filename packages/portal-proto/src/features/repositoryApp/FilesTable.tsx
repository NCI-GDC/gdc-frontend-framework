import { useState, useEffect } from "react";
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
  selectFilesData,
  fetchFiles,
  buildCohortGqlOperator,
  joinFilters,
  useFilesSize,
  GdcFile,
  Operation,
} from "@gff/core";
import { MdSave, MdPerson } from "react-icons/md";
import { useAppSelector } from "@/features/repositoryApp/appApi";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import { useUpdateRepositoryFacetFilter } from "@/features/repositoryApp/hooks";

const FilesTables: React.FC = () => {
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

  const { data, pagination, status } = useCoreSelector(selectFilesData);

  const getAnnotationsLinkParams = (file: GdcFile): string | null => {
    // Due to limitation in the length of URI, we decided to cap a link to be created for files which has < 150 annotations for now
    // 150 annotations was a safe number. It was tested in Chrome, Firefox, Safari and Edge.
    // TODO: Follow Up Ticket - https://jira.opensciencedatacloud.org/browse/PEAR-758
    const MAX_ANNOATATION_COUNT = 150;
    if (!file?.annotations || file.annotations.length > MAX_ANNOATATION_COUNT)
      return null;

    if (file?.annotations?.length === 1) {
      return `https://portal.gdc.cancer.gov/annotations/${file.annotations[0].annotation_id}`;
    }
    return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.annotation_id","value":[${[
      file.annotations.map((annotation) => `"${annotation.annotation_id}"`),
    ]}]},"op":"in"}],"op":"and"}`;
  };

  if (status === "fulfilled") {
    tempPagination = pagination;
    formattedTableData = data.map((file) => ({
      cart: <SingleItemAddToCartButton file={file} iconOnly />,
      file_id: (
        <Link href={`/files/${file.file_id}`}>
          <a className="text-utility-link underline">{file.file_id}</a>
        </Link>
      ),
      access: <FileAccessBadge access={file.access} />,
      file_name: (
        <Link href={`/files/${file.id}`}>
          <a className="text-utility-link underline">{file.file_name}</a>
        </Link>
      ),
      cases: file.cases?.length.toLocaleString() || 0,
      project_id: (
        <Link href={`/projects/${file.project_id}`}>
          <a className="text-utility-link underline">{file.project_id}</a>
        </Link>
      ),
      data_category: file.data_category,
      data_type: file.data_type,
      data_format: file.data_format,
      experimental_strategy: file.experimental_strategy || "--",
      platform: file.platform || "--",
      file_size: fileSize(file.file_size),
      annotations: (
        <>
          {getAnnotationsLinkParams(file) ? (
            <Link href={getAnnotationsLinkParams(file)} passHref>
              <a className="text-utility-link underline" target={"_blank"}>
                {file.annotations.length}
              </a>
            </Link>
          ) : (
            file?.annotations?.length ?? 0
          )}
        </>
      ),
    }));
  }

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

  useEffect(() => {
    coreDispatch(
      fetchFiles({
        filters: cohortGqlOperator,
        expand: [
          "annotations", //annotations
          "cases.project", //project_id
        ],
        size: pageSize,
        from: offset * pageSize,
        sortBy: sortBy,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, offset, sortBy]);

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

  const buildSearchFilters = (term: string): Operation => {
    return {
      operator: "or",
      operands: [
        {
          operator: "=",
          field: "file_name",
          operand: `*${term}*`,
        },
        {
          operator: "=",
          field: "file_id",
          operand: `*${term}*`,
        },
      ],
    };
  };

  const updateFilter = useUpdateRepositoryFacetFilter();
  const newSearchActions = (searchTerm: string) => {
    //TODO if lots of calls fast last call might not be displayed
    if (searchTerm.length > 0)
      updateFilter("files", buildSearchFilters(searchTerm));
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
      data,
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
  if (fileSizeSliceData.isSuccess && fileSizeSliceData?.data?.total_file_size) {
    const fileSizeObj = fileSize(fileSizeSliceData.data.total_file_size, {
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
        <div className="flex">
          <div className="flex gap-2">
            <FunctionButton onClick={handleDownloadJSON}>JSON</FunctionButton>
            <FunctionButton onClick={handleDownloadTSV}>TSV</FunctionButton>
          </div>
          <div className="flex gap-2 w-full flex-row-reverse text-xl">
            <div className="pr-5">
              <MdSave className="ml-2 mr-1 mb-1 inline-block" />
              {totalFileSize}
            </div>
            <div className="">
              <MdPerson className="ml-2 mr-1 mb-1 inline-block" />
              <strong className="mr-1">{totalCaseCount}</strong>
              Cases
            </div>
            <div className="">
              Total of{" "}
              <strong>{tempPagination?.total?.toLocaleString() || "--"}</strong>{" "}
              {tempPagination?.total > 1 ? "Files" : "File"}
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
      status={status}
      handleChange={handleChange}
      search={{
        enabled: true,
      }}
    />
  );
};

export default FilesTables;
