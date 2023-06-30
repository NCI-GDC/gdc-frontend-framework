import { CartAggregation } from "@gff/core";
import fileSize from "filesize";
import { ScrollableTableWithFixedHeader } from "@/components/ScrollableTableWithFixedHeader";

const columnListOrder = ["Project", "Cases", "Files", "File Size"];

interface ProjectTableProps {
  readonly projectData: CartAggregation[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData,
}: ProjectTableProps) => {
  const tableData = projectData.map((project) => ({
    key: project.key,
    case_count: project.case_count,
    doc_count: project.doc_count,
    file_size: fileSize(project.file_size),
  }));

  return (
    <ScrollableTableWithFixedHeader
      tableData={{
        headers: columnListOrder,
        tableRows: tableData,
      }}
      maxRowsBeforeScroll={5}
    />
  );
};

export default ProjectTable;
