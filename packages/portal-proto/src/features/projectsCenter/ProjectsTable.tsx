import React, { useEffect, useMemo, useState } from "react";
import {
  VerticalTable,
  HandleChangeInput,
  Columns,
} from "../shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import { Row, TableInstance } from "react-table";
import Link from "next/link";
import {
  useProjects,
  buildCohortGqlOperator,
  ProjectDefaults,
  useCoreDispatch,
  joinFilters,
  SortBy,
} from "@gff/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import {
  SelectProjectButton,
  SelectAllProjectsButton,
} from "@/features/projectsCenter/SelectProjectButton";
import ProjectsCohortButton from "./ProjectsCohortButton";
import download from "src/utils/download";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { extractToArray } from "src/utils";

interface CellProps {
  value: string[];
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

const ProjectsTable: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy[]>([
    { field: "summary.case_count", direction: "desc" },
  ]);

  const projectFilters = useAppSelector((state) => selectFilters(state));
  const { data, pagination, isSuccess, isFetching, isError } = useProjects({
    filters:
      searchTerm.length > 0
        ? buildCohortGqlOperator(
            joinFilters(projectFilters, {
              mode: "and",
              root: {
                "projects.project_id": {
                  operator: "includes",
                  field: "projects.project_id",
                  operands: [`*${searchTerm}*`],
                },
              },
            }),
          )
        : buildCohortGqlOperator(projectFilters),
    expand: [
      "summary",
      "summary.experimental_strategies",
      "summary.data_categories",
      "program",
    ],
    size: pageSize,
    from: (activePage - 1) * pageSize,
    sortBy: sortBy,
  });

  const columnListOrder: Columns[] = [
    {
      id: "selected",
      visible: true,
      columnName: ({ data }: TableInstance) => {
        const projectIds = data.map((x) => x.selected);
        return <SelectAllProjectsButton projectIds={projectIds} />;
      },
      Cell: ({ value }: SelectColumnProps) => {
        return <SelectProjectButton projectId={value} />;
      },
      disableSortBy: true,
    },
    {
      id: "project_id",
      columnName: "Project",
      visible: true,
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value}</div>;
      },
    },
    {
      id: "disease_type",
      columnName: "Disease Type",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        return <CollapsibleRow value={value} row={row} label="Disease Types" />;
      },
      disableSortBy: true,
    },
    {
      id: "primary_site",
      columnName: "Primary Site",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        return <CollapsibleRow value={value} row={row} label="Primary Sites" />;
      },
      disableSortBy: true,
    },
    {
      id: "program",
      columnName: "Program",
      visible: true,
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
    },
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
      disableSortBy: true,
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
      disableSortBy: true,
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
  const [columns, setColumns] = useState(columnListOrder);
  useEffect(() => setActivePage(1), [projectFilters]);

  const sortByActions = (sortByObj) => {
    const COLUMN_ID_TO_FIELD = {
      project_id: "project_id",
      files: "summary.file_count",
      cases: "summary.case_count",
      program: "program.name",
    };
    const tempSortBy = sortByObj.map((sortObj) => {
      ///const tempSortId = COLUMN_ID_TO_FIELD[sortObj.id];
      // map sort ids to api ids
      return {
        field: COLUMN_ID_TO_FIELD[sortObj.id],
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
    setSortBy(tempSortBy);
  };

  const [formattedTableData, tempPagination] = useMemo(() => {
    if (isSuccess) {
      return [
        data.map(
          ({
            project_id,
            disease_type,
            primary_site,
            program,
            summary,
          }: ProjectDefaults) => ({
            selected: project_id,
            project_id: (
              <OverflowTooltippedLabel label={project_id}>
                <Link href={`/projects/${project_id}`}>
                  <a className="text-utility-link underline">{project_id}</a>
                </Link>
              </OverflowTooltippedLabel>
            ),
            disease_type: disease_type,
            primary_site: primary_site,
            program: (
              <OverflowTooltippedLabel label={program.name}>
                {program.name}
              </OverflowTooltippedLabel>
            ),
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
        ),
        pagination,
      ];
    } else
      return [
        [],
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
  }, [isSuccess, data, pagination]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        sortByActions(obj.sortBy);
        break;
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setActivePage(1);
        break;
      case "newPageNumber":
        setActivePage(obj.newPageNumber);
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch);
        setActivePage(1);
        break;
      case "newHeadings":
        setColumns(obj.newHeadings);
        break;
    }
  };

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "projects",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
      params: {
        filters: buildCohortGqlOperator(projectFilters) ?? {},
        size: 10000,
        attachment: true,
        format: "JSON",
        pretty: true,
        fields: [
          "project_id",
          "disease_type",
          "primary_site",
          "program.name",
          "summary.case_count",
          "summary.data_categories.data_category",
          "summary.data_categories.case_count",
          "summary.experimental_strategies.experimental_strategy",
          "summary.experimental_strategies.case_count",
          "summary.file_count",
        ].join(","),
      },
      dispatch: coreDispatch,
    });
  };

  //update everything that uses table component
  return (
    <VerticalTable
      tableTitle={`Total of ${tempPagination?.total?.toLocaleString()} ${
        tempPagination?.total > 1 ? "Projects" : "Project"
      }`}
      additionalControls={
        <div className="flex gap-2">
          <ProjectsCohortButton />
          <FunctionButton onClick={handleDownloadJSON}>JSON</FunctionButton>
          <FunctionButton>TSV</FunctionButton>
        </div>
      }
      tableData={formattedTableData}
      columns={columns}
      columnSorting={"manual"}
      selectableRow={false}
      showControls={true}
      pagination={{
        ...tempPagination,
        label: "projects",
      }}
      search={{
        enabled: true,
      }}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      handleChange={handleChange}
      initialSort={[{ id: "cases", desc: true }]}
    />
  );
};

export default ProjectsTable;
