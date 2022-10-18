import { useState } from "react";
import { VerticalTable } from "../shared/VerticalTable";
import Link from "next/link";
import { Badge } from "@mantine/core";
import {
  useCoreDispatch,
  useCoreSelector,
  useProjects,
  filterSetToOperation,
  buildCohortGqlOperator,
} from "@gff/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectFilters } from "@/features/projectsCenter/projectCenterFiltersSlice";
import FunctionButton from "@/components/FunctionButton";

const ProjectsTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);

  const columnListOrder = [
    { id: "project", columnName: "Project", visible: true },
    { id: "disease_type", columnName: "Disease Type", visible: true },
    { id: "primary_site", columnName: "Primary Site", visible: true },
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
  const projectFilters = useAppSelector((state) => selectFilters(state));
  const { data, pagination, isSuccess } = useProjects({
    filters: buildCohortGqlOperator(projectFilters),
    expand: [
      "summary", //annotations
      "summary.experimental_strategies",
      "summary.data_categories",
    ],
    size: pageSize,
    from: offset * pageSize,
  });

  console.log("ProjectTable", data, isSuccess, pagination);

  if (isSuccess) {
    tempPagination = pagination;
    formattedTableData = data.map((project) => ({
      project: (
        <Link href={`/projects/${project.id}`}>
          <a className="text-utility-link underline">{project.id}</a>
        </Link>
      ),
      //   fileName: (
      //     <Link href={`/files/${project.id}`}>
      //       <a className="text-utility-link underline">{project.fileName}</a>
      //     </Link>
      //   ),
      //   cases: project.cases?.length.toLocaleString() || 0,
      //   project_id: (
      //     <Link href={`/projects/${project.project_id}`}>
      //       <a className="text-utility-link underline">{project.project_id}</a>
      //     </Link>
      //   ),
      //   dataCategory: project.dataCategory,
      //   dataType: project.dataType,
      //   dataFormat: project.dataFormat,
      //   experimentalStrategy: project.experimentalStrategy || "--",
      //   platform: project.platform || "--",
      //   fileSize: fileSize(project.fileSize),
      //   annotations: project.annotations?.length || 0,
      // }));
    }));
  }

  //This if for handling pagination changes

  // const coreDispatch = useCoreDispatch();

  // const getCohortCases = (pageSize = 20, offset = 0) => {
  //   coreDispatch(
  //     fetchFiles({
  //       filters: FilterSetToOperation(projectFilters),
  //       expand: [
  //         "summary", //annotations
  //         "summary.experimental_strategies",
  //         "summary.data_categories"
  //       ],
  //       size: pageSize,
  //       from: offset * pageSize,
  //     }),
  //   );
  // };
  // const handlePageSizeChange = (x: string) => {
  //   getCohortCases(parseInt(x), 0);
  // };
  // const handlePageChange = (x: number) => {
  //   getCohortCases(tempPagination.size, x - 1);
  // };

  //update everything that uses table component
  return <div>Table</div>;
  // <VerticalTable
  //   tableTitle={`Total of ${tempPagination?.total} Projects`}
  //   additionalControls={
  //     <div className="flex gap-2">
  //       <FunctionButton>JSON</FunctionButton>
  //       <FunctionButton>TSV</FunctionButton>
  //     </div>
  //   }
  //   tableData={formattedTableData}
  //   columnListOrder={columnListOrder}
  //   columnCells={columnCells}
  //   handleColumnChange={handleColumnChange}
  //   selectableRow={false}
  //   pagination={{
  //     handlePageSizeChange,
  //     handlePageChange,
  //     ...tempPagination,
  //     label: "files",
  //   }}
  //   status={status}
  // />
};

export default ProjectsTable;
