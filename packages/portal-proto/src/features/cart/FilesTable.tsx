import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Menu, MenuItem } from "@mantine/core";
import { MdArrowDropDown as DropdownIcon } from "react-icons/md";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import {
  useCoreSelector,
  selectCart,
  useFiles,
  useCoreDispatch,
} from "@gff/core";
import { formatFileSize } from "src/utils";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { removeFromCart, RemoveFromCartButton } from "./updateCart";

const columnCells = [
  { Header: "Remove", accessor: "remove", width: 80 },
  { Header: "File UUID", accessor: "uuid" },
  { Header: "Access", accessor: "access" },
  { Header: "File Name", accessor: "name", width: 300 },
  { Header: "Cases", accessor: "cases" },
  { Header: "Project", accessor: "project" },
  { Header: "Data Category", accessor: "data_category" },
  { Header: "Data Format", accessor: "data_format" },
  { Header: "File Size", accessor: "file_size" },
  { Header: "Annotations", accessor: "annotations" },
  { Header: "Data Type", accessor: "data_type" },
  { Header: "Experimental Strategy", accessor: "experimental_strategy" },
  { Header: "Platform", accessor: "platform" },
];

const initialVisibleColumns = [
  { id: "remove", columnName: "Remove", visible: true },
  { id: "uuid", columnName: "File UUID", visible: false },
  { id: "access", columnName: "Access", visible: true },
  { id: "name", columnName: "File Name", visible: true },
  { id: "cases", columnName: "Cases", visible: true },
  { id: "project", columnName: "Project", visible: true },
  { id: "data_category", columnName: "Data Category", visible: true },
  { id: "data_format", columnName: "Data Format", visible: true },
  { id: "file_size", columnName: "File Size", visible: true },
  { id: "annotations", columnName: "Annotations", visible: true },
  { id: "data_type", columnName: "Data Type", visible: false },
  {
    id: "experimental_strategy",
    columnName: "Experimental Strategy",
    visible: false,
  },
  { id: "platform", columnName: "Platform", visible: false },
];

const FilesTable: React.FC = () => {
  const [tableData, setTableData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
  const dispatch = useCoreDispatch();
  const cart = useCoreSelector((state) => selectCart(state));
  const { data, isSuccess } = useFiles({
    size: 20,
    filters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "files.file_id",
            value: cart,
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
        Object.entries(row).filter(([key, _]) => columnKeys.includes(key)),
      ),
    ),
  );

  useEffect(() => {
    setTableData(
      isSuccess
        ? data.map((file) => ({
            remove: <RemoveFromCartButton files={[file]} iconOnly />,
            uuid: file.fileId,
            access: (
              <Badge
                className={
                  file.access === "open"
                    ? "bg-nci-green-lighter text-nci-green"
                    : "bg-nci-red-lighter text-nci-red"
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
            cases: file.cases.length,
            project: (
              <Link href={`/projects/${file.project_id}`}>
                <a className="text-nci-blue underline">{file.project_id}</a>
              </Link>
            ),
            data_category: file.dataCategory,
            data_format: file.dataFormat,
            file_size: formatFileSize(file.fileSize),
            annotations: file.annotations?.length || 0,
            data_type: file.dataType,
            experimental_strategy: file.experimentalStrategy,
            platform: file.platform,
          }))
        : [],
    );
  }, [isSuccess]);

  useEffect(() => {
    const columnKeys = visibleColumns
      .filter((column) => column.visible)
      .map((column) => column.id);

    setVisibleData(
      tableData.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key, _]) => columnKeys.includes(key)),
        ),
      ),
    );
  }, [visibleColumns, tableData]);

  const handleColumnChange = (columns) => {
    setVisibleColumns(columns);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          className={"bg-white text-nci-blue-darkest border-nci-blue-darkest"}
        >
          JSON
        </Button>
        <Button
          className={"bg-white text-nci-blue-darkest border-nci-blue-darkest"}
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
      <VerticalTable
        tableData={visibleData}
        columnListOrder={visibleColumns}
        columnCells={columnCells.filter((column) =>
          columnKeys.includes(column.accessor),
        )}
        pageSize={"20"}
        selectableRow={false}
        handleColumnChange={handleColumnChange}
        tableTitle={""}
      />
    </>
  );
};

export default FilesTable;
