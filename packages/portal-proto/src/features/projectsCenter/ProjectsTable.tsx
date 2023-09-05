import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useGetProjectsQuery,
  buildCohortGqlOperator,
  ProjectDefaults,
  useCoreDispatch,
  joinFilters,
  SortBy,
  usePrevious,
} from "@gff/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import ProjectsCohortButton from "./ProjectsCohortButton";
import download from "src/utils/download";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { convertDateToString } from "src/utils/date";
import { extractToArray } from "src/utils";
import { ArraySeparatedSpan } from "../shared/ArraySeparatedSpan";
import { SummaryModalContext } from "src/utils/contexts";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  ColumnDef,
  ColumnOrderState,
  createColumnHelper,
  ExpandedState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "@mantine/core";
import { downloadTSV } from "@/components/Table/utils";
import { isEqual } from "lodash";
import SubrowPrimarySiteDiseaseType from "../shared/SubrowPrimarySiteDiseaseType";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";
import { HandleChangeInput } from "@/components/Table/types";

type ProjectDataType = {
  project: string;
  disease_type: string[];
  primary_site: string[];
  program: string;
  cases: number;
  experimental_strategy: (string | number)[];
  files: string;
};

const ProjectsTable: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy[]>([
    { field: "summary.case_count", direction: "desc" },
  ]);

  const { setEntityMetadata } = useContext(SummaryModalContext);

  const projectFilters = useAppSelector((state) => selectFilters(state));

  const { data, isSuccess, isFetching, isError } = useGetProjectsQuery({
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

  const sortByActions = (sortByObj: SortingState) => {
    const COLUMN_ID_TO_FIELD = {
      project: "project_id",
      files: "summary.file_count",
      cases: "summary.case_count",
      program: "program.name",
    };
    const tempSortBy: SortBy[] = sortByObj.map((sortObj) => {
      // map sort ids to api ids
      return {
        field: COLUMN_ID_TO_FIELD[sortObj.id],
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
    setSortBy(tempSortBy);
  };

  const prevProjectFilters = usePrevious(projectFilters);
  useEffect(
    () => !isEqual(prevProjectFilters, projectFilters) && setActivePage(1),
    [prevProjectFilters, projectFilters],
  );

  const [formattedTableData, tempPagination] = useMemo(() => {
    if (!isFetching && isSuccess) {
      return [
        data?.projectData?.map(
          ({
            project_id,
            disease_type,
            primary_site,
            program,
            summary,
          }: ProjectDefaults) => ({
            project: project_id,
            disease_type: [...disease_type].sort((a, b) =>
              a.toLowerCase().localeCompare(b.toLowerCase()),
            ),
            primary_site: [...primary_site].sort((a, b) =>
              a.toLowerCase().localeCompare(b.toLowerCase()),
            ),
            program: program?.name,
            cases: summary?.case_count,
            experimental_strategy: (
              [
                ...extractToArray(
                  summary?.experimental_strategies,
                  "experimental_strategy",
                ),
              ] as string[]
            ).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
            files: summary?.file_count.toLocaleString(),
          }),
        ) as ProjectDataType[],
        data.pagination,
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
  }, [isSuccess, isFetching, data?.projectData, data?.pagination]);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [expandedColumnId, setExpandedColumnId] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(-1);
  const projectsTableColumnHelper = createColumnHelper<ProjectDataType>();
  const projectsTableDefaultColumns = useMemo<ColumnDef<ProjectDataType>[]>(
    () => [
      projectsTableColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            size="xs"
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
            {...{
              checked: table.getIsAllRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
            aria-label="Select all the rows of the table"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size="xs"
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
            aria-label="checkbox for selecting table row"
            {...{
              checked: row.getIsSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
        enableHiding: false,
      }),
      projectsTableColumnHelper.accessor("project", {
        id: "project",
        header: "Project",
        cell: ({ getValue }) => (
          <OverflowTooltippedLabel label={getValue()}>
            <PopupIconButton
              handleClick={() =>
                setEntityMetadata({
                  entity_type: "project",
                  entity_id: getValue(),
                })
              }
              label={getValue()}
            />
          </OverflowTooltippedLabel>
        ),
        enableSorting: true,
      }),
      projectsTableColumnHelper.accessor("disease_type", {
        id: "disease_type",
        header: "Disease Type",
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Disease Types"
            isRowExpanded={row.getIsExpanded()}
            isColumnExpanded={expandedColumnId === "disease_type"}
          />
        ),
        enableSorting: false,
      }),
      projectsTableColumnHelper.accessor("primary_site", {
        id: "primary_site",
        header: "Primary Site",
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Primary Sites"
            isRowExpanded={row.getIsExpanded()}
            isColumnExpanded={expandedColumnId === "primary_site"}
          />
        ),
        enableSorting: false,
      }),
      projectsTableColumnHelper.accessor("program", {
        id: "program",
        header: "Program",
        cell: ({ getValue }) => (
          <OverflowTooltippedLabel label={getValue()} className="font-content">
            {getValue()}
          </OverflowTooltippedLabel>
        ),
        enableSorting: true,
      }),
      projectsTableColumnHelper.accessor("cases", {
        id: "cases",
        header: "Cases",
        cell: ({ getValue }) => getValue().toLocaleString().padStart(9),
        enableSorting: true,
      }),
      projectsTableColumnHelper.accessor("experimental_strategy", {
        id: "experimental_strategy",
        header: "Experimental Strategy",
        cell: ({ getValue }) => (
          <ArraySeparatedSpan data={getValue() as string[]} />
        ),
        enableSorting: false,
      }),
      projectsTableColumnHelper.accessor("files", {
        id: "files",
        header: "Files",
        enableSorting: true,
      }),
    ],
    [projectsTableColumnHelper, setEntityMetadata, expandedColumnId],
  );

  const [rowSelection, setRowSelection] = useState({});
  const pickedProjects = Object.entries(rowSelection)
    ?.filter(([, isSelected]) => isSelected)
    ?.map(([index]) => (formattedTableData[index] as ProjectDataType)?.project);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    projectsTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    files: false,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "cases", desc: true },
  ]);

  useEffect(() => {
    setRowSelection({});
    sortByActions(sorting);
  }, [sorting]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setActivePage(1);
        break;
      case "newPageNumber":
        setActivePage(obj.newPageNumber);
        setExpanded({});
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch);
        setActivePage(1);
        setExpanded({});
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
          "summary.experimental_strategies.experimental_strategy",
          "summary.experimental_strategies.case_count",
          "summary.file_count",
        ].join(","),
      },
      dispatch: coreDispatch,
    });
  };

  const handleDownloadTSV = () => {
    downloadTSV({
      tableData: formattedTableData,
      columnOrder,
      columnVisibility,
      columns: projectsTableDefaultColumns,
      fileName: `projects-table.${convertDateToString(new Date())}.tsv`,
      option: { blacklist: ["select"] },
    });
  };

  const handleExpand = (row: Row<ProjectDataType>, columnId: string) => {
    if (
      Object.keys(expanded).length > 0 &&
      row.index === expandedRowId &&
      columnId === expandedColumnId
    ) {
      setExpanded({});
    } else if ((row.original[columnId] as string[]).length > 1) {
      setExpanded({ [row.index]: true });
      setExpandedColumnId(columnId);
      setExpandedRowId(row.index);
    }
  };

  return (
    <VerticalTable
      tableTitle={`Total of ${data?.pagination?.total?.toLocaleString()} ${
        data?.pagination?.total > 1 ? "Projects" : "Project"
      }`}
      additionalControls={
        <div className="flex gap-2">
          <ProjectsCohortButton pickedProjects={pickedProjects} />
          <FunctionButton
            data-testid="button-json-projects-table"
            onClick={handleDownloadJSON}
          >
            JSON
          </FunctionButton>
          <FunctionButton
            data-testid="button-tsv-projects-table"
            onClick={handleDownloadTSV}
          >
            TSV
          </FunctionButton>
        </div>
      }
      data={formattedTableData}
      columns={projectsTableDefaultColumns}
      showControls={true}
      pagination={{
        ...tempPagination,
        label: "projects",
      }}
      search={{
        enabled: true,
      }}
      getRowCanExpand={() => true}
      expandableColumnIds={["disease_type", "primary_site"]}
      renderSubComponent={({ row, clickedColumnId }) => (
        <SubrowPrimarySiteDiseaseType row={row} columnId={clickedColumnId} />
      )}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      handleChange={handleChange}
      enableRowSelection={true}
      setRowSelection={setRowSelection}
      rowSelection={rowSelection}
      setColumnVisibility={setColumnVisibility}
      columnVisibility={columnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnSorting="manual"
      sorting={sorting}
      setSorting={setSorting}
      expanded={expanded}
      setExpanded={handleExpand}
    />
  );
};

export default ProjectsTable;
