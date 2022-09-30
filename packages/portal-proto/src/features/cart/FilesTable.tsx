import { useEffect, useState } from "react";
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
} from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { removeFromCart, RemoveFromCartButton } from "./updateCart";

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

const FilesTable: React.FC = () => {
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

  return (
    <VerticalTable
      tableData={visibleData}
      columnListOrder={visibleColumns}
      columnCells={columnCells.filter((column) =>
        columnKeys.includes(column.accessor),
      )}
      selectableRow={false}
      handleColumnChange={handleColumnChange}
      tableTitle={`Showing ${(activePage - 1) * pageSize + 1} - ${
        activePage * pageSize < pagination?.total
          ? activePage * pageSize
          : pagination?.total
      } of ${pagination?.total} files`}
      additionalControls={
        <div className="flex gap-2">
          <Button
            className={
              "bg-base-lightest text-base-contrast-lightest border-primary-darkest"
            }
          >
            JSON
          </Button>
          <Button
            className={
              "bg-base-lightest text-base-contrast-lightest border-primary-darkest"
            }
          >
            TSV
          </Button>
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
                All Files
              </Menu.Item>
              <Menu.Item>Unauthorized Files</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      }
      pagination={{
        handlePageSizeChange: (pageSize: string) =>
          setPageSize(parseInt(pageSize)),
        handlePageChange: (page: number) => setActivePage(page),
        ...pagination,
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
