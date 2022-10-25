import { useState } from "react";
import fileSize from "filesize";
import { VerticalTable } from "../shared/VerticalTable";
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
} from "@gff/core";
import { useAppSelector } from "@/features/repositoryApp/appApi";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
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
  const coreDispatch = useCoreDispatch();

  const getCohortCases = (pageSize = 20, offset = 0) => {
    coreDispatch(
      fetchFiles({
        filters: buildCohortGqlOperator(allFilters),
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

  //update everything that uses table component
  return (
    <VerticalTable
      tableTitle={`Total of ${tempPagination?.total} files`}
      additionalControls={
        <div className="flex gap-2">
          <FunctionButton>JSON</FunctionButton>
          <FunctionButton>TSV</FunctionButton>
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
