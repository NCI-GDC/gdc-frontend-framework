import { useFiles } from "@gff/core";
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
      }
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
      "analysis",
      "analysis.input_files",
      "downstream_analyses",
      "downstream_analyses.output_files",
    ],
    size: 1,
  });
  const title = data?.[0] ?
    data[0].fileName : `${props.setCurrentFile} not found`;

  return (
    <div>
      {data && !isFetching ? 
      <>
        <div className="bg-white py-4 px-8 shadow-lg">
          <span className="rounded-full bg-nci-blue-darker text-white p-1 align-text-bottom mr-2">FL</span>
          <span className="text-2xl text-nci-blue-darker">
            {title}
          </span>
        </div>
        <FileView file={data?.[0]} />
      </>
      : null }
    </div>
  );
};
