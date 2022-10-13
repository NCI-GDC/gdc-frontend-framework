import fileSize from "filesize";
import { CartFile } from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";

const columnListOrder = [
  { id: "level", columnName: "Level", visible: true },
  { id: "files", columnName: "Files", visible: true },
  { id: "file_size", columnName: "File Name", visible: true },
];

const columnCells = [
  { Header: "Level", accessor: "level" },
  { Header: "Files", accessor: "files" },
  { Header: "File Size", accessor: "file_size" },
];

interface AuthorizationTableProps {
  readonly filesByCanAccess: Record<string, CartFile[]>;
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({
  filesByCanAccess,
}: AuthorizationTableProps) => {
  const tableData = [
    {
      level: "Authorized",
      files: filesByCanAccess?.true?.length || 0,
      file_size: fileSize(
        filesByCanAccess?.true
          ?.map((f) => f.fileSize)
          .reduce((previousFile, file) => previousFile + file) || 0,
      ),
    },
    {
      level: "Unauthorized",
      files: filesByCanAccess?.false?.length || 0,
      file_size: fileSize(
        filesByCanAccess?.false
          ?.map((f) => f.fileSize)
          .reduce((previousFile, file) => previousFile + file) || 0,
      ),
    },
  ];

  return (
    <VerticalTable
      tableData={tableData}
      columnListOrder={columnListOrder}
      columnCells={columnCells}
      showControls={false}
      selectableRow={false}
      handleColumnChange={undefined}
    />
  );
};

export default AuthorizationTable;
