import { VscTrash as TrashIcon } from "react-icons/vsc";
import { useCoreSelector, selectCart, useCartFilesTable } from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";

const FilesTable = () => {
  const cart = useCoreSelector((state) => selectCart(state));
  const { data: tableData } = useCartFilesTable({
    cart,
    size: 20,
    offset: 0,
    sort: [],
  });

  const mappedData = tableData.map((file) => ({
    remove: <TrashIcon />,
    uuid: file.node.file_id,
    access: file.node.access,
    name: file.node.file_name,
    cases: file.node.cases.hits.total,
    //project: file.node.
    data_category: file.node.data_category,
    data_format: file.node.data_format,
    file_size: file.node.file_size,
  }));

  return (
    <VerticalTable
      tableData={mappedData}
      columnListOrder={[
        "Remove",
        "File UUID",
        "Access",
        "File Name",
        "Cases",
        "Project",
        "Data Category",
        //"Data Format",
        //"File Size",
        //"Annotations",
        //"Data Type",
        //"Experimental Strategy",
        //"Platform",
      ]}
      columnCells={[
        { Header: "Remove", accessor: "remove", width: 80 },
        { Header: "File UUID", accessor: "uuid" },
        { Header: "Access", accessor: "access" },
        { Header: "File Name", accessor: "name", width: 300 },
        { Header: "Cases", accessor: "cases" },
        { Header: "Data Category", accessor: "data_category" },
        { Header: "Data Format", accessor: "data_format" },
        { Header: "File Size", accessor: "file_size" },
      ]}
      pageSize={"20"}
      selectableRow={false}
      handleColumnChange={() => {}}
      tableTitle={""}
    />
  );
};

export default FilesTable;
