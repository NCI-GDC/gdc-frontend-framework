import fileSize from "filesize";
import { CartFile, useUserDetails } from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { groupByAccess } from "./utils";

const columnListOrder = [
  { id: "level", columnName: "Level", visible: true },
  { id: "files", columnName: "Files", visisble: true },
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
      tableTitle={""}
      selectableRow={false}
      pageSize={"2"}
      handleColumnChange={undefined}
    />
  );
};

export default AuthorizationTable;
