import { CartSummaryData } from "@gff/core";
import fileSize from "filesize";
import { ScrollableTableWithFixedHeader } from "@/components/ScrollableTableWithFixedHeader";

const columnListOrder = ["Project", "Cases", "Files", "File Size"];

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
    <div className="border-y-1 border-y-base-lighter">
      <ScrollableTableWithFixedHeader
        tableData={{
          headers: columnListOrder,
          tableRows: tableData,
        }}
        scrollAreaHeight={259}
      />
    </div>
  );
};

export default ProjectTable;
