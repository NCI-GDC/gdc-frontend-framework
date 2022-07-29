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
            <div className="p-4 text-nci-gray">
              <div className="flex">
                <div className="flex-auto bg-white mr-4">
                  <h2 className="p-2 text-2xl mx-4">File Not Found</h2>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
