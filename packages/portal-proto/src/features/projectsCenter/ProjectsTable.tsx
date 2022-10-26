import { useEffect, useState } from "react";
import { VerticalTable } from "../shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import Link from "next/link";
import { useProjects, buildCohortGqlOperator } from "@gff/core";
import { Row } from "react-table";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";

const extractToArray = (
  data: ReadonlyArray<Record<string, number | string>>,
  nodeKey: string,
) => data.map((x) => x[nodeKey]);

interface CellProps {
  value: string[];
  row: Row;
}

const ProjectsTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);

  const columnListOrder = [
    { id: "project_id", columnName: "Project", visible: true },
    {
      id: "disease_type",
      columnName: "Disease Type",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        return <CollapsibleRow value={value} row={row} label="Disease Types" />;
      },
    },
    {
      id: "primary_site",
      columnName: "Primary Site",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        return <CollapsibleRow value={value} row={row} label="Primary Sites" />;
      },
    },
    { id: "program", columnName: "Program", visible: true },
    {
      id: "cases",
      columnName: "Cases",
      visible: true,
      Cell: ({ value }: CellProps) => {
        return <div className="text-right w-12">{value} </div>;
      },
    },
    {
      id: "data_categories",
      columnName: "Data Category",
      visible: true,
      Cell: ({ value, row }: CellProps) => (
        <CollapsibleRow value={value} row={row} label="Data Categories" />
      ),
    },
    {
      id: "experimental_strategies",
      columnName: "Experimental Strategy",
      visible: true,
      Cell: ({ value, row }: CellProps) => (
        <CollapsibleRow
          value={value}
          row={row}
          label="Experimental Strategies"
        />
      ),
    },
    { id: "files", columnName: "Files", visible: false },
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
    from: (activePage - 1) * pageSize,
    sortBy: [{ field: "summary.case_count", direction: "desc" }],
  });

  useEffect(() => setActivePage(1), [projectFilters]);

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
      cases: project.summary.case_count.toLocaleString().padStart(9),
      data_categories: extractToArray(
        project.summary.data_categories,
        "data_category",
      ),
      experimental_strategies: extractToArray(
        project.summary.experimental_strategies,
        "experimental_strategy",
      ),
      files: project.summary.file_count.toLocaleString(),
    }));
  }

  const status = isFetching // useProjects hooks returns status as a set of bools
    ? "pending"
    : isSuccess
    ? "fulfilled"
    : isError
    ? "rejected"
    : "uninitialized";

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
    setActivePage(1);
  };
  const handlePageChange = (x: number) => {
    setActivePage(x);
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
        label: "Projects",
      }}
      status={status}
    />
  );
};

export default ProjectsTable;
