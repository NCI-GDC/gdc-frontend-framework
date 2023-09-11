import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { TableProps } from "./types";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { LoadingOverlay, Pagination, Select, TextInput } from "@mantine/core";
import { MdClose, MdSearch } from "react-icons/md";
import ColumnOrdering from "./ColumnOrdering";
import { DataStatus } from "@gff/core";
import { createKeyboardAccessibleFunction } from "@/utils/index";
import { v4 as uuidv4 } from "uuid";
import { useDeepCompareEffect } from "use-deep-compare";

function VerticalTable<TData>({
  columns,
  data = [],
  footer,
  getRowCanExpand,
  expandableColumnIds,
  setRowSelection,
  rowSelection,
  enableRowSelection = false,
  status,
  tableTitle,
  additionalControls,
  search,
  showControls = false,
  handleChange,
  pagination,
  disablePageSize = false,
  renderSubComponent,
  columnVisibility,
  setColumnVisibility,
  columnOrder,
  setColumnOrder,
  columnSorting = "none",
  sorting,
  setSorting,
  expanded,
  setExpanded,
  getRowId = (_originalRow: TData, _index: number, _parent?: Row<TData>) =>
    uuidv4(),
}: TableProps<TData>): JSX.Element {
  const [tableData, setTableData] = useState(data);
  const [searchTerm, setSearchTerm] = useState(search?.defaultSearchTerm ?? "");
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // TODO: status fufilled is to be sent for all the tables (even without api calls)
  // also need in pagination (do sth about it)
  useDeepCompareEffect(() => {
    if (status === "fulfilled") {
      setTableData(data);
    }
  }, [data, status]);

  useEffect(() => {
    if (search?.defaultSearchTerm) {
      inputRef?.current?.focus();
    }
  }, [search?.defaultSearchTerm]);

  const [clickedColumnId, setClickedColumnId] = useState<string>(null);
  const table = useReactTable({
    columns,
    data: tableData,
    getRowCanExpand,
    initialState: {
      columnVisibility,
      columnOrder,
    },
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnOrder,
      expanded,
    },
    manualSorting: columnSorting === "manual",
    sortDescFirst: false,
    autoResetExpanded: false,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getExpandedRowModel: getExpandedRowModel<TData>(),
    getCoreRowModel: getCoreRowModel<TData>(),
    getSortedRowModel: getSortedRowModel<TData>(),
    getRowId: getRowId,
    enableSorting: columnSorting === "manual" || columnSorting === "enable",
  });

  // TODO: Make this as a separate component leveraging pagination API of tanstack table
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

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    handleChange &&
      handleChange({
        newPageSize: newPageSize,
      });
  };
  const handlePageChange = (newPageNumber: number) => {
    setPageOn(newPageNumber);
    handleChange &&
      handleChange({
        newPageNumber: newPageNumber,
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Clear the previous timeout
    clearTimeout(timeoutRef.current);

    // Set a new timeout to perform the search after 400ms
    timeoutRef.current = setTimeout(() => {
      handleChange({ newSearch: newSearchTerm.trim() });
    }, 400);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    clearTimeout(timeoutRef.current);
    handleChange({ newSearch: "" });
  };

  return (
    <div className="grow overflow-hidden pt-1">
      <div
        className={`flex ${
          !additionalControls ? "justify-end" : "justify-between"
        }`}
      >
        {additionalControls && (
          <div className="flex-1">{additionalControls}</div>
        )}
        {(search?.enabled || showControls) && (
          <div className="flex items-center" data-testid="table-options-menu">
            <div className="flex mb-2 gap-2">
              {search?.enabled && (
                <TextInput
                  icon={<MdSearch size={24} />}
                  data-testid="textbox-table-search-bar"
                  placeholder={search.placeholder ?? "Search"}
                  aria-label="Table Search Input"
                  classNames={{
                    input:
                      "border-base-lighter focus:border-2 focus:drop-shadow-xl focus:border-primary",
                    wrapper: "w-72 h-8",
                  }}
                  size="sm"
                  rightSection={
                    searchTerm.length > 0 && (
                      <MdClose
                        onClick={handleClearClick}
                        className="cursor-pointer"
                      />
                    )
                  }
                  value={searchTerm}
                  onChange={handleInputChange}
                  ref={inputRef}
                />
              )}
              {showControls && (
                <ColumnOrdering
                  table={table}
                  handleColumnOrderingReset={() => {
                    table.resetColumnVisibility();
                    table.resetColumnOrder();
                  }}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full relative">
        <LoadingOverlay
          data-testid="loading-spinner-table"
          visible={status === "pending" || status === "uninitialized"}
          zIndex={0}
        />
        <table className="w-full text-left font-content shadow-xs text-sm">
          {tableTitle && (
            <caption className="font-semibold text-left">{tableTitle}</caption>
          )}
          <thead className="h-12">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="font-heading text-sm font-bold text-base-contrast-max whitespace-pre-line leading-5 shadow-md border-1 border-base-lighter border-b-4 h-full max-h-12"
              >
                {headerGroup.headers.map((header) => {
                  const isColumnSortable = header.column.getCanSort();
                  const isColumnSorted = header.column.getIsSorted();
                  const isColumnHighlighted =
                    header.column.columnDef.meta?.highlighted;
                  const commonHeaderClass = `px-2.5 py-3 font-heading ${
                    isColumnHighlighted
                      ? "bg-nci-purple-lightest"
                      : "bg-base-max"
                  }`;

                  if (columnSorting === "none" || !isColumnSortable) {
                    return (
                      <th
                        className={commonHeaderClass}
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={header.id}
                        className={`${commonHeaderClass} whitespace-nowrap ${
                          isColumnHighlighted
                            ? "hover:bg-nci-purple-lighter"
                            : "hover:bg-primary-lightest"
                        }`}
                        onClick={() => {
                          header.column.toggleSorting();
                        }}
                        onKeyDown={createKeyboardAccessibleFunction(() => {
                          header.column.toggleSorting();
                        })}
                        aria-sort={
                          isColumnSorted
                            ? isColumnSorted === "desc"
                              ? "descending"
                              : "ascending"
                            : undefined
                        }
                        colSpan={header.colSpan}
                      >
                        <button className="flex items-center font-heading">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {isColumnSortable && (
                            <div
                              className="inline-block text-xs pl-3 align-middle text-base-light"
                              aria-hidden="true"
                            >
                              <BsCaretUpFill
                                className={
                                  isColumnSorted === "desc"
                                    ? "text-primary"
                                    : ""
                                }
                              />
                              <BsCaretDownFill
                                className={`${
                                  isColumnSorted === "asc" ? "text-primary" : ""
                                } relative top-[-2px]`}
                              />
                            </div>
                          )}
                        </button>
                      </th>
                    );
                  }
                })}
              </tr>
            ))}
          </thead>
          <tbody className="border-1 border-base-lighter">
            {table.getRowModel().rows.map((row, index) => (
              <Fragment key={row.id}>
                <tr
                  className={`border border-base-lighter max-h-10 ${
                    index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnDefCell = cell.column.columnDef.cell; // Access the required data
                    const columnId = cell.column.columnDef.id;

                    return (
                      <td key={cell.id} className="px-2.5 py-2 cursor-default">
                        {row.getCanExpand() &&
                        expandableColumnIds.includes(columnId) ? (
                          <button
                            onClick={() => {
                              setClickedColumnId(columnId);
                              setExpanded(row, columnId);
                            }}
                            onKeyDown={createKeyboardAccessibleFunction(() => {
                              setClickedColumnId(columnId);
                              setExpanded(row, columnId);
                            })}
                            className="cursor-auto align-bottom"
                          >
                            {flexRender(columnDefCell, cell.getContext())}
                          </button>
                        ) : (
                          <>{flexRender(columnDefCell, cell.getContext())}</>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td colSpan={row.getVisibleCells().length}>
                      {/* Need to pass in the SubRow component to render here */}
                      {renderSubComponent({ row, clickedColumnId })}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
          {footer && (
            <tfoot className="font-heading text-sm text-base-contrast-max whitespace-pre-line leading-5 shadow-md border-1 border-base-lighter border-t-4 h-full">
              {footer}
            </tfoot>
          )}
        </table>
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

          <ShowingCount
            from={pagination?.from}
            label={pagination?.label}
            total={pagination?.total}
            dataLength={tableData?.length}
            status={status}
            pageSize={pageSize}
          />

          <Pagination
            data-testid="pagination"
            color="accent.5"
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
    </div>
  );
}

function ShowingCount({
  from,
  total,
  label,
  dataLength,
  status,
  pageSize,
}: {
  from: number;
  total: number;
  label: string;
  dataLength: number;
  status: DataStatus;
  pageSize: number;
}) {
  let outputString: JSX.Element;
  if (!isNaN(from) && status === "fulfilled") {
    const paginationFrom = from >= 0 && dataLength > 0 ? from + 1 : 0;

    const defaultPaginationTo = from + pageSize;

    const paginationTo =
      defaultPaginationTo < total ? defaultPaginationTo : total;

    const totalValue = total.toLocaleString();

    outputString = (
      <span>
        <b>{paginationFrom}</b> - <b>{paginationTo}</b> of <b>{totalValue}</b>
        {label && ` ${label}`}
      </span>
    );
  }

  return (
    <p data-testid="text-showing-count" className="text-heading text-sm">
      Showing {outputString ?? "--"}
    </p>
  );
}

export default VerticalTable;
