import { HistoryDefaults } from "@gff/core";
import saveAs from "file-saver";
import { useMemo } from "react";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import VerticalTable from "@/components/Table/VerticalTable";
import { HeaderTitle } from "@/components/tailwindComponents";
import { createColumnHelper } from "@tanstack/react-table";
import TotalItems from "@/components/Table/TotalItem";

const FileVersions = ({
  fileHistory,
  file_id,
}: {
  fileHistory: HistoryDefaults[];
  file_id: string;
}): JSX.Element => {
  const sortedFileHistory = useMemo(
    () =>
      [...(fileHistory ?? [])].sort(
        (a, b) =>
          //sort based on relese number biggest at top
          Number.parseFloat(a.version) - Number.parseFloat(b.version),
      ),
    [fileHistory],
  );

  const handleDownloadTSV = () => {
    const header = ["Version", "File UUID", "Release Date", "Release Number"];

    const body = sortedFileHistory
      .map((obj, index, { length }) =>
        [
          obj.version,
          `${obj.uuid}${index + 1 === length ? " Current Version" : ""}`,
          obj.release_date,
          obj.data_release,
        ].join("\t"),
      )
      .join("\n");

    const tsv = [header.join("\t"), body].join("\n");
    const blob = new Blob([tsv], { type: "text/csv" });

    saveAs(blob, `file-history-${file_id}.tsv`);
  };

  const downloadVersionJSON = () => {
    const jsonData = JSON.stringify([...fileHistory], null, 2);
    const currentDate = new Date().toJSON().slice(0, 10);

    saveAs(
      new Blob([jsonData], {
        type: "application/json",
      }),
      `${file_id}_history.${currentDate}.json`,
    );
  };

  type FileVersionsDataType = {
    version: string;
    file_id: string;
    isCurrent: boolean;
    release_date: string;
    data_release: string;
  };

  const tableData: FileVersionsDataType[] = sortedFileHistory.map(
    (obj, index, { length }) => ({
      version: obj.version,
      file_id: obj.uuid,
      isCurrent: index + 1 === length,

      release_date: obj.release_date,
      data_release: obj.data_release,
    }),
  );

  const fileVersionsColumnHelper = createColumnHelper<FileVersionsDataType>();

  const readGroupsColumns = useMemo(
    () => [
      fileVersionsColumnHelper.accessor("version", {
        header: "Version",
      }),
      fileVersionsColumnHelper.display({
        id: "file_uuid",
        header: "File UUID",
        cell: ({ row }) => (
          <>
            {row.original.file_id}
            {row.original.isCurrent && (
              <span className="inline-block ml-2 border rounded-full bg-primary-darker text-base-max font-bold text-xs py-0.5 px-1">
                Current Version
              </span>
            )}
          </>
        ),
      }),
      fileVersionsColumnHelper.accessor("release_date", {
        header: "Release Date",
      }),
      fileVersionsColumnHelper.accessor("data_release", {
        header: "Release Number",
      }),
    ],
    [fileVersionsColumnHelper],
  );

  return (
    <>
      {fileHistory && (
        <div className="mt-14 mb-16">
          <HeaderTitle>File Versions</HeaderTitle>
          <VerticalTable
            customDataTestID="table-file-versions-file-summary"
            additionalControls={
              <div className="mb-2">
                <DropdownWithIcon
                  dropdownElements={[
                    {
                      title: "TSV",
                      icon: <DownloadIcon size={16} aria-label="download" />,
                      onClick: handleDownloadTSV,
                    },
                    {
                      title: "JSON",
                      icon: <DownloadIcon size={16} aria-label="download" />,
                      onClick: downloadVersionJSON,
                    },
                  ]}
                  TargetButtonChildren="Download"
                  LeftSection={
                    <DownloadIcon size="1rem" aria-label="download" />
                  }
                />
              </div>
            }
            data={tableData}
            tableTitle={
              <TotalItems total={tableData?.length} itemName="version" />
            }
            columns={readGroupsColumns}
          />
        </div>
      )}
    </>
  );
};

export default FileVersions;
