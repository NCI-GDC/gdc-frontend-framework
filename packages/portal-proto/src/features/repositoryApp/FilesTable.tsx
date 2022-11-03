import { useState } from "react";
import fileSize from "filesize";
import { VerticalTable } from "../shared/VerticalTable";
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
} from "@gff/core";
import { MdSave } from "react-icons/md";
import { useAppSelector } from "@/features/repositoryApp/appApi";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import { FileAccessBadge } from "@/components/FileAccessBadge";

const FilesTables: React.FC = () => {
  const columnListOrder = [
    { id: "cart", columnName: "Cart", visible: true },
    { id: "id", columnName: "File UUID", visible: false },
    { id: "access", columnName: "Access", visible: true },
    { id: "fileName", columnName: "File Name", visible: true },
    { id: "cases", columnName: "Cases", visible: true },
    { id: "project_id", columnName: "Project", visible: true },
    { id: "dataCategory", columnName: "Data Category ", visible: true },
    { id: "dataType", columnName: "Data Type", visible: false },
    { id: "dataFormat", columnName: "Data Format", visible: true },
    {
      id: "experimentalStrategy",
      columnName: "Experimental Strategy",
      visible: false,
    },
    { id: "platform", columnName: "Platform", visible: false },
    { id: "fileSize", columnName: "File Size", visible: true },
    { id: "annotations", columnName: "Annotations", visible: true },
  ];

  const filterColumnCells = (newList) =>
    newList.reduce((filtered, obj) => {
      if (obj.visible) {
        filtered.push({ Header: obj.columnName, accessor: obj.id });
      }
      return filtered;
    }, []);

  const [columnCells, setColumnCells] = useState(
    filterColumnCells(columnListOrder),
  );

  const handleColumnChange = (update) => {
    setColumnCells(filterColumnCells(update));
  };

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

  if (status === "fulfilled") {
    tempPagination = pagination;
    formattedTableData = data.map((file) => ({
      cart: <SingleItemAddToCartButton file={file} iconOnly />,
      id: (
        <Link href={`/files/${file.id}`}>
          <a className="text-utility-link underline">{file.id}</a>
        </Link>
      ),
      access: <FileAccessBadge access={file.access} />,
      fileName: (
        <Link href={`/files/${file.id}`}>
          <a className="text-utility-link underline">{file.fileName}</a>
        </Link>
      ),
      cases: file.cases?.length.toLocaleString() || 0,
      project_id: (
        <Link href={`/projects/${file.project_id}`}>
          <a className="text-utility-link underline">{file.project_id}</a>
        </Link>
      ),
      dataCategory: file.dataCategory,
      dataType: file.dataType,
      dataFormat: file.dataFormat,
      experimentalStrategy: file.experimentalStrategy || "--",
      platform: file.platform || "--",
      fileSize: fileSize(file.fileSize),
      annotations: file.annotations?.length || 0,
    }));
  }

  //This if for hanadling pagination changes
  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const cohortGqlOperator = buildCohortGqlOperator(allFilters);
  const coreDispatch = useCoreDispatch();

  const getCohortCases = (pageSize = 20, offset = 0) => {
    coreDispatch(
      fetchFiles({
        filters: cohortGqlOperator,
        expand: [
          "annotations", //annotations
          "cases.project", //project_id
        ],
        size: pageSize,
        from: offset * pageSize,
      }),
    );
  };
  const handlePageSizeChange = (x: string) => {
    getCohortCases(parseInt(x), 0);
  };
  const handlePageChange = (x: number) => {
    getCohortCases(tempPagination.size, x - 1);
  };

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "files",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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
          cases: {
            composer: (file) => file.cases?.length.toLocaleString() || 0,
          },
          fileSize: {
            composer: (file) => fileSize(file.fileSize),
          },
          annotations: {
            composer: (file) => file.annotations?.length || 0,
          },
        },
      },
    );
  };

  //update everything that uses table component
  let totalFileSize = "--";

  const fileSizeSliceData = useFilesSize(cohortGqlOperator);
  if (fileSizeSliceData.isSuccess && fileSizeSliceData?.data?.total_file_size) {
    totalFileSize = fileSize(fileSizeSliceData.data.total_file_size);
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
              <span>{totalFileSize}</span>
            </div>
            <div className="">
              Total of{" "}
              <strong>{tempPagination?.total?.toLocaleString() || "--"}</strong>{" "}
              Files
            </div>
          </div>
        </div>
      }
      tableData={formattedTableData}
      columnListOrder={columnListOrder}
      columnCells={columnCells}
      handleColumnChange={handleColumnChange}
      selectableRow={false}
      pagination={{
        handlePageSizeChange,
        handlePageChange,
        ...tempPagination,
        label: "files",
      }}
      status={status}
    />
  );
};

export default FilesTables;
