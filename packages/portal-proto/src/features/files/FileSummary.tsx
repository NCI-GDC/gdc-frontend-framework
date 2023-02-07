import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { useGetFilesQuery, useFileHistory } from "@gff/core";
import { FileView } from "./FileView";

export interface ContextualFileViewProps {
  readonly setCurrentFile: string;
  isModal?: boolean;
}

export const ContextualFileView: React.FC<ContextualFileViewProps> = ({
  setCurrentFile,
  isModal,
}: ContextualFileViewProps) => {
  const { data, isFetching } = useGetFilesQuery({
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
    size: 1,
  });
  const history = useFileHistory(setCurrentFile);

  const title = data?.files[0]
    ? data?.files[0].file_name
    : `${setCurrentFile} not found`;
  return (
    <div>
      {data && !isFetching ? (
        <>
          {!isModal && <SummaryHeader iconText="fl" headerTitle={title} />}

          {data?.files[0] ? (
            <FileView
              file={data?.files[0]}
              fileHistory={history?.data?.[0]}
              isModal={isModal}
            />
          ) : (
            <SummaryErrorHeader label="File Not Found" />
          )}
        </>
      ) : null}
    </div>
  );
};
