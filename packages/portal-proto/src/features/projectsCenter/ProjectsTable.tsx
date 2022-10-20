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
    { id: "seq", columnName: "Seq", visible: true },
    { id: "exp", columnName: "Exp", visible: true },
    { id: "snv", columnName: "SNV", visible: true },
    { id: "meth", columnName: "Meth", visible: true },
    { id: "clinical", columnName: "Clinical", visible: false },
    {
      id: "clinical_supplement",
      columnName: "Clinical Supplement",
      visible: true,
    },
    { id: "bio", columnName: "Bio", visible: true },
    { id: "bio_supplement", columnName: "Bio Supplement", visible: true },
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
    ],
    size: pageSize,
    from: offset * pageSize,
  });

  /// console.log("ProjectTable", data, isSuccess, pagination);

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
      program: project.program,
      cases: project.summary.case_count,
      seq: extractValue(
        project.summary.data_categories,
        "data_category",
        "Sequencing Reads",
        "case_count",
      ),
      exp: extractValue(
        project.summary.data_categories,
        "data_category",
        "Sequencing Reads",
        "case_count",
      ),
      snv: extractValue(
        project.summary.data_categories,
        "data_category",
        "Simple Nucleotide Variation",
        "case_count",
      ),
      meth: extractValue(
        project.summary.data_categories,
        "data_category",
        "DNA Methylation",
        "case_count",
      ),
      clinical: extractValue(
        project.summary.data_categories,
        "data_category",
        "Clinical",
        "case_count",
      ),
      clinical_supplement: extractValue(
        project.summary.data_categories,
        "data_category",
        "Sequencing Reads",
        "case_count",
      ),
      bio: extractValue(
        project.summary.data_categories,
        "data_category",
        "Sequencing Reads",
        "case_count",
      ),
      bio_supplement: extractValue(
        project.summary.data_categories,
        "data_category",
        "Sequencing Reads",
        "case_count",
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
