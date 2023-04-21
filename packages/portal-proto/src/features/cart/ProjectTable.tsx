import { useRef } from "react";
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

  const tableRowRef = useRef(null);
  const tableRowHeight =
    tableRowRef.current !== null
      ? window.getComputedStyle(tableRowRef.current).height
      : "";
  return (
    <ScrollableTableWithFixedHeader
      tableData={{
        headers: columnListOrder,
        tableRows: tableData,
      }}
      ref={tableRowRef}
      // max row * height of table row + height of the table header
      scrollAreaHeight={5 * +tableRowHeight.replace("px", "") + 56}
    />
  );
};

export default ProjectTable;
