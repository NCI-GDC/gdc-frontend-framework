import React, { useEffect, useState } from "react";
import { VerticalTable } from "../shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import { TableInstance } from "react-table";
import Link from "next/link";
import {
  useProjects,
  buildCohortGqlOperator,
  ProjectDefaults,
} from "@gff/core";
import { Row } from "react-table";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import {
  SelectProjectButton,
  SelectAllProjectsButton,
} from "@/features/projectsCenter/SelectProjectButton";
import ProjectsCohortButton from "./ProjectsCohortButton";

const extractToArray = (
  data: ReadonlyArray<Record<string, number | string>>,
  nodeKey: string,
) => data.map((x) => x[nodeKey]);

interface CellProps {
  value: string[];
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

const ProjectsTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);

  const projectFilters = useAppSelector((state) => selectFilters(state));
  const { data, pagination, isSuccess, isFetching, isError } = useProjects({
    filters: buildCohortGqlOperator(projectFilters),
    expand: [
      "summary",
      "summary.experimental_strategies",
      "summary.data_categories",
      "program",
    ],
    size: pageSize,
    from: (activePage - 1) * pageSize,
    sortBy: [{ field: "summary.case_count", direction: "desc" }],
  });

  const columnListOrder = [
    {
      id: "selected",
      columnName: "Selecti ",
      visible: true,
      Header: ({ data }: TableInstance) => {
        const projectIds = data.map((x) => x.selected);
        return <SelectAllProjectsButton projectIds={projectIds} />;
      },
      Cell: ({ value }: SelectColumnProps) => {
        return <SelectProjectButton projectId={value} />;
      },
    },
    {
      id: "project_id",
      columnName: "Project",
      visible: true,
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
    },
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
    {
      id: "files",
      columnName: "Files",
      visible: false,
      Cell: ({ value }: CellProps) => {
        return <div className="text-right w-12">{value} </div>;
      },
    },
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

  useEffect(() => setActivePage(1), [projectFilters]);

  if (isSuccess) {
    tempPagination = pagination;
    formattedTableData = data.map(
      ({
        project_id,
        disease_type,
        primary_site,
        program,
        summary,
      }: ProjectDefaults) => ({
        selected: project_id,
        project_id: (
          <Link href={`/projects/${project_id}`}>
            <a className="text-utility-link underline">{project_id}</a>
          </Link>
        ),
        disease_type: disease_type,
        primary_site: primary_site,
        program: program.name,
        cases: summary.case_count.toLocaleString().padStart(9),
        data_categories: extractToArray(
          summary.data_categories,
          "data_category",
        ),
        experimental_strategies: extractToArray(
          summary.experimental_strategies,
          "experimental_strategy",
        ),
        files: summary.file_count.toLocaleString(),
      }),
    );
  }

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
      tableTitle={`Total of ${tempPagination?.total} projects`}
      additionalControls={
        <div className="flex gap-2">
          <ProjectsCohortButton />
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
        label: "projects",
      }}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
    />
  );
};

export default ProjectsTable;
