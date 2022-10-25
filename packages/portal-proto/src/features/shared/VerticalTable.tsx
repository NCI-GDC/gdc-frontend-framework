import React, { useState, useEffect, FC } from "react";
import { useTable } from "react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";
import { BsList } from "react-icons/bs";
import {
  Box,
  Popover,
  Select,
  Pagination,
  LoadingOverlay,
} from "@mantine/core";

interface VerticalTableProps {
  /**
   * array of data to go in the table
   */
  tableData: Record<string, any>[];
  /**
   * list of columns in order they appear and if they are visible or not
   */
  columnListOrder: {
    id: string;
    columnName: string;
    visible: boolean;
  }[];
  /**
   * sorted list of columns to display
   */
  columnCells: Column[];
  /**
   * callback for when user changes column order or visibility
   */
  handleColumnChange: (columns: any) => void;
  /**
   * ???
   */
  selectableRow: boolean;
  /**
   * caption to display at top of table
   */
  tableTitle?: string;
  /**
   * html block left of column sorting controls
   */
  additionalControls?: React.ReactNode;
  /**
   * shows column sorting controls and search bar
   * @defaultValue true
   */
  showControls?: boolean;
  /**
   * optional pagination controls at bottom of table
   */
  pagination?: {
    /**
     * page on
     */
    page: number;
    /**
     * total pages
     */
    pages: number;
    /**
     * size of data set shown
     */
    size: number;
    /**
     * 0 indexed starting point of data shown
     */
    from: number;
    /**
     * total size of data set
     */
    total: number;
    /**
     * optional lable of data shown
     */
    label?: string;
    /**
     * callback to handle page size change
     */
    handlePageSizeChange: (x: string) => void;
    /**
     * callback to handle page change
     */
    handlePageChange: (x: number) => void;
  };
  /**
   * optional shows diferent table content depending on state
   *
   * - loading when `uninitialized` and `pending`
   *
   * - error message when `rejected`
   *
   * - data when `fulfilled`
   */
  status?: "uninitialized" | "pending" | "fulfilled" | "rejected";
}

interface Column {
  Header: string | JSX.Element;
  accessor: string;
  width?: number;
  Cell?: (tableInfo: any) => JSX.Element;
}

interface TableProps {
  columns: Column[];
  data: any[];
}
/**
 * Returns a vertical table with many optional features
 * @parm {array} tableData - data to go in the table
 *
 * //TODO combine next 3
 * @parm {array} columnListOrder - list of columns in order they appear and if they are visible or not
 * @parm {array} columnCells - sorted list of columns to display
 * @parm {function} handleColumnChange - callback for when user changes column order or visibility
 * @parm {boolean} selectableRow - ???
 * @parm {string} tableTitle - caption to display at top of table
 * @parm {React.ReactNode} additionalControls - html block left of column sorting controls
 * @parm {boolean} showControls - shows column sorting controls and search bar defaults to true
 * @parm {object} pagination - optional pagination controls at bottom of table
 * @parm {string} status - optional shows loading state
 * @returns ReactElement
 */
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
    if (status === "fulfilled") {
      setTable(tableData);
    }
  }, [status, tableData]);

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
        },
        selectableRow ? tableAction : null,
      );

    return (
      <table {...getTableProps()} className="w-full text-left">
        {tableTitle && (
          <caption className="font-semibold text-left">{tableTitle}</caption>
        )}
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              className="bg-primary-lighter leading-5"
              {...headerGroup.getHeaderGroupProps()}
              key={`header-${key}`}
            >
              {headerGroup.headers.map((column, key) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-2 py-1"
                  key={`column-${key}`}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="">
          {status === "rejected" ? (
            <tr>
              <td className="" colSpan={columns.length}>
                Error in loading data
              </td>
            </tr>
          ) : (
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
                        className="px-2 py-1 text-sm text-content"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
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
  const ShowingCount: FC = () => {
    let outputString = " --";
    if (!isNaN(pagination.from) && status === "fulfilled") {
      outputString = ` ${pagination.from + 1} - `;

      const pagnationTo = pagination.from + pageSize;
      if (pagnationTo < pagination.total) {
        outputString += pagnationTo;
      } else {
        outputString += pagination.total;
      }
      outputString += ` of ${pagination.total}`;

      if (pagination.label) {
        outputString += ` ${pagination.label}`;
      }
    }

    return <>Showing {outputString}</>;
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
                        columnSearchTerm={""}
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
      <div className="overflow-y-scroll w-full relative">
        <LoadingOverlay
          visible={status === "pending" || status === "uninitialized"}
        />
        <Table columns={headings} data={table} />
      </div>
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
          <div className="m-auto">
            <ShowingCount />
          </div>
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
