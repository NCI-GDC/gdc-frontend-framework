import { useGetFilesQuery, useFileHistory } from "@gff/core";
import { FileView } from "./FileView";
import { LoadingOverlay } from "@mantine/core";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";

export interface ContextualFileViewProps {
  readonly setCurrentFile: string;
  isModal?: boolean;
}

export const ContextualFileView: React.FC<ContextualFileViewProps> = ({
  setCurrentFile,
  isModal,
}: ContextualFileViewProps) => {
  const { data: { files } = {}, isFetching } = useGetFilesQuery({
    filters: {
      op: "=",
      content: {
        field: "file_id",
        value: setCurrentFile,
      },
    },
    expand: [
      "cases",
      "cases.annotations",
      "cases.project",
      "cases.samples",
      "cases.samples.portions",
      "cases.samples.portions.analytes",
      "cases.samples.portions.slides",
      "cases.samples.portions.analytes.aliquots",
      "associated_entities",
      "analysis",
      "analysis.input_files",
      "analysis.metadata.read_groups",
      "downstream_analyses",
      "downstream_analyses.output_files",
      "index_files",
    ],
  });
  const history = useFileHistory(setCurrentFile);

  return (
    <div>
      {!isFetching ? (
        <>
          {!files?.[0] ? (
            <SummaryErrorHeader label="File Not Found" />
          ) : (
            <FileView
              file={files[0]}
              fileHistory={history?.data?.[0]}
              isModal={isModal}
            />
          )}
        </>
      ) : (
        <LoadingOverlay data-testid="loading-spinner" visible />
      )}
    </div>
  );
};
