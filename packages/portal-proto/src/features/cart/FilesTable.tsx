import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import fileSize from "filesize";
import { Badge, Button, Menu } from "@mantine/core";
import { MdArrowDropDown as DropdownIcon } from "react-icons/md";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import {
  useCoreSelector,
  selectCart,
  useFiles,
  useCoreDispatch,
  CartFile,
} from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { removeFromCart, RemoveFromCartButton } from "./updateCart";
import FunctionButton from "@/components/FunctionButton";
import { downloadJSON, downloadTSV } from "../shared/TableUtils";
import { convertDateToString } from "src/utils/date";

const columnCells = [
  { Header: "Remove", accessor: "remove", width: 80 },
  { Header: "File UUID", accessor: "uuid" },
  { Header: "Access", accessor: "access" },
  { Header: "File Name", accessor: "name", width: 300 },
  { Header: "Cases", accessor: "cases", width: 80 },
  { Header: "Project", accessor: "project", width: 300 },
  { Header: "Data Category", accessor: "data_category" },
  { Header: "Data Type", accessor: "data_type" },
  { Header: "Data Format", accessor: "data_format", width: 80 },
  { Header: "Experimental Strategy", accessor: "experimental_strategy" },
  { Header: "Platform", accessor: "platform" },
  { Header: "File Size", accessor: "file_size" },
  { Header: "Annotations", accessor: "annotations", width: 100 },
];

const initialVisibleColumns = [
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
  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);

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
            value: cart.map((f) => f.fileId),
          },
        },
      ],
    },
    expand: ["annotations", "cases", "cases.project"],
  });

  const columnKeys = visibleColumns
    .filter((column) => column.visible)
    .map((column) => column.id);

  const [visibleData, setVisibleData] = useState(
    tableData.map((row) =>
      Object.fromEntries(
        Object.entries(row).filter(([key]) => columnKeys.includes(key)),
      ),
    ),
  );

  const visibleColumnCells = useMemo(
    () => columnCells.filter((column) => columnKeys.includes(column.accessor)),
    [columnKeys],
  );

  useEffect(() => {
    setTableData(
      isSuccess
        ? data.map((file) => ({
            remove: <RemoveFromCartButton files={[file]} iconOnly />,
            uuid: (
              <Link href={`/files/${file.fileId}`}>
                <a className="text-utility-link underline">{file.fileId}</a>
              </Link>
            ),
            access: (
              <Badge
                className={
                  file.access === "open" //TODO: keep or change to theme color
                    ? "bg-nci-green-lighter/50 text-nci-green-darkest capitalize text-sm"
                    : "bg-nci-red-lighter/50 text-nci-red-darkest capitalize text-sm"
                }
              >
                {file.access}
              </Badge>
            ),
            name: (
              <Link href={`/files/${file.fileId}`}>
                <a className="text-utility-link underline">{file.fileName}</a>
              </Link>
            ),
            cases: file.cases?.length.toLocaleString() || 0,
            project: (
              <Link href={`/projects/${file.project_id}`}>
                <a className="text-utility-link underline">{file.project_id}</a>
              </Link>
            ),
            data_category: file.dataCategory,
            data_format: file.dataFormat,
            file_size: fileSize(file.fileSize),
            annotations: file.annotations?.length || 0,
            data_type: file.dataType,
            experimental_strategy: file.experimentalStrategy || "--",
            platform: file.platform || "--",
          }))
        : [],
    );
  }, [isSuccess, data]);

  useEffect(() => {
    const columnKeys = visibleColumns
      .filter((column) => column.visible)
      .map((column) => column.id);

    setVisibleData(
      tableData.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key]) => columnKeys.includes(key)),
        ),
      ),
    );
  }, [visibleColumns, tableData]);

  const handleColumnChange = (columns) => {
    setVisibleColumns(columns);
  };

  const handleDownloadJSON = () => {
    const keysForDownload = [
      { path: "data_format", composer: "dataFormat" },
      {
        path: "cases",
        composer: (file) =>
          file.cases?.map((caseObj) => ({
            case_id: caseObj.case_id,
            project: { project_id: caseObj.project.project_id },
          })),
      },
      { path: "access" },
      { path: "file_name", composer: "fileName" },
      { path: "file_id", composer: "fileId" },
      { path: "data_category", composer: "dataCategory" },
      { path: "file_size", composer: "fileSize" },
    ];

    downloadJSON(
      data,
      keysForDownload,
      `files.${convertDateToString(new Date())}.json`,
    );
  };

  const handleDownloadTSV = () => {
    console.log({ data, visibleColumnCells });
    downloadTSV(
      data,
      visibleColumnCells,
      `files-table.${convertDateToString(new Date())}.tsv`,
      {
        blacklist: ["remove"],
        overwrite: {
          uuid: {
            composer: "fileId",
          },
          name: {
            composer: "fileName",
          },
          cases: {
            composer: (file) => file.cases?.length.toLocaleString() || 0,
          },
          project: {
            composer: "project_id",
          },
          data_category: {
            composer: "dataCategory",
          },
          data_format: {
            composer: "dataFormat",
          },
          file_size: {
            composer: (file) => fileSize(file.fileSize),
          },
          annotations: {
            composer: (file) => file.annotations?.length || 0,
          },
          data_type: {
            composer: "dataType",
          },
          experimental_strategy: {
            composer: (file) => file.experimentalStrategy || "--",
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
      tableData={visibleData}
      columnListOrder={visibleColumns}
      columnCells={visibleColumnCells}
      selectableRow={false}
      handleColumnChange={handleColumnChange}
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
        handlePageSizeChange: (pageSize: string) =>
          setPageSize(parseInt(pageSize)),
        handlePageChange: (page: number) => setActivePage(page),
        ...pagination,
        label: "files",
      }}
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
