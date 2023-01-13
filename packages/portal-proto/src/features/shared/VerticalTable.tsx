import React, { useState, useEffect, FC, Fragment } from "react";
import { useTable, useRowState, useSortBy, SortingRule } from "react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";
import { BsList, BsCaretDownFill, BsCaretUpFill, BsX } from "react-icons/bs";
import { MdClose, MdSearch } from "react-icons/md";
import { isEqual } from "lodash";
import { DataStatus } from "@gff/core";
import {
  Box,
  Popover,
  Select,
  Pagination,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";

export interface PaginationOptions {
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
   * optional label of data shown
   */
  label?: string;
}

export interface Columns {
  /**
   * Id that matches tableData
   */
  id: string;
  /**
   * HTML that user will see at top of column
   */
  columnName: JSX.Element | string | ((value: any) => JSX.Element);
  /**
   * Flag to show / hide column
   */
  visible: boolean;
  /**
   * Flag to activate or disable sorting feature of column sorting
   * @defaultValue false
   */
  disableSortBy?: boolean;
  /**
   * Flag to activate or disable ability to rearrange column order
   * @defaultValue true
   */
  arrangeable?: boolean;
  /**
   * Allows a data cell to have a custom function attached to it that will be run on the data in that cell
   */
  Cell?: (value: any) => JSX.Element;
  /**
   * Allows creating nested table columns
   */
  columns?: Columns[];
  width?: number;
  highlighted?: boolean;
}

interface VerticalTableProps {
  /**
   * array of data to go in the table
   */
  tableData: Record<string, any>[];
  /**
   * list of columns in default order they appear and a number of properties
   */
  columns: Columns[];
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
   * Column sorting
   *
   * - `none` - no sorting
   *
   * - `enable` - sorts data in table
   *
   * - `manual` - uses handleChange callback to enable manual sorting
   *
   * @defaultValue 'none'
   */
  columnSorting?: "none" | "enable" | "manual";
  /**
   * shows column sorting controls and search bar
   * @defaultValue true
   */
  showControls?: boolean;
  /**
   * optional pagination controls at bottom of table
   */
  pagination?: PaginationOptions;
  /**
   * optional callback to handle changes
   */
  handleChange?: (HandleChangeInput) => void;
  /**
   * optional shows different table content depending on state
   *
   * - loading when `uninitialized` and `pending`
   *
   * - error message when `rejected`
   *
   * - data when `fulfilled`
   */
  status?: DataStatus;
  /**
   * optional search bar to display in top right of table
   */
  search?: {
    /**
     * show search bar
     */
    enabled: boolean;
    /**
     * placeholder to display in search input
     * @defaultValue "Search"
     */
    placeholder?: string;
  };
  /**
   * Optional default table sort state
   */
  initialSort?: Array<SortingRule<any>>;
}

/**
 * Callback to handle changes to table
 * @parm {number} newPageNumber - optional page on
 * @parm {string} newPageSize - optional size of data set shown
 * @parm  {id: string,  desc: boolean} sortBy - optional column sort
 * @parm {string} newSearch - optional search term change
 */
export interface HandleChangeInput {
  /**
   * page on
   */
  newPageNumber?: number;
  /**
   * size of data set shown
   */
  newPageSize?: string;
  /**
   * column sort
   */
  sortBy?: {
    id: string;
    desc: boolean;
  }[];
  /**
   * search term change
   */
  newSearch?: string;
  /**
   * headings change
   */
  newHeadings?: Columns[];
}

export interface Column {
  Header: string | JSX.Element | ((value: any) => JSX.Element);
  accessor: string;
  disableSortBy?: boolean;
  width?: number;
  Cell?: (value: any) => JSX.Element;
  columns?: Column[];
  highlighted?: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

const mapColumn = (obj: Columns): Column => {
  const colObj: Column = {
    Header: obj.columnName,
    accessor: obj.id,
    disableSortBy: obj.disableSortBy || false,
    highlighted: obj.highlighted || false,
  };

  if (obj.Cell) {
    colObj.Cell = obj.Cell;
  }
  if (obj.width) {
    colObj.width = obj.width;
  }
  return colObj;
};

export const filterColumnCells = (newList: Columns[]): Column[] => {
  return newList.reduce((filtered, obj) => {
    if (obj.visible) {
      const colObj = mapColumn(obj);

      if (obj.columns) {
        colObj.columns = obj.columns.map((col) => mapColumn(col));
      }
      filtered.push(colObj);
    }
    return filtered;
  }, []);
};

/**
 * Returns a vertical table with many optional features
 * @parm {array} tableData - data to go in the table
 * @parm {array} columns - list of columns in default order they appear and a number of properties
 * @parm {boolean} selectableRow - ???
 * @parm {string} tableTitle - caption to display at top of table
 * @parm {React.ReactNode} additionalControls - html block left of column sorting controls
 * @parm {string} columnSorting - allow sorting by column
 * @parm {boolean} showControls - shows column sorting controls defaults to true
 * @parm {object} pagination - optional pagination controls at bottom of table
 * @parm {string} status - optional shows loading state
 * @parm {object} search - optional, search options
 * @parm {object} initialSort - optional, initial sort state
 * @returns ReactElement
 */
export const VerticalTable: FC<VerticalTableProps> = ({
  tableData,
  columns,
  selectableRow,
  tableTitle,
  columnSorting = "none",
  additionalControls,
  showControls = true,
  pagination,
  status = "fulfilled",
  handleChange = (a) => {
    console.error("handleChange was not set and called with:", a);
  },
  search,
  initialSort = [],
}: VerticalTableProps) => {
  const [table, setTable] = useState([]);
  const [headings, setHeadings] = useState(filterColumnCells(columns));
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    setHeadings(filterColumnCells(columns));
  }, [columns]);

  useEffect(() => {
    if (status === "fulfilled") {
      setTable(tableData);
    }
    setShowLoading(status === "pending" || status === "uninitialized");
  }, [status, tableData]);

  const handleColumnChange = (update: Columns[]) => {
    handleChange({ newHeadings: update });
  };

  const tableAction = (action) => {
    action.visibleColumns.push((columns) => [
      {
        id: "Checkbox",
        Header: () => <input type="checkbox" />,
        Cell: () => <input type="checkbox" />,
        width: 30,
      },
      ...columns,
    ]);
  };

  // save sorting state
  const [colSort, setColSort] = useState(initialSort);
  const useTableConditionalProps = [];
  if (columnSorting !== "none") {
    useTableConditionalProps.push(useSortBy);
  }
  if (selectableRow) {
    useTableConditionalProps.push(tableAction);
  }
  const Table: FC<TableProps> = ({ columns, data }: TableProps) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state: { sortBy },
    } = useTable(
      {
        columns,
        data,
        initialRowStateAccessor: () => ({
          expanded: 0,
          values: {},
          content: {},
        }),
        manualSortBy: columnSorting === "manual",
        initialState: { sortBy: colSort },
      },
      useRowState,
      ...useTableConditionalProps,
    );

    // for manual sorting
    useEffect(() => {
      //check if properties have changed
      if (!isEqual(sortBy, colSort)) {
        setColSort(sortBy);
        if (columnSorting === "manual") {
          handleChange({
            sortBy: sortBy,
          });
        }
      }
    }, [sortBy]);
    //TODO have focus stay on selection, also only reload table data not headers
    return (
      <table
        {...getTableProps()}
        className="w-full text-left font-content border-1 shadow-xs"
      >
        {tableTitle && (
          <caption className="font-semibold text-left">{tableTitle}</caption>
        )}
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              className={`font-heading text-xs font-bold text-base-contrast-max py-4 whitespace-pre-line leading-5 shadow-md`}
              {...headerGroup.getHeaderGroupProps()}
              key={`hrow-${key}`}
            >
              {headerGroup.headers.map((column, key) => {
                return columnSorting === "none" ? (
                  <th
                    {...column.getHeaderProps()}
                    className={`px-2 pt-3 pb-1 font-heading  ${
                      column.highlighted
                        ? "bg-nci-purple-lightest"
                        : "bg-base-max"
                    }`}
                    key={`hcolumn-${key}`}
                  >
                    {column.render("Header")}
                  </th>
                ) : (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`px-2 pt-3 pb-1 font-heading text-xs font-bold ${
                      column.highlighted
                        ? "bg-nci-purple-lightest"
                        : "bg-base-max"
                    } text-base-contrast-max whitespace-nowrap ${
                      column.canSort &&
                      `${
                        column.highlighted
                          ? "hover:bg-nci-purple-lighter"
                          : "hover:bg-primary-lightest"
                      } focus:bg-primary-max focus:outline focus:outline-primary-lighter outline-offset-[-3px] outline-1 pb-0.5`
                    }`}
                    key={`hcolumn-${key}`}
                    aria-sort={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                    tabIndex={column.canSort === false ? -1 : 0}
                    onKeyPress={(event) => {
                      if (
                        column.canSort !== false &&
                        (event.key === "Enter" || event.key === " ")
                      )
                        column.toggleSortBy();
                    }}
                    role={column.canSort ? "button" : "columnheader"}
                  >
                    {column.render("Header")}
                    {column.canSort && (
                      <div
                        key={`span-${key}`}
                        className="inline-block text-xs pl-3 align-middle text-base-light"
                      >
                        <BsCaretUpFill
                          className={
                            column.isSorted && !column.isSortedDesc
                              ? "text-primary-darker"
                              : ""
                          }
                        />
                        <BsCaretDownFill
                          className={`${
                            column.isSorted && column.isSortedDesc
                              ? "text-primary-darker"
                              : ""
                          } relative top-[-2px]`}
                        />
                      </div>
                    )}
                  </th>
                );
              })}
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
                <Fragment key={`row-${index}`}>
                  <tr
                    {...row.getRowProps()}
                    className={
                      index % 2 === 1
                        ? "bg-base-max border-1"
                        : "bg-slate-50 border-1"
                    }
                  >
                    {row.cells.map((cell, key) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={`column-${key}`}
                          className="px-2 py-1 text-xs text-content"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                  {row.state.expanded > 0 && (
                    <tr {...row.getRowProps()} key={`row-${index}-2`}>
                      <td colSpan={headings.length}>{row.state.content}</td>
                    </tr>
                  )}
                </Fragment>
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
    if (pagination?.size !== undefined) {
      setPageSize(pagination.size);
    }
    if (pagination?.page !== undefined) {
      setPageOn(pagination.page);
    }
    if (pagination?.pages !== undefined) {
      setPageTotal(pagination.pages);
    }
  }, [pagination]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    handleChange({
      newPageSize: newPageSize,
    });
  };
  const handlePageChange = (newPageNumber) => {
    setPageOn(newPageNumber);
    handleChange({
      newPageNumber: newPageNumber,
    });
  };

  const ShowingCount: FC = () => {
    let outputString = " --";
    if (!isNaN(pagination.from) && status === "fulfilled") {
      outputString = ` ${
        pagination.from >= 0 && tableData.length > 0 ? pagination.from + 1 : 0
      } - `;

      const paginationTo = pagination.from + pageSize;
      if (paginationTo < pagination.total) {
        outputString += paginationTo;
      } else {
        outputString += pagination.total;
      }
      outputString += ` of ${pagination.total.toLocaleString()}`;

      if (pagination.label) {
        outputString += ` ${pagination.label}`;
      }
    }

    return (
      <p className={"text-heading text-medium text-sm"}>
        Showing {outputString}
      </p>
    );
  };

  useEffect(() => {
    setShowLoading(true);
    //prevents unneeded api calls if user is typing something
    const delayDebounceFn = setTimeout(() => {
      handleChange({
        newSearch: searchTerm,
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="grow overflow-hidden">
      <div className="flex">
        {additionalControls && (
          <div className={"flex-auto h-10"}>{additionalControls}</div>
        )}
        <div className="flex flex-row items-center">
          {search?.enabled && (
            <div className="flex flex-row w-max">
              <TextInput
                icon={<MdSearch size={24} />}
                placeholder={search.placeholder ?? "Search"}
                aria-label="Table Search Input"
                classNames={{
                  input: "focus:border-2 cus:drop-shadow-xl",
                  wrapper: "w-72 mr-1",
                }}
                size="sm"
                rightSection={
                  searchTerm.length > 0 && (
                    <MdClose
                      onClick={() => {
                        setSearchTerm("");
                        handleChange({
                          newSearch: "",
                        });
                      }}
                      className="cursor-pointer"
                    ></MdClose>
                  )
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleChange({
                    newSearch: e.target.value,
                  });
                }}
              />
            </div>
          )}
          {showControls && (
            <Popover
              opened={showColumnMenu}
              onClose={() => setShowColumnMenu(false)}
              position="bottom"
              transition="scale"
              withArrow
            >
              <Popover.Target>
                <button
                  onClick={() => {
                    setShowColumnMenu(!showColumnMenu);
                  }}
                >
                  <Box
                    className={`border-1 border-base p-2 rounded-md mx-1 hover:cursor-pointer`}
                  >
                    {!showColumnMenu ? <BsList /> : <BsX size={"17px"} />}
                  </Box>
                </button>
              </Popover.Target>
              <Popover.Dropdown>
                <div className={`w-fit`}>
                  {columns.length > 0 && showColumnMenu && (
                    <div className="mr-0 ml-2">
                      <DndProvider backend={HTML5Backend}>
                        <DragDrop
                          listOptions={columns} // here....
                          handleColumnChange={handleColumnChange}
                          columnSearchTerm={""}
                        />
                      </DndProvider>
                    </div>
                  )}
                </div>
              </Popover.Dropdown>
            </Popover>
          )}
        </div>
      </div>
      <div className="overflow-y-auto w-full relative">
        <LoadingOverlay visible={showLoading} />
        <Table columns={headings} data={table} />
      </div>
      {pagination && (
        <div className="flex flex-row items-center text-content justify-start border-base-light pt-2 mx-4">
          <div className="flex flex-row items-center m-auto ml-0">
            <span className="my-auto mx-1 text-xs">Show</span>
            <Select
              size="xs"
              radius="md"
              onChange={handlePageSizeChange}
              value={pageSize?.toString()}
              data={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "40", label: "40" },
                { value: "100", label: "100" },
              ]}
              classNames={{
                root: "w-16 font-heading",
              }}
            />
            <span className="my-auto mx-1 text-xs">Entries</span>
          </div>
          <div className="m-auto">
            <ShowingCount />
          </div>
          <Pagination
            color="accent"
            className="ml-auto"
            page={pageOn}
            onChange={handlePageChange}
            total={pageTotal}
            size="sm"
            radius="xs"
            withEdges
          />
        </div>
      )}
    </div>
  );
};
