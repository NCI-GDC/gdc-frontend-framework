import GenericLink from "@/components/GenericLink";
import { TableActionButtons } from "@/components/TableActionButtons";
import { CartFile, GdcCartFile, GdcFile } from "@gff/core";
import { createColumnHelper } from "@tanstack/react-table";
import fileSize from "filesize";
import { Dispatch, SetStateAction, useMemo } from "react";
import { mapGdcFileToCartFile } from "./utils";
import { fileInCart } from "@/utils/index";
import VerticalTable from "@/components/Table/VerticalTable";
import { HeaderTitle } from "@/components/tailwindComponents";

type AnalysisInputDataItem = {
  file: GdcCartFile;
  file_name: string;
  file_id: string;
  data_category: string;
  data_type: string;
  data_format: string;
  file_size: string;
};

const AnalysisInputFiles = ({
  inputFiles,
  currentCart,
  setFileToDownload,
}: {
  inputFiles: GdcCartFile[];
  currentCart: CartFile[];
  setFileToDownload: Dispatch<SetStateAction<GdcFile>>;
}): JSX.Element => {
  const data: AnalysisInputDataItem[] = useMemo(() => {
    return inputFiles.map((ipFile) => ({
      file: ipFile,
      file_name: ipFile.file_name,
      file_id: ipFile.file_id,
      data_category: ipFile.data_category,
      data_type: ipFile.data_type,
      data_format: ipFile.data_format,
      file_size: fileSize(ipFile.file_size),
    }));
  }, [inputFiles]);

  const columnHelper = createColumnHelper<AnalysisInputDataItem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("file_name", {
        header: "File Name",
        cell: ({ row }) => (
          <GenericLink
            path={`/files/${row.original.file_id}`}
            text={row.original.file_name}
          />
        ),
      }),
      columnHelper.accessor("data_category", {
        header: "Data Category",
      }),
      columnHelper.accessor("data_type", {
        header: "Data Type",
      }),
      columnHelper.accessor("data_format", {
        header: "Data Format",
      }),
      columnHelper.accessor("file_size", {
        header: "Size",
      }),
      columnHelper.display({
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
    [columnHelper, currentCart, setFileToDownload],
  );

  return (
    <VerticalTable
      customDataTestID="table-source-files-file-summary"
      data={data}
      columns={columns}
      additionalControls={
        <div className="mt-3.5">
          <HeaderTitle>Source Files</HeaderTitle>
        </div>
      }
    />
  );
};

export default AnalysisInputFiles;
