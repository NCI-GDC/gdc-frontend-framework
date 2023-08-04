import React, { useState, useEffect, FC, Fragment, ReactNode } from "react";
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
  Select,
  Pagination,
  LoadingOverlay,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { ButtonTooltip } from "@/components/expandableTables/shared";

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
  /**
   * TODO implement, Custom sorting function for column data, currently used to define type for useStandardPagination function
   */
  sortingFn?: (rowA: any, rowB: any, columnId: string) => number;
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
   * ??? TODO remove
   */
  selectableRow: boolean;
  /**
   * caption to display at top of table
   */
  tableTitle?: ReactNode;
  /**
   * html block left of column sorting controls
   */
  additionalControls?: ReactNode;
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
   * optional disable page size for pagination
   */
  disablePageSize?: boolean;
  /**
   * optional pagination controls at bottom of table
   */
  pagination?: PaginationOptions;
  /**
   * optional callback to handle changes
   */
  handleChange?: (obj: HandleChangeInput) => void;
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
  footer?: React.ReactNode;
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
  sortBy?: SortingRule<any>[];
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
  disablePageSize = false,
  handleChange = (a) => {
    console.error("handleChange was not set and called with:", a);
  },
  search,
  initialSort = [],
  footer = undefined,
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
    if (tableData) {
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

    const thStyleColumnSorting = (column: any) =>
      `px-2 py-3 border-base-lighter font-heading text-base-contrast-max whitespace-nowrap ${
        column.highlighted ? "bg-nci-purple-lightest" : "bg-base-max"
      } ${
        column.canSort &&
        `${
          column.highlighted
            ? "hover:bg-nci-purple-lighter"
            : "hover:bg-primary-lightest"
        } focus:bg-primary-max focus:outline focus:outline-primary-lighter outline-offset-[-3px] outline-1`
      }`;

    return (
      <table
        {...getTableProps()}
        className="w-full text-left font-content shadow-xs text-sm"
      >
        {tableTitle && (
          <caption className="font-semibold text-left">{tableTitle}</caption>
        )}
        <thead className="h-14">
          {headerGroups.map((headerGroup, key) => (
            <tr
              className="font-heading text-sm font-bold text-base-contrast-max whitespace-pre-line leading-5 shadow-md border-1 border-base-lighter border-b-4 h-full"
              {...headerGroup.getHeaderGroupProps()}
              key={`hrow-${key}`}
            >
              {headerGroup.headers.map((column, key) => {
                return columnSorting === "none" ? (
                  <th
                    {...column.getHeaderProps()}
                    className={`px-2 py-3 font-heading ${
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
                    className={thStyleColumnSorting(column)}
                    key={`hcolumn-${key}`}
                    aria-sort={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "descending"
                          : "ascending"
                        : undefined
                    }
                    tabIndex={column.canSort === false ? -1 : 0}
                    onKeyDown={(event) => {
                      if (
                        column.canSort !== false &&
                        (event.key === "Enter" || event.key === " ")
                      )
                        column.toggleSortBy();
                    }}
                    role={column.canSort ? "button" : "columnheader"}
                  >
                    <div className="flex items-center">
                      <span>{column.render("Header")}</span>

                      {column.canSort && (
                        <div
                          key={`span-${key}`}
                          className="inline-block text-xs pl-3 align-middle text-base-light"
                        >
                          <BsCaretUpFill
                            className={
                              column.isSorted && !column.isSortedDesc
                                ? "text-primary"
                                : ""
                            }
                          />
                          <BsCaretDownFill
                            className={`${
                              column.isSorted && column.isSortedDesc
                                ? "text-primary"
                                : ""
                            } relative top-[-2px]`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="border-1 border-base-lighter"
        >
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
                    className={`border border-base-lighter ${
                      index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
                    }
                    `}
                    key={`row-${index}`}
                  >
                    {row.cells.map((cell, key) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={`column-${key}`}
                          className="px-2 py-2.5"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                  {(row.state.expanded as number) > 0 && (
                    <tr {...row.getRowProps()} key={`row-${index}-2`}>
                      <td colSpan={headings.length}>{row.state.content}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
        {footer && (
          <tfoot className="font-heading text-sm text-base-contrast-max whitespace-pre-line leading-5 shadow-md border-1 border-base-lighter border-t-4 h-full">
            {footer}
          </tfoot>
        )}
      </table>
    );
  };

  // For smoother setting of pagination so the values don't bounce around when loading new data
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
    let outputString: JSX.Element;
    if (!isNaN(pagination.from) && status === "fulfilled") {
      const paginationFrom =
        pagination.from >= 0 && tableData.length > 0 ? pagination.from + 1 : 0;

      const defaultPaginationTo = pagination.from + pageSize;

      const paginationTo =
        defaultPaginationTo < pagination.total
          ? defaultPaginationTo
          : pagination.total;

      const totalValue = pagination.total.toLocaleString();

      outputString = (
        <span>
          <b>{paginationFrom}</b> - <b>{paginationTo}</b> of <b>{totalValue}</b>
          {pagination.label && ` ${pagination.label}`}
        </span>
      );
    }

    return (
      <p data-testid="text-showing-count" className="text-heading text-sm">
        Showing {outputString ?? "--"}
      </p>
    );
  };

  useEffect(() => {
    //prevents unneeded api calls if user is typing something
    const delayDebounceFn = setTimeout(() => {
      handleChange({
        newSearch: searchTerm.trim(),
      });
    }, 250);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const theme = useMantineTheme();
  const ref = useClickOutside(() => setShowColumnMenu(false));

  return (
    <div className="grow overflow-hidden">
      <div
        className={`flex ${
          !additionalControls ? "justify-end" : "justify-between"
        }`}
      >
        {additionalControls && (
          <div className="flex-1">{additionalControls}</div>
        )}
        {(search?.enabled || showControls) && (
          <div className="flex items-center">
            <div className="flex mb-2 gap-2">
              {search?.enabled && (
                <TextInput
                  icon={<MdSearch size={24} color={theme.colors.primary[5]} />}
                  data-testid="textbox-table-search-bar"
                  placeholder={search.placeholder ?? "Search"}
                  aria-label="Table Search Input"
                  classNames={{
                    input:
                      "border-base-lighter focus:border-2 focus:drop-shadow-xl",
                    wrapper: "w-72",
                  }}
                  size="sm"
                  rightSection={
                    searchTerm.length > 0 && (
                      <MdClose
                        onClick={() => {
                          setSearchTerm("");
                        }}
                        className="cursor-pointer"
                      />
                    )
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              )}
              {showControls && (
                <div ref={ref}>
                  <ButtonTooltip
                    label={!showColumnMenu ? "Customize Columns" : ""}
                  >
                    <button
                      data-testid="button-column-selector-box"
                      aria-label="show table menu"
                      onClick={() => {
                        setShowColumnMenu(!showColumnMenu);
                      }}
                    >
                      <Box className="border border-primary p-2 rounded-md cursor-pointer text-primary hover:bg-primary hover:text-base-max">
                        {!showColumnMenu ? <BsList /> : <BsX size={17} />}
                      </Box>
                    </button>
                  </ButtonTooltip>
                  {showColumnMenu && (
                    <div
                      className="w-max absolute bg-base-max z-10 py-3 px-4 right-3 border-1 border-solid border-base-lighter rounded"
                      data-testid="column-selector-popover-modal"
                    >
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <>
        <div className="overflow-y-auto w-full relative">
          <LoadingOverlay
            data-testid="loading-spinner-table"
            visible={showLoading}
            zIndex={0}
          />
          <Table columns={headings} data={table} />
        </div>
        {pagination && (
          <div className="flex font-heading items-center text-content justify-between bg-base-max border-base-lighter border-1 border-t-0 py-3 px-4">
            {!disablePageSize && (
              <div className="flex flex-row items-center m-auto ml-0 text-sm">
                <span className="my-auto mx-1">Show</span>
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
                  aria-label="select page size"
                />
                <span className="my-auto mx-1">Entries</span>
              </div>
            )}

            <ShowingCount />

            <Pagination
              data-testid="pagination"
              color="accent"
              className="ml-auto"
              page={pageOn}
              onChange={handlePageChange}
              total={pageTotal}
              size="sm"
              radius="xs"
              withEdges
              classNames={{ item: "border-0" }}
              getItemAriaLabel={(page) => {
                switch (page) {
                  case "prev":
                    return "previous page button";
                  case "next":
                    return "next page button";
                  case "first":
                    return "first page button";
                  case "last":
                    return "last page button";
                  default:
                    return `${page} page button`;
                }
              }}
            />
          </div>
        )}
      </>
    </div>
  );
};
