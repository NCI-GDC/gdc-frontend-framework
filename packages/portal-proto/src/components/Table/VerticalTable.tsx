import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableProps } from "./types";
import { Fragment, useEffect, useRef, useState } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { LoadingOverlay, Pagination, Select, TextInput } from "@mantine/core";
import { MdClose, MdSearch } from "react-icons/md";
import ColumnOrdering from "./ColumnOrdering";
import { DataStatus, usePrevious } from "@gff/core";
import { isEqual } from "lodash";
import { PaginationOptions } from "@/features/shared/VerticalTable";

function VerticalTable<TData>({
  columns,
  data,
  footer,
  getRowCanExpand,
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
  sorting,
  setSorting,
  setSortedRow,
  enableSorting = false,
  ariaTextOverwrite,
}: // onExpandedChange,
// expanded,
TableProps<TData>): JSX.Element {
  // DECIDE WHERE TO KEEP sorting, setsorting, AND ALSO OTHERS???

  // probably need to move it up to the parent

  const [showLoading, setShowLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search?.defaultSearchTerm ?? "");
  const [ariaText, setAriaText] = useState(
    ariaTextOverwrite ?? "Table Search Input",
  );

  useEffect(() => {
    setShowLoading(status === "pending" || status === "uninitialized");
  }, [status]);

  const table = useReactTable({
    columns,
    data,
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
      //  expanded: expanded,
    },
    // onExpandedChange: onExpandedChange,
    // sortDescFirst: false,
    autoResetExpanded: true,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getExpandedRowModel: getExpandedRowModel<TData>(),
    getCoreRowModel: getCoreRowModel<TData>(),
    getSortedRowModel: getSortedRowModel<TData>(),
    enableSorting: enableSorting,
  });

  const prevSortedRowModelRow = usePrevious(table.getSortedRowModel().rows);
  const sortedRowModel = table.getSortedRowModel().rows;
  useEffect(() => {
    if (!isEqual(prevSortedRowModelRow, sortedRowModel))
      setSortedRow && setSortedRow(table.getSortedRowModel().rows);
  }, [prevSortedRowModelRow, sortedRowModel, table, setSortedRow]);

  // Probably make this a separate component
  // For smoother setting of pagination so the values don't bounce around when loading new data
  const [pageSize, setPageSize] = useState(10);
  const [pageOn, setPageOn] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);

  const inputRef = useRef(null);

  useEffect(() => {
    if (search?.defaultSearchTerm) {
      inputRef?.current?.focus();
    }
  }, [search?.defaultSearchTerm]);

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
    handleChange &&
      handleChange({
        newPageSize: newPageSize,
      });
  };
  const handlePageChange = (newPageNumber) => {
    setPageOn(newPageNumber);
    handleChange &&
      handleChange({
        newPageNumber: newPageNumber,
      });
  };

  useEffect(() => {
    //prevents unneeded api calls if user is typing something
    if (handleChange) {
      const delayDebounceFn = setTimeout(() => {
        handleChange({
          newSearch: searchTerm.trim(),
        });
      }, 250);
      return () => clearTimeout(delayDebounceFn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
          <div className="flex items-center" data-testid="table-options-menu">
            <div className="flex mb-2 gap-2">
              {search?.enabled && (
                <TextInput
                  icon={<MdSearch size={24} />}
                  data-testid="textbox-table-search-bar"
                  placeholder={search.placeholder ?? "Search"}
                  aria-label={ariaText}
                  classNames={{
                    input:
                      "border-base-lighter focus:border-2 focus:drop-shadow-xl focus:border-primary",
                    wrapper: "w-72 h-8",
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
                    if (ariaText !== "Table Search Input")
                      setAriaText("Table Search Input");
                  }}
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
      <>
        <div className="overflow-y-auto w-full relative">
          <LoadingOverlay
            data-testid="loading-spinner-table"
            visible={showLoading}
            zIndex={0}
          />
          <table className="w-full text-left font-content shadow-xs text-sm">
            {tableTitle && (
              <caption className="font-semibold text-left">
                {tableTitle}
              </caption>
            )}
            <thead className="h-14">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="font-heading text-sm font-bold text-base-contrast-max whitespace-pre-line leading-5 shadow-md border-1 border-base-lighter border-b-4 h-full"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none px-2 py-3 font-heading bg-base-max"
                          : "px-2 py-3 font-heading bg-base-max"
                      } //need to combine this
                      onClick={() => {
                        // maybe pass in custom sorting logic for some tables if neccessary
                        // if custom logic is provided use it otherwise call below
                        header.column.getCanSort() &&
                          header.column.toggleSorting();
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* how to make sure that this is only seen for true
                      having to set it to false for others is tedious */}
                      {header.column.getCanSort() && (
                        <div className="inline-block text-xs pl-3 align-middle text-base-light">
                          <BsCaretUpFill
                            className={
                              header.column.getIsSorted() === "asc"
                                ? "text-primary"
                                : ""
                            }
                          />
                          <BsCaretDownFill
                            className={`${
                              header.column.getIsSorted() === "desc"
                                ? "text-primary"
                                : ""
                            } relative top-[-2px]`}
                          />
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="border-1 border-base-lighter">
              {table.getRowModel().rows.map((row, index) => (
                <Fragment key={row.id}>
                  <tr
                    className={`border border-base-lighter ${
                      index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-2 py-2.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      {/* 2nd row is a custom 1 cell row */}
                      <td colSpan={row.getVisibleCells().length}>
                        {/* Need to pass in the SubRow component to render here */}
                        {/* is there a way to pass in the column id??? */}
                        {renderSubComponent({ row })}
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
              pagination={pagination}
              status={status}
              data={data}
              pageSize={pageSize}
            />

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
}

function ShowingCount<TData>({
  pagination,
  status,
  data,
  pageSize,
}: {
  pagination: PaginationOptions;
  status: DataStatus;
  data: TData[];
  pageSize: number;
}) {
  let outputString: JSX.Element;
  if (!isNaN(pagination.from) && status === "fulfilled") {
    const paginationFrom =
      // maybe need tabledata using useeffect
      pagination.from >= 0 && data.length > 0 ? pagination.from + 1 : 0;

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
}

export default VerticalTable;
