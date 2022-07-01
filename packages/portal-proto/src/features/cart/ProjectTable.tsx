import { formatFileSize } from "src/utils";
import { VerticalTable } from "../shared/VerticalTable";

const columnListOrder = [
  { id: "key", columnName: "Project", visible: true },
  { id: "case_count", columnName: "Cases", visible: true },
  { id: "doc_count", columnName: "Files", visible: true },
  { id: "file_size", columnName: "File Size", visible: true },
];

const columnCells = [
  { Header: "Project", accessor: "key" },
  { Header: "Cases", accessor: "case_count" },
  { Header: "Files", accessor: "doc_count" },
  { Header: "File Size", accessor: "file_size" },
];

interface ProjectTableProps {
  readonly projectData: any;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData,
}: ProjectTableProps) => {
  const tableData = projectData.map((project) => ({
    key: project.key,
    case_count: project.case_count,
    doc_count: project.doc_count,
    file_size: formatFileSize(project.file_size),
  }));

  return (
    <VerticalTable
      tableData={tableData}
      columnListOrder={columnListOrder}
      columnCells={columnCells}
      pageSize={"20"}
      selectableRow={false}
      handleColumnChange={() => {}}
      tableTitle={""}
    />
  );
};

export default ProjectTable;
