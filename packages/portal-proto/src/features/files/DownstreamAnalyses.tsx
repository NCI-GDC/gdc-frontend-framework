import GenericLink from "@/components/GenericLink";
import { fileInCart } from "@/utils/index";
import { GdcFile, GdcCartFile, CartFile, AccessType } from "@gff/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import fileSize from "filesize";
import { Dispatch, SetStateAction, useMemo } from "react";
import { mapGdcFileToCartFile } from "./utils";
import { TableActionButtons } from "@/components/TableActionButtons";
import VerticalTable from "@/components/Table/VerticalTable";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import TotalItems from "@/components/Table/TotalItem";

const DownstreamAnalyses = ({
  downstream_analyses,
  currentCart,
  setFileToDownload,
}: {
  downstream_analyses: GdcFile["downstream_analyses"];
  currentCart: CartFile[];
  setFileToDownload: Dispatch<SetStateAction<GdcFile>>;
}): JSX.Element => {
  type DownstreamAnalysesType = {
    access: AccessType;
    file_name: string;
    file_id: string;
    data_category: string;
    data_type: string;
    data_format: string;
    analysis_workflow: string;
    size: string;
    outputFile: GdcCartFile;
  };

  const downstreamTableData: DownstreamAnalysesType[] = [];

  downstream_analyses?.forEach((byWorkflowType) => {
    if (byWorkflowType?.output_files) {
      byWorkflowType?.output_files?.forEach((outputFile) => {
        const transformedFile = {
          access: outputFile.access,
          file_name: outputFile.file_name,
          file_id: outputFile.file_id,
          data_category: outputFile.data_category,
          data_type: outputFile.data_type,
          data_format: outputFile.data_format,
          analysis_workflow: byWorkflowType?.workflow_type,
          size: fileSize(outputFile.file_size),
          outputFile: outputFile,
        };
        downstreamTableData.push(transformedFile);
      });
    }
  });

  const downstreamAnalysesColumnHelper =
    createColumnHelper<DownstreamAnalysesType>();

  const downstremAnalysesDefaultColumns = useMemo<
    ColumnDef<DownstreamAnalysesType>[]
  >(
    () => [
      downstreamAnalysesColumnHelper.accessor("access", {
        id: "access",
        header: "Access",
        cell: ({ getValue }) => <FileAccessBadge access={getValue()} />,
      }),
      downstreamAnalysesColumnHelper.display({
        id: "file_name",
        header: "File Name",
        cell: ({ row }) => (
          <GenericLink
            path={`/files/${row.original?.file_id}`}
            text={row.original.file_name}
          />
        ),
      }),
      downstreamAnalysesColumnHelper.accessor("data_category", {
        id: "data_category",
        header: "Data Category",
      }),
      downstreamAnalysesColumnHelper.accessor("data_type", {
        id: "data_type",
        header: "Data Type",
      }),
      downstreamAnalysesColumnHelper.accessor("data_format", {
        id: "data_format",
        header: "Data Format",
      }),
      downstreamAnalysesColumnHelper.accessor("analysis_workflow", {
        id: "analysis_workflow",
        header: "Analysis Workflow",
      }),
      downstreamAnalysesColumnHelper.accessor("size", {
        id: "size",
        header: "Size",
      }),
      downstreamAnalysesColumnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const isOutputFileInCart = fileInCart(
            currentCart,
            row.original.file_id,
          );
          const mappedFileObj = mapGdcFileToCartFile([row.original.outputFile]);
          return (
            <TableActionButtons
              isOutputFileInCart={isOutputFileInCart}
              file={mappedFileObj}
              downloadFile={row.original.outputFile}
              setFileToDownload={setFileToDownload}
            />
          );
        },
      }),
    ],
    [downstreamAnalysesColumnHelper, currentCart, setFileToDownload],
  );

  return (
    <VerticalTable
      data={downstreamTableData}
      columns={downstremAnalysesDefaultColumns}
      tableTitle={
        <TotalItems
          total={downstreamTableData?.length}
          itemName="downstream analyses file"
        />
      }
    />
  );
};

export default DownstreamAnalyses;
