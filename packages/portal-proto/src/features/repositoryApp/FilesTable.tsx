import { useState } from "react";
import { Pagination, Select, Table } from "@mantine/core";
import { MdLock as LockedIcon, MdLockOpen as OpenIcon } from "react-icons/md";
import fileSize from "filesize";
import { FilesViewProps } from "@/features/files/FilesView";

const FilesTables: React.FC<FilesViewProps> = ({
  files = [],
  handleFileSelected = () => void 0,
  handleCheckedFiles = () => void 0,
}: FilesViewProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);
  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  };
  return (
    <div className="flex flex-col gap-y-4">
      <Table verticalSpacing="xs" striped highlightOnHover>
        <thead>
          <tr className="bg-base-light text-primary-content-darkest text-md text-montserrat border border-base">
            <th className="px-2">
              <input type="checkbox" />
            </th>
            <th className="px-2 th-base-lightest" style={{ color: "#FFFFFF" }}>
              File
            </th>
            <th className="px-2 " style={{ color: "#FFFFFF" }}>
              Access
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              Experimental Strategy
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              Data Category
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              Data Format
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              File Size
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className="px-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckedFiles(e, file)}
                />
              </td>
              <td className="flex flex-row items-center flex-nowrap">
                {file.access === "open" ? (
                  <OpenIcon className="pr-1" />
                ) : (
                  <LockedIcon className="pr-1" />
                )}
                {file.access}
              </td>
              <td className="px-2 break-all">
                <button onClick={() => handleFileSelected(file)}>
                  {file.fileName}
                </button>
              </td>
              <td className="px-2">{file.experimentalStrategy}</td>
              <td className="px-2">{file.dataCategory}</td>
              <td className="px-2">{file.dataFormat}</td>
              <td className="px-2">{fileSize(file.fileSize)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="flex flex-row items-center justify-start border-t border-base-light">
        <p className="px-2">Page Size:</p>
        <Select
          size="sm"
          radius="md"
          onChange={handlePageSizeChange}
          value={pageSize.toString()}
          data={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "40", label: "40" },
            { value: "100", label: "100" },
          ]}
        />
        <Pagination
          size="sm"
          radius="md"
          color="accent"
          className="ml-auto"
          page={activePage}
          onChange={setPage}
          total={pages}
        />
      </div>
    </div>
  );
};

export default FilesTables;
