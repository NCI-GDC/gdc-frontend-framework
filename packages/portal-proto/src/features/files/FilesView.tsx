import { GdcFile, useFiles } from "@gff/core";

export const ContextualFilesView: React.FC<unknown> = () => {
  const { data } = useFiles();
  return <FilesView files={data} />;
};

export interface FilesViewProps {
  readonly files?: ReadonlyArray<GdcFile>;
}

export const FilesView: React.FC<FilesViewProps> = ({
  files,
}: FilesViewProps) => {
  return (
    <table
      className="table-auto border-collapse border-nci-gray w-full"
      style={{ borderSpacing: "4em" }}
    >
      <thead>
        <tr className="bg-nci-blue text-white">
          <th className="px-2">File</th>
          <th className="px-2">Access</th>
          <th className="px-2">Experimental Strategy</th>
          <th className="px-2">Data Category</th>
          <th className="px-2">Data Format</th>
          <th className="px-2">File Size</th>
        </tr>
      </thead>
      <tbody>
        {files &&
          files.map((file, i) => (
            <tr key={file.id} className={i % 2 == 0 ? "bg-gray-200" : ""}>
              <td className="px-2 break-all">{file.fileName}</td>
              <td className="px-2">{file.access}</td>
              <td className="px-2">{file.experimentalStrategy}</td>
              <td className="px-2">{file.dataCategory}</td>
              <td className="px-2">{file.dataFormat}</td>
              <td className="px-2">{file.fileSize}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
