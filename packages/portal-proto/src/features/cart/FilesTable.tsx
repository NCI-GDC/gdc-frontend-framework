import { useEffect, useState } from "react";
import Link from "next/link";
import fileSize from "filesize";
import {
  Badge,
  Button,
  Menu,
  MenuItem,
  Select,
  Pagination,
  Loader,
  Alert,
} from "@mantine/core";
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
  const { data, isFetching, isSuccess, isUninitialized, isError, pagination } =
    useFiles({
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
                <a className="text-nci-blue underline">{file.fileId}</a>
              </Link>
            ),
            access: (
              <Badge
                className={
                  file.access === "open"
                    ? "bg-nci-green-lighter/50 text-nci-green-darkest capitalize text-sm"
                    : "bg-nci-red-lighter/50 text-nci-red-darkest capitalize text-sm"
                }
              >
                {file.access}
              </Badge>
            ),
            name: (
              <Link href={`/files/${file.fileId}`}>
                <a className="text-nci-blue underline">{file.fileName}</a>
              </Link>
            ),
            cases: file.cases?.length.toLocaleString() || 0,
            project: (
              <Link href={`/projects/${file.project_id}`}>
                <a className="text-nci-blue underline">{file.project_id}</a>
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

  return isFetching || isUninitialized ? (
    <div className="grid place-items-center h-96 w-full pt-64 pb-72">
      <div className="flex flex-row">
        <Loader color="gray" size={24} />
      </div>
    </div>
  ) : isError ? (
    <Alert>Error loading table</Alert>
  ) : (
    <>
      <VerticalTable
        tableData={visibleData}
        columnListOrder={visibleColumns}
        columnCells={columnCells.filter((column) =>
          columnKeys.includes(column.accessor),
        )}
        pageSize={pageSize.toString()}
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
                "bg-white text-nci-blue-darkest border-nci-blue-darkest"
              }
            >
              JSON
            </Button>
            <Button
              className={
                "bg-white text-nci-blue-darkest border-nci-blue-darkest"
              }
            >
              TSV
            </Button>
            <Menu
              control={
                <Button
                  leftIcon={<TrashIcon />}
                  rightIcon={<DropdownIcon size={20} />}
                  classNames={{
                    root: "bg-nci-red-darker",
                    rightIcon: "border-l pl-1 -mr-2",
                  }}
                >
                  Remove From Cart
                </Button>
              }
            >
              <MenuItem onClick={() => removeFromCart(data, cart, dispatch)}>
                All Files
              </MenuItem>
              <MenuItem>Unauthorized Files</MenuItem>
            </Menu>
          </div>
        }
      />
      <div className="flex flex-row items-center justify-start border-t border-nci-gray-light w-9/12">
        <p className="px-2">Page Size:</p>
        <Select
          size="sm"
          radius="md"
          onChange={(pageSize: string) => setPageSize(parseInt(pageSize))}
          value={pageSize.toString()}
          data={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "40", label: "40" },
            { value: "100", label: "100" },
          ]}
        />
        <Pagination
          classNames={{
            active: "bg-nci-gray",
          }}
          size="sm"
          radius="md"
          color="gray"
          className="ml-auto"
          page={activePage}
          onChange={(page: number) => setActivePage(page)}
          total={pagination?.pages || 1}
        />
      </div>
    </>
  );
};

export default FilesTable;
