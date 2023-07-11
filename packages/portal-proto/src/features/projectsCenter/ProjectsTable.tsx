import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  VerticalTable,
  HandleChangeInput,
  Columns,
} from "../shared/VerticalTable";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import { Row, TableInstance } from "react-table";
import {
  useGetProjectsQuery,
  buildCohortGqlOperator,
  ProjectDefaults,
  useCoreDispatch,
  joinFilters,
  SortBy,
} from "@gff/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import {
  SelectProjectButton,
  SelectAllProjectsButton,
} from "@/features/projectsCenter/SelectProjectButton";
import ProjectsCohortButton from "./ProjectsCohortButton";
import download from "src/utils/download";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { convertDateToString } from "src/utils/date";
import { extractToArray } from "src/utils";
import { ArraySeparatedSpan } from "../shared/ArraySeparatedSpan";
import { SummaryModalContext } from "src/utils/contexts";
import saveAs from "file-saver";

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
        return <div className="text-left">{value}</div>;
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
      id: "experimental_strategies",
      columnName: "Experimental Strategy",
      visible: true,
      Cell: ({ value }: CellProps) => <ArraySeparatedSpan data={value} />,
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
        data?.projectData?.map(
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
                <PopupIconButton
                  handleClick={() =>
                    setEntityMetadata({
                      entity_type: "project",
                      entity_id: project_id,
                    })
                  }
                  label={project_id}
                />
              </OverflowTooltippedLabel>
            ),
            disease_type: disease_type,
            primary_site: primary_site,
            program: (
              <OverflowTooltippedLabel
                label={program?.name}
                className="font-content"
              >
                {program?.name}
              </OverflowTooltippedLabel>
            ),
            cases: summary?.case_count.toLocaleString().padStart(9),
            experimental_strategies: extractToArray(
              summary?.experimental_strategies,
              "experimental_strategy",
            ),
            files: summary?.file_count.toLocaleString(),
          }),
        ),
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
  }, [isSuccess, data, setEntityMetadata]);

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

  const handleDownloadTSV = () => {
    const fileName = `projects-table.${convertDateToString(new Date())}.tsv`;
    const headers = [
      "Project",
      "Disease Type",
      "Primary Site",
      "Program",
      "Cases",
      "Experimental Strategy",
      "Files",
    ];
    const body = data?.projectData
      .map(
        ({
          project_id,
          disease_type,
          primary_site,
          program: { name },
          summary: { case_count, experimental_strategies, file_count },
        }) => {
          return [
            project_id,
            [...disease_type].sort(),
            [...primary_site].sort(),
            name,
            case_count,
            [
              ...experimental_strategies.map(
                ({ experimental_strategy }) => experimental_strategy,
              ),
            ].sort(),
            file_count,
          ].join("\t");
        },
      )
      .join("\n");
    const tsv = [headers.join("\t"), body].join("\n");
    const blob = new Blob([tsv as BlobPart], { type: "text/tsv" });
    saveAs(blob, fileName);
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
