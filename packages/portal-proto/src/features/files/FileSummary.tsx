import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { useGetFilesQuery, useFileHistory } from "@gff/core";
import { FileView } from "./FileView";
import { LoadingOverlay } from "@mantine/core";

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
            <SummaryHeader
              iconText="fl"
              headerTitle={`${setCurrentFile} not found`}
              isModal={isModal}
            />
          ) : (
            <FileView
              file={files[0]}
              fileHistory={history?.data?.[0]}
              isModal={isModal}
            />
          )}
        </>
      ) : (
        <LoadingOverlay visible />
      )}
    </div>
  );
};
