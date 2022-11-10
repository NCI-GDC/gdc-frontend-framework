import { useState } from "react";
import fileSize from "filesize";
import { VerticalTable, HandleChangeInput } from "../shared/VerticalTable";
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
import { FileAccessBadge } from "@/components/FileAccessBadge";

const FilesTables: React.FC = () => {
  const columnListOrder = [
    {
      id: "cart",
      columnName: "Cart",
      visible: true,
      arrangeable: false,
      disableSortBy: true,
    },
    { id: "id", columnName: "File UUID", visible: false },
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
  const filterColumnCells = (newList) =>
    newList.reduce((filtered, obj) => {
      if (obj.visible) {
        filtered.push({
          Header: obj.columnName,
          accessor: obj.id,
          disableSortBy: obj.disableSortBy || false,
        });
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

  const [sortBy, setSortBy] = useState([]);

  const getCohortCases = (pageSize = 20, offset = 0, sortBy = []) => {
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
  };

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
    getCohortCases(tempPagination.size, tempPagination.page - 1, tempSortBy);
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        sortByActions(obj.sortBy);
        break;
      case "newPageSize":
        getCohortCases(parseInt(obj.newPageSize), 0, sortBy);
        break;
      case "newPageNumber":
        getCohortCases(tempPagination.size, obj.newPageNumber - 1, sortBy);
        break;
    }
  };

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
            <FunctionButton>JSON</FunctionButton>
            <FunctionButton>TSV</FunctionButton>
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
      columnSorting={"manual"}
      columnCells={columnCells}
      handleColumnChange={handleColumnChange}
      selectableRow={false}
      pagination={{
        ...tempPagination,
        label: "files",
      }}
      status={status}
      handleChange={handleChange}
    />
  );
};

export default FilesTables;
