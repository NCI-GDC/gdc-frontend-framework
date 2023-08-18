import { useContext, useEffect, useState } from "react";
import fileSize from "filesize";
import { capitalize } from "lodash";
import {
  useCoreSelector,
  selectCart,
  useGetFilesQuery,
  useCoreDispatch,
  CartFile,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
  Columns,
  filterColumnCells,
} from "@/features/shared/VerticalTable";
import { RemoveFromCartButton } from "./updateCart";
import FunctionButton from "@/components/FunctionButton";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { downloadTSV } from "../shared/TableUtils";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import { getAnnotationsLinkParamsFromFiles } from "../shared/utils";
import { SummaryModalContext } from "src/utils/contexts";
import Link from "next/link";

const initialVisibleColumns: Columns[] = [
  { id: "remove", columnName: "Remove", visible: true, arrangeable: false },
  { id: "uuid", columnName: "File UUID", visible: false },
  { id: "access", columnName: "Access", visible: true },
  { id: "name", columnName: "File Name", visible: true },
  { id: "cases", columnName: "Cases", visible: true },
  { id: "project", columnName: "Project", visible: true },
  { id: "data_category", columnName: "Data Category", visible: true },
  { id: "data_type", columnName: "Data Type", visible: false },
  { id: "data_format", columnName: "Data Format", visible: true },
  {
    id: "experimental_strategy",
    columnName: "Experimental Strategy",
    visible: false,
  },
  { id: "platform", columnName: "Platform", visible: false },
  { id: "file_size", columnName: "File Size", visible: true },
  { id: "annotations", columnName: "Annotations", visible: true },
];

interface FilesTableProps {
  readonly filesByCanAccess: Record<string, CartFile[]>;
}

const FilesTable: React.FC<FilesTableProps> = () => {
  const [tableData, setTableData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    filterColumnCells(initialVisibleColumns),
  );
  const [columns, setColumns] = useState(initialVisibleColumns);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setActivePage(obj.newPageNumber);
        break;
      case "newHeadings":
        setVisibleColumns(filterColumnCells(obj.newHeadings));
        setColumns(obj.newHeadings);
        break;
    }
  };

  const dispatch = useCoreDispatch();
  const cart = useCoreSelector((state) => selectCart(state));
  const { data, isFetching, isSuccess, isError } = useGetFilesQuery({
    size: pageSize,
    from: pageSize * (activePage - 1),
    filters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "files.file_id",
            value: cart.map((f) => f.file_id),
          },
        },
      ],
    },
    expand: ["annotations", "cases", "cases.project"],
  });

  const { setEntityMetadata } = useContext(SummaryModalContext);

  useEffect(() => {
    setTableData(
      isSuccess
        ? data?.files.map((file) => ({
            remove: <RemoveFromCartButton files={[file]} iconOnly />,
            uuid: (
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "file",
                    entity_id: file.file_id,
                  })
                }
                label={file.file_id}
                customStyle="text-utility-link underline font-content text-left"
              />
            ),
            access: <FileAccessBadge access={file.access} />,
            name: (
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "file",
                    entity_id: file.file_id,
                  })
                }
                label={file.file_name}
                customStyle="text-utility-link underline font-content text-left"
              />
            ),
            cases: (
              <PopupIconButton
                handleClick={() => {
                  if (file.cases?.length === 0) return;
                  setEntityMetadata({
                    entity_type: file.cases?.length === 1 ? "case" : "file",
                    entity_id:
                      file.cases?.length === 1
                        ? file.cases?.[0].case_id
                        : file.file_id,
                  });
                }}
                label={file.cases?.length.toLocaleString() || 0}
                customAriaLabel={`Open ${
                  file.cases?.length === 1 ? "case" : "file"
                } information in modal`}
                customStyle={`font-content ${
                  file.cases?.length > 0
                    ? "text-utility-link underline"
                    : "cursor-default"
                }`}
              />
            ),
            project: (
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "project",
                    entity_id: file.project_id,
                  })
                }
                label={file.project_id}
                customStyle="text-utility-link underline font-content"
              />
            ),
            data_category: file.data_category,
            data_format: file.data_format,
            file_size: fileSize(file.file_size),
            annotations: (
              <>
                {getAnnotationsLinkParamsFromFiles(file) ? (
                  <Link href={getAnnotationsLinkParamsFromFiles(file)} passHref>
                    <a className="text-utility-link underline" target="_blank">
                      {file.annotations.length}
                    </a>
                  </Link>
                ) : (
                  file?.annotations?.length ?? 0
                )}
              </>
            ),
            data_type: file.data_type,
            experimental_strategy: file.experimental_strategy || "--",
            platform: file.platform || "--",
          }))
        : [],
    );
  }, [isSuccess, data, setEntityMetadata]);

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "files",
      method: "POST",
      params: {
        filters: {
          op: "in",
          content: {
            field: "files.file_id",
            value: cart.map((f) => f.file_id),
          },
        },
        size: 10000,
        attachment: true,
        format: "JSON",
        pretty: true,
        annotations: true,
        related_files: true,
        fields: [
          "file_id",
          "access",
          "file_name",
          "cases.case_id",
          "cases.project.project_id",
          "data_category",
          "data_type",
          "data_format",
          "experimental_strategy",
          "platform",
          "file_size",
          "annotations.annotation_id",
        ].join(","),
      },
      dispatch,
    });
  };

  const handleDownloadTSV = () => {
    downloadTSV(
      data?.files,
      visibleColumns,
      `files-table.${convertDateToString(new Date())}.tsv`,
      {
        blacklist: ["remove"],
        overwrite: {
          uuid: {
            composer: "file_id",
          },
          access: {
            composer: (file) => capitalize(file.access),
          },
          name: {
            composer: "file_name",
          },
          cases: {
            composer: (file) => file.cases?.length.toLocaleString() || 0,
          },
          project: {
            composer: "project_id",
          },
          file_size: {
            composer: (file) => fileSize(file.file_size),
          },
          annotations: {
            composer: (file) => file.annotations?.length || 0,
          },
          experimental_strategy: {
            composer: (file) => file.experimental_strategy || "--",
          },
          platform: {
            composer: (file) => file.platform || "--",
          },
        },
      },
    );
  };

  return (
    <VerticalTable
      tableData={tableData}
      columns={columns}
      selectableRow={false}
      additionalControls={
        <div className="flex gap-2 mb-2">
          <FunctionButton onClick={handleDownloadJSON}>JSON</FunctionButton>
          <FunctionButton onClick={handleDownloadTSV}>TSV</FunctionButton>
        </div>
      }
      pagination={{
        ...data?.pagination,
        label: "files",
      }}
      handleChange={handleChange}
      status={
        // convert to CoreSelector status
        isFetching
          ? "pending"
          : isSuccess
          ? "fulfilled"
          : isError
          ? "rejected"
          : "uninitialized"
      }
    />
  );
};

export default FilesTable;
