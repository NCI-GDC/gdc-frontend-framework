import { useFiles } from "@gff/core";
import { FileView } from "./FileView";

export interface ContextualFileViewProps {
  readonly setCurrentFile: string;
}

export const ContextualFileView: React.FC<ContextualFileViewProps> = (
  props: ContextualFileViewProps,
) => {  
  const { data } = useFiles({ 
    filters: {
      op: "=",
      content: {
        field: "file_id",
        value: props.setCurrentFile,
      }
    },
    expand: ['cases.project'],
    size: 1
  });
  const fileName = data?.[0]?.fileName;

  return (
    <div>
      <div className="bg-white py-4 px-8 shadow-lg">
        <span className="rounded-full bg-nci-blue-darker text-white p-1 align-text-bottom mr-2">FL</span>
        <span className="text-2xl text-nci-blue-darker">{fileName}</span>
      </div>
      <div className="p-4">
        {data?.[0] ? <FileView file={data[0]} />:null}
      </div>
    </div>
  );
};