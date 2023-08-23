import fileSize from "filesize";
import { CartFile } from "@gff/core";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import VerticalTable from "@/components/Table/VerticalTable";

interface AuthorizationTableProps {
  readonly filesByCanAccess: Record<string, CartFile[]>;
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({
  filesByCanAccess,
}: AuthorizationTableProps) => {
  const authorizationTableData = [
    {
      level: "Authorized",
      files: filesByCanAccess?.true?.length || 0,
      file_size: fileSize(
        filesByCanAccess?.true
          ?.map((f) => f.file_size)
          .reduce((previousFile, file) => previousFile + file) || 0,
      ),
    },
    {
      level: "Unauthorized",
      files: filesByCanAccess?.false?.length || 0,
      file_size: fileSize(
        filesByCanAccess?.false
          ?.map((f) => f.file_size)
          .reduce((previousFile, file) => previousFile + file) || 0,
      ),
    },
  ];

  const authorizationTableColumnHelper =
    createColumnHelper<typeof authorizationTableData[0]>();

  const authorizationTableColumns = useMemo(
    () => [
      authorizationTableColumnHelper.accessor("level", {
        id: "level",
        header: "Level",
      }),
      authorizationTableColumnHelper.accessor("files", {
        id: "files",
        header: "Files",
      }),
      authorizationTableColumnHelper.accessor("file_size", {
        id: "file_size",
        header: "File Size",
      }),
    ],
    [authorizationTableColumnHelper],
  );

  return (
    <VerticalTable
      data={authorizationTableData}
      columns={authorizationTableColumns}
    />
  );
};

export default AuthorizationTable;
