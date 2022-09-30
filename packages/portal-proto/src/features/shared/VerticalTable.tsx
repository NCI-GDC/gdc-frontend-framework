import React, { useState, useEffect, FC } from "react";
import { useTable, useBlockLayout } from "react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";
import { BsList } from "react-icons/bs";
import { Box, Popover, Select, Pagination, Loader } from "@mantine/core";

interface VerticalTableProps {
  tableData: Record<string, any>[];
  columnListOrder: {
    id: string;
    columnName: string;
    visible: boolean;
  }[];
  columnCells: Column[];
  handleColumnChange: (columns: any) => void;
  selectableRow: boolean;
  tableTitle?: string;
  additionalControls?: React.ReactNode;
  showControls?: boolean;
  pagination?: {
    page: number;
    pages: number;
    size: number;
    handlePageSizeChange: (x: string) => void;
    handlePageChange: (x: number) => void;
  };
  status?: "uninitialized" | "pending" | "fulfilled" | "rejected";
}

interface Column {
  Header: string;
  accessor: string;
  width?: number;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

export const VerticalTable: FC<VerticalTableProps> = ({
  tableData,
  columnListOrder,
  columnCells,
  handleColumnChange,
  selectableRow,
  tableTitle,
  additionalControls,
  showControls = true,
  pagination,
  status = "fulfilled",
}: VerticalTableProps) => {
  const [table, setTable] = useState([]);
  const [columnListOptions, setColumnListOptions] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  useEffect(() => {
    setTable(tableData);
  }, [tableData]);

  useEffect(() => {
    setColumnListOptions(columnListOrder);
  }, [columnListOrder]);
  //TODO combine columnCells and columnListOrder and handle column rordering in this component
  useEffect(() => {
    setHeadings(columnCells);
  }, [columnCells]);

  const tableAction = (action) => {
    action.visibleColumns.push((columns) => [
      {
        id: "Checkbox",
        Header: "",
        Cell: () => <input type="checkbox" />,
        width: 30,
      },
      ...columns,
    ]);
  };

  const Table: FC<TableProps> = ({ columns, data }: TableProps) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable(
        {
          columns,
          data,
          /* TODO for looking into making the table cells variable width
        defaultColumn: {
          width: "auto",
        },*/
        },
        useBlockLayout,
        selectableRow ? tableAction : null,
      );

    return (
      <table
        {...getTableProps()}
        className="inline-block overflow-y-scroll w-full"
      >
        {tableTitle && (
          <caption className="font-semibold text-left">{tableTitle}</caption>
        )}
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              className="bg-primary-lighter"
              {...headerGroup.getHeaderGroupProps()}
              key={`header-${key}`}
            >
              {headerGroup.headers.map((column, key) => (
                <th
                  {...column.getHeaderProps()}
                  className=""
                  key={`column-${key}`}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="">
          {columnListOptions.length > 0 && status === "fulfilled" ? (
            rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  key={index}
                  {...row.getRowProps()}
                  className={
                    index % 2 === 1 ? "bg-base-lighter" : "bg-base-lightest"
                  }
                >
                  {row.cells.map((cell, key) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`row-${key}`}
                        className="rounded-sm p-1.5 text-sm text-content text-medium text-center"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : status === "rejected" ? (
            <tr>
              <td className="">Error in loading data</td>
            </tr>
          ) : (
            <tr>
              <td className="h-32 pl-[25vw] pt-10">
                <Loader color="primary" size={64} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  //For smoother setting of pagination so the values don't bounce around when loading new data
  const [pageSize, setPageSize] = useState(10);
  const [pageOn, setPageOn] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);

  useEffect(() => {
    if (pagination?.size) {
      setPageSize(pagination.size);
    }
    if (pagination?.page) {
      setPageOn(pagination.page);
    }
    if (pagination?.pages) {
      setPageTotal(pagination.pages);
    }
  }, [pagination]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    pagination.handlePageSizeChange(newPageSize);
  };
  const handlePageChange = (newPageNumber) => {
    setPageOn(newPageNumber);
    pagination.handlePageChange(newPageNumber);
  };

  return (
    <div className="grow overflow-hidden">
      <div className={`h-10 float-left`}>{additionalControls}</div>
      {showControls && (
        <div className="flex flex-row float-right">
          <Popover
            opened={showColumnMenu}
            onClose={() => setShowColumnMenu(false)}
            width={260}
            position="bottom"
            transition="scale"
            withArrow
          >
            <Popover.Target>
              <Box
                className={`mr-0 ml-auto border-1 border-base-lighter p-3`}
                onClick={() => setShowColumnMenu(!showColumnMenu)}
              >
                <BsList></BsList>
              </Box>
            </Popover.Target>
            <Popover.Dropdown>
              <div className={`w-fit`}>
                {columnListOptions.length > 0 && showColumnMenu && (
                  <div className={`mr-0 ml-auto`}>
                    <DndProvider backend={HTML5Backend}>
                      <DragDrop
                        listOptions={columnListOptions}
                        handleColumnChange={handleColumnChange}
                      />
                    </DndProvider>
                  </div>
                )}
              </div>
            </Popover.Dropdown>
          </Popover>
          <div className="flex flex-row w-max float-right">
            <input
              className="mr-2 rounded-sm border-1 border-base-lighter px-1"
              type="search"
              placeholder="Search"
            />
            <div className={`mt-px`}></div>
          </div>
        </div>
      )}
      <Table columns={headings} data={table} />
      {pagination && (
        <div className="flex flex-row items-center justify-start border-t border-base-light">
          <p className="px-2">Page Size:</p>
          <Select
            size="sm"
            radius="md"
            onChange={handlePageSizeChange}
            value={pageSize?.toString()}
            data={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "40", label: "40" },
              { value: "100", label: "100" },
            ]}
          />
          <Pagination
            size="sm"
            radius="md"
            color="accent"
            className="ml-auto"
            page={pageOn}
            onChange={handlePageChange}
            total={pageTotal}
          />
        </div>
      )}
    </div>
  );
};
