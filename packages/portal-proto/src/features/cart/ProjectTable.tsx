import { CartSummaryData } from "@gff/core";
import fileSize from "filesize";
import { VerticalTable } from "../shared/VerticalTable";

const columnListOrder = [
  { id: "key", columnName: "Project", visible: true },
  { id: "case_count", columnName: "Cases", visible: true },
  { id: "doc_count", columnName: "Files", visible: true },
  { id: "file_size", columnName: "File Size", visible: true },
];

const columnCells = [
  { Header: "Project", accessor: "key", width: 200 },
  { Header: "Cases", accessor: "case_count" },
  { Header: "Files", accessor: "doc_count" },
  { Header: "File Size", accessor: "file_size" },
];

interface ProjectTableProps {
  readonly projectData: CartSummaryData;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData,
}: ProjectTableProps) => {
  const tableData = projectData.byProject.map((project) => ({
    key: project.key,
    case_count: project.case_count,
    doc_count: project.doc_count,
    file_size: fileSize(project.file_size),
  }));

  return (
    <VerticalTable
      tableData={tableData}
      columnListOrder={columnListOrder}
      columnCells={columnCells}
      selectableRow={false}
      handleColumnChange={undefined}
      showControls={false}
    />
  );
};

export default ProjectTable;
