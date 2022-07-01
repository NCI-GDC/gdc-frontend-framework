import { useEffect, useState } from "react";
import { filter } from "lodash";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { useCoreSelector, selectCart, useCartFilesTable } from "@gff/core";
import { formatFileSize } from "src/utils";
import { VerticalTable } from "@/features/shared/VerticalTable";

const columnCells = [
  { Header: "Remove", accessor: "remove", width: 80 },
  { Header: "File UUID", accessor: "uuid" },
  { Header: "Access", accessor: "access" },
  { Header: "File Name", accessor: "name", width: 300 },
  { Header: "Cases", accessor: "cases" },
  { Header: "Data Category", accessor: "data_category" },
  { Header: "Data Format", accessor: "data_format" },
  { Header: "File Size", accessor: "file_size" },
  { Header: "Annotations", accessor: "annotations" },
  { Header: "Data Type", accessor: "data_type" },
];

const FilesTable: React.FC = () => {
  const [visibleColumns, setVisibleColumns] = useState([
    { id: "remove", columnName: "Remove", visible: true },
    { id: "uuid", columnName: "File UUID", visible: false },
    { id: "access", columnName: "Access", visible: true },
    { id: "name", columnName: "File Name", visible: true },
    { id: "cases", columnName: "Cases", visible: true },
    { id: "data_category", columnName: "Data Category", visible: true },
    { id: "data_format", columnName: "Data Format", visible: true },
    { id: "file_size", columnName: "File Size", visible: true },
    { id: "annotations", columnName: "Annotations", visible: true },
    { id: "data_type", columnName: "Data Type", visible: false },
  ]);

  const cart = useCoreSelector((state) => selectCart(state));
  const { data } = useCartFilesTable({
    cart,
    size: 20,
    offset: 0,
    sort: [],
  });

  console.log(data);
  const tableData = data.map((file) => ({
    remove: <TrashIcon />,
    uuid: file.node.file_id,
    access: file.node.access,
    name: file.node.file_name,
    cases: file.node.cases.hits.total,
    //project: file.node.
    data_category: file.node.data_category,
    data_format: file.node.data_format,
    file_size: formatFileSize(file.node.file_size),
    annotations: file.node.annotations.hits.total,
    data_type: file.node.data_type,
  }));

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
