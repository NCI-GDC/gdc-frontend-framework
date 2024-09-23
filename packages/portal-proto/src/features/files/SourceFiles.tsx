import { Dispatch, SetStateAction } from "react";
import GenericLink from "@/components/GenericLink";
import { TableActionButtons } from "@/components/TableActionButtons";
import { AccessType, CartFile, GdcCartFile, GdcFile } from "@gff/core";
import { createColumnHelper } from "@tanstack/react-table";
import fileSize from "filesize";
import { mapGdcFileToCartFile } from "./utils";
import { fileInCart } from "@/utils/index";
import VerticalTable from "@/components/Table/VerticalTable";
import { HeaderTitle } from "@/components/tailwindComponents";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import TotalItems from "@/components/Table/TotalItem";
import { useDeepCompareMemo } from "use-deep-compare";

type SourceFilesItems = {
  file: GdcCartFile;
  access: AccessType;
  file_name: string;
  file_id: string;
  data_category: string;
  data_type: string;
  data_format: string;
  file_size: string;
};

const SourceFilesTableColumnHelper = createColumnHelper<SourceFilesItems>();

const SourceFiles = ({
  inputFiles,
  currentCart,
  setFileToDownload,
}: {
  inputFiles: GdcCartFile[];
  currentCart: CartFile[];
  setFileToDownload: Dispatch<SetStateAction<GdcFile>>;
}): JSX.Element => {
  const data: SourceFilesItems[] = useDeepCompareMemo(() => {
    return inputFiles.map((ipFile) => ({
      file: ipFile,
      access: ipFile.access,
      file_name: ipFile.file_name,
      file_id: ipFile.file_id,
      data_category: ipFile.data_category,
      data_type: ipFile.data_type,
      data_format: ipFile.data_format,
      file_size: fileSize(ipFile.file_size),
    }));
  }, [inputFiles]);

  const columns = useDeepCompareMemo(
    () => [
      SourceFilesTableColumnHelper.accessor("access", {
        id: "access",
        header: "Access",
        cell: ({ getValue }) => <FileAccessBadge access={getValue()} />,
      }),
      SourceFilesTableColumnHelper.accessor("file_name", {
        header: "File Name",
        cell: ({ row }) => (
          <GenericLink
            path={`/files/${row.original.file_id}`}
            text={row.original.file_name}
          />
        ),
      }),
      SourceFilesTableColumnHelper.accessor("data_category", {
        header: "Data Category",
      }),
      SourceFilesTableColumnHelper.accessor("data_type", {
        header: "Data Type",
      }),
      SourceFilesTableColumnHelper.accessor("data_format", {
        header: "Data Format",
      }),
      SourceFilesTableColumnHelper.accessor("file_size", {
        header: "Size",
      }),
      SourceFilesTableColumnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <TableActionButtons
            isOutputFileInCart={fileInCart(currentCart, row.original.file_id)}
            file={mapGdcFileToCartFile([row.original.file])}
            downloadFile={row.original.file}
            setFileToDownload={setFileToDownload}
          />
        ),
      }),
    ],
    [currentCart, setFileToDownload],
  );

  return (
    <VerticalTable
      customDataTestID="table-source-files-file-summary"
      data={data}
      columns={columns}
      tableTotalDetail={<TotalItems total={data?.length} itemName="file" />}
      tableTitle={<HeaderTitle>Source Files</HeaderTitle>}
    />
  );
};

export default SourceFiles;
