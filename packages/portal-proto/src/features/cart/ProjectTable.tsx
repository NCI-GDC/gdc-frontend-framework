import { CartAggregation } from "@gff/core";
import fileSize from "filesize";
import { ScrollableTableWithFixedHeader } from "@/components/ScrollableTableWithFixedHeader/ScrollableTableWithFixedHeader";

const columnListOrder = ["Project", "Cases", "Files", "File Size"];

interface ProjectTableProps {
  readonly projectData: CartAggregation[];
  readonly customDataTestID?: string;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData,
  customDataTestID,
}: ProjectTableProps) => {
  const tableData = (projectData || []).map((project) => ({
    key: project.key,
    case_count: project.case_count?.toLocaleString(),
    doc_count: project.doc_count?.toLocaleString(),
    file_size: fileSize(project.file_size),
  }));

  return (
    <ScrollableTableWithFixedHeader
      customDataTestID={customDataTestID}
      tableData={{
        headers: columnListOrder,
        tableRows: tableData,
      }}
      maxRowsBeforeScroll={5}
    />
  );
};

export default ProjectTable;
