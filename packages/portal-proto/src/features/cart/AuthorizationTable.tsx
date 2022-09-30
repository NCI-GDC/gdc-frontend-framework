import { groupBy } from "lodash";
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
  readonly cart: CartFile[];
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({
  cart,
}: AuthorizationTableProps) => {
  // TODO - account for user's acccess

  const groupedData = groupBy(cart, "access");
  const tableData = [
    {
      level: "Authorized",
      files: groupedData?.open?.length || 0,
      file_size: fileSize(
        groupedData?.open
          ?.map((f) => f.fileSize)
          .reduce((previousFile, file) => previousFile + file) || 0,
      ),
    },
    {
      level: "Unauthorized",
      files: groupedData?.controlled?.length || 0,
      file_size: fileSize(
        groupedData?.controlled
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
