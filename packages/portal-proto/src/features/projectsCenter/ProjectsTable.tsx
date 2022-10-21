import { useState } from "react";
import { VerticalTable } from "../shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import Link from "next/link";
import { useProjects, buildCohortGqlOperator } from "@gff/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";

const extractValue = (
  data: ReadonlyArray<Record<string, number | string>>,
  nodeKey: string,
  nodeValue: string,
  valueKey: string,
): number | string | undefined => {
  const results = data.find(
    (obj) => Object.keys(obj).includes(nodeKey) && obj[nodeKey] === nodeValue,
  );
  if (results === undefined) return 0;

  return results[valueKey];
};

const extractToArray = (
  data: ReadonlyArray<Record<string, number | string>>,
  nodeKey: string,
) => data.map((x) => x[nodeKey]);

const ProjectsTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);

  const columnListOrder = [
    { id: "project_id", columnName: "Project", visible: true },
    {
      id: "disease_type",
      columnName: "Disease Type",
      visible: true,
      Cell: ({ value, row }) => {
        return (
          <CollapsibleRow value={value} row={row} label={"Disease Type"} />
        );
      },
    },
    {
      id: "primary_site",
      columnName: "Primary Site",
      visible: true,
      Cell: ({ value, row }) => (
        <CollapsibleRow value={value} row={row} label={"Primary Site"} />
      ),
    },
    { id: "program", columnName: "Program", visible: true },
    { id: "cases", columnName: "Cases", visible: true },
    {
      id: "data_categories",
      columnName: "Data Categories",
      visible: true,
      Cell: ({ value, row }) => (
        <CollapsibleRow value={value} row={row} label={"Data Categories"} />
      ),
    },
    {
      id: "experimental_strategies",
      columnName: "Experimental Strategies",
      visible: true,
      Cell: ({ value, row }) => (
        <CollapsibleRow
          value={value}
          row={row}
          label={"Experimental Strategies"}
        />
      ),
    },
    { id: "files", columnName: "Files", visible: true },
  ];
  const filterColumnCells = (newList) =>
    newList.reduce((filtered, obj) => {
      if (obj.visible) {
        filtered.push({ Header: obj.columnName, accessor: obj.id, ...obj });
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
  const projectFilters = useAppSelector((state) => selectFilters(state));
  const { data, pagination, isSuccess, isFetching, isError } = useProjects({
    filters: buildCohortGqlOperator(projectFilters),
    expand: [
      "summary", //annotations
      "summary.experimental_strategies",
      "summary.data_categories",
      "program",
    ],
    size: pageSize,
    from: offset * pageSize,
  });

  console.log("ProjectTable", data, isSuccess, pagination);

  const renderExpandedRow = (content) => {
    return {
      content,
    };
  };

  if (isSuccess) {
    tempPagination = pagination;
    formattedTableData = data.map((project) => ({
      project_id: (
        <Link href={`/projects/${project.project_id}`}>
          <a className="text-utility-link underline">{project.project_id}</a>
        </Link>
      ),
      disease_type: project.disease_type,
      primary_site: project.primary_site,
      program: project.program.name,
      cases: project.summary.case_count,
      data_categories: extractToArray(
        project.summary.data_categories,
        "data_category",
      ),
      experimental_strategies: extractToArray(
        project.summary.experimental_strategies,
        "experimental_strategy",
      ),
      files: project.summary.file_count,
    }));
  }

  const status = isFetching
    ? "pending"
    : isSuccess
    ? "fulfilled"
    : isError
    ? "rejected"
    : "uninitialized";

  const handlePageSizeChange = (x: string) => {
    //getCohortCases(parseInt(x), 0);
  };
  const handlePageChange = (x: number) => {
    //  getCohortCases(tempPagination.size, x - 1);
  };

  //update everything that uses table component
  return (
    <VerticalTable
      tableTitle={`Total of ${tempPagination?.total} Projects`}
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
      showControls={true}
      pagination={{
        handlePageSizeChange,
        handlePageChange,
        ...tempPagination,
        label: "files",
      }}
      status={status}
      renderRowSubComponent={renderExpandedRow}
    />
  );
};

export default ProjectsTable;
