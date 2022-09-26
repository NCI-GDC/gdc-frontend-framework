import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { useFiles, useFileHistory } from "@gff/core";
import { FileView } from "./FileView";

export interface ContextualFileViewProps {
  readonly setCurrentFile: string;
}

export const ContextualFileView: React.FC<ContextualFileViewProps> = (
  props: ContextualFileViewProps,
) => {
  const { data, isFetching } = useFiles({
    filters: {
      op: "=",
      content: {
        field: "file_id",
        value: props.setCurrentFile,
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
  const hystory = useFileHistory(props.setCurrentFile);

  const title = data?.[0]
    ? data[0].fileName
    : `${props.setCurrentFile} not found`;
  return (
    <div>
      {data && !isFetching ? (
        <>
          <SummaryHeader iconText="FL" headerTitle={title} />
          {data?.[0] ? (
            <FileView file={data?.[0]} fileHistory={hystory?.data?.[0]} />
          ) : (
            <SummaryErrorHeader label="File Not Found" />
          )}
        </>
      ) : null}
    </div>
  );
};
