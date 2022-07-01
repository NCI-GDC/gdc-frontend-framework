import { useEffect, useState } from "react";
import Link from "next/link";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { Badge } from "@mantine/core";
import {
  useCoreSelector,
  selectCart,
  useCartFilesTable,
  useCoreDispatch,
} from "@gff/core";
import { formatFileSize } from "src/utils";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { removeFromCart } from "./updateCart";

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

const FilesTable: React.FC = () => {
  const dispatch = useCoreDispatch();
  const [visibleColumns, setVisibleColumns] = useState([
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
  ]);

  const cart = useCoreSelector((state) => selectCart(state));
  const { data } = useCartFilesTable({
    cart,
    size: 20,
    offset: 0,
    sort: [],
  });

  console.log(data);
  const tableData = data.map((file) => {
    const project = file.node.cases.hits.edges[0].node.project.project_id;

    return {
      remove: <TrashIcon />,
      uuid: file.node.file_id,
      access: (
        <Badge
          className={
            file.node.access === "open"
              ? "bg-nci-green-lighter text-nci-green"
              : "bg-nci-red-lighter text-nci-red"
          }
        >
          {file.node.access}
        </Badge>
      ),
      name: (
        <Link href={`/files/${file.node.file_id}`}>
          <a className="text-nci-blue underline">{file.node.file_name}</a>
        </Link>
      ),
      cases: file.node.cases.hits.total,
      project: (
        <Link href={`/projects/${project}`}>
          <a className="text-nci-blue underline">{project}</a>
        </Link>
      ),
      data_category: file.node.data_category,
      data_format: file.node.data_format,
      file_size: formatFileSize(file.node.file_size),
      annotations: file.node.annotations.hits.total,
      data_type: file.node.data_type,
      experimental_strategy: file.node.experimental_strategy,
      platform: file.node.platform,
    };
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

  const handleColumnChange = (columns) => {
    setVisibleColumns(columns);
  };

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
  }, [visibleColumns]);

  return (
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
  );
};

export default FilesTable;
