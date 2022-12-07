import { useEffect, useState } from "react";
import Link from "next/link";
import fileSize from "filesize";
import { Button, Menu } from "@mantine/core";
import { MdArrowDropDown as DropdownIcon } from "react-icons/md";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { capitalize } from "lodash";
import {
  useCoreSelector,
  selectCart,
  useFiles,
  useCoreDispatch,
  CartFile,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
  Columns,
  filterColumnCells,
} from "@/features/shared/VerticalTable";
import { removeFromCart, RemoveFromCartButton } from "./updateCart";
import FunctionButton from "@/components/FunctionButton";
import { downloadTSV } from "../shared/TableUtils";
import { convertDateToString } from "src/utils/date";
import download from "src/utils/download";
import { FileAccessBadge } from "@/components/FileAccessBadge";

const initialVisibleColumns: Columns[] = [
  { id: "remove", columnName: "Remove", visible: true },
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

const FilesTable: React.FC<FilesTableProps> = ({
  filesByCanAccess,
}: FilesTableProps) => {
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
  const { data, isFetching, isSuccess, isError, pagination } = useFiles({
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

  useEffect(() => {
    setTableData(
      isSuccess
        ? data.map((file) => ({
            remove: <RemoveFromCartButton files={[file]} iconOnly />,
            uuid: (
              <Link href={`/files/${file.file_id}`}>
                <a className="text-utility-link underline">{file.file_id}</a>
              </Link>
            ),
            access: <FileAccessBadge access={file.access} />,
            name: (
              <Link href={`/files/${file.file_id}`}>
                <a className="text-utility-link underline">{file.file_name}</a>
              </Link>
            ),
            cases: file.cases?.length.toLocaleString() || 0,
            project: (
              <Link href={`/projects/${file.project_id}`}>
                <a className="text-utility-link underline">{file.project_id}</a>
              </Link>
            ),
            data_category: file.data_category,
            data_format: file.data_format,
            file_size: fileSize(file.file_size),
            annotations: file.annotations?.length || 0,
            data_type: file.data_type,
            experimental_strategy: file.experimental_strategy || "--",
            platform: file.platform || "--",
          }))
        : [],
    );
  }, [isSuccess, data]);

  const handleDownloadJSON = async () => {
    await download({
      endpoint: "files",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
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
      queryParams: `?${new URLSearchParams({
        annotations: "true",
        related_files: "true",
      }).toString()}`,
    });
  };

  const handleDownloadTSV = () => {
    downloadTSV(
      data,
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
      tableTitle={`Showing ${(activePage - 1) * pageSize + 1} - ${
        activePage * pageSize < pagination?.total
          ? activePage * pageSize
          : pagination?.total
      } of ${pagination?.total} files`}
      additionalControls={
        <div className="flex gap-2">
          <FunctionButton onClick={handleDownloadJSON}>JSON</FunctionButton>
          <FunctionButton onClick={handleDownloadTSV}>TSV</FunctionButton>
          <Menu>
            <Menu.Target>
              <Button
                leftIcon={<TrashIcon />}
                rightIcon={<DropdownIcon size={20} />}
                classNames={{
                  root: "bg-nci-red-darker", //TODO: find good color theme for this
                  rightIcon: "border-l pl-1 -mr-2",
                }}
              >
                Remove From Cart
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => removeFromCart(data, cart, dispatch)}>
                All Files ({cart.length})
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  removeFromCart(filesByCanAccess?.false || [], cart, dispatch)
                }
              >
                Unauthorized Files ({(filesByCanAccess?.false || []).length})
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      }
      pagination={{
        ...pagination,
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
