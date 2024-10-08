import { useMemo } from "react";
import { useGetHistoryQuery } from "@gff/core";
import saveAs from "file-saver";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import VerticalTable from "@/components/Table/VerticalTable";
import { HeaderTitle } from "@/components/tailwindComponents";
import { createColumnHelper } from "@tanstack/react-table";
import TotalItems from "@/components/Table/TotalItem";
import { statusBooleansToDataStatus } from "@/utils/index";
import { useDeepCompareMemo } from "use-deep-compare";

type FileVersionsDataType = {
  version: string;
  file_id: string;
  isCurrent: boolean;
  release_date: string;
  data_release: string;
};

const fileVersionsColumnHelper = createColumnHelper<FileVersionsDataType>();

const FileVersions = ({ file_id }: { file_id: string }): JSX.Element => {
  const {
    data: fileHistory,
    isFetching,
    isSuccess,
    isError,
  } = useGetHistoryQuery(file_id);
  const sortedFileHistory = useDeepCompareMemo(
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

  const tableData: FileVersionsDataType[] = useDeepCompareMemo(
    () =>
      sortedFileHistory.map((obj, index, { length }) => ({
        version: obj.version,
        file_id: obj.uuid,
        isCurrent: index + 1 === length,

        release_date: obj.release_date,
        data_release: obj.data_release,
      })),
    [sortedFileHistory],
  );

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
    [],
  );

  return (
    <>
      {fileHistory && (
        <div className="flex flex-col gap-2 my-8">
          <VerticalTable
            tableTitle={<HeaderTitle>File Versions</HeaderTitle>}
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
            tableTotalDetail={
              <TotalItems total={tableData?.length} itemName="version" />
            }
            columns={readGroupsColumns}
            status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
          />
        </div>
      )}
    </>
  );
};

export default FileVersions;
