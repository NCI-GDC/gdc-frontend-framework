import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  Header,
  SortDirection,
  useReactTable,
} from "@tanstack/react-table";
import { TableProps } from "./types";
import {
  Fragment,
  ReactNode,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { LoadingOverlay, Pagination, Select } from "@mantine/core";
import { DataStatus } from "@gff/core";
import { useDeepCompareEffect } from "use-deep-compare";
import { getDefaultRowId } from "./utils";
import TableHeader from "./TableHeader";

/**
 * VerticalTable is a table component that displays data in a vertical format.
 * @param columns - The columns to be displayed in the table.
 * @param data - The data to be displayed in the table.
 * @param footer - The footer to be displayed in the table.
 * @param getRowCanExpand - A function that returns a boolean value indicating whether a row can be expanded.
 * @param expandableColumnIds - The column ids that can be expanded.
 * @param setRowSelection - A function that sets the row selection.
 * @param rowSelection - The row selection.
 * @param enableRowSelection  - A boolean value indicating whether row selection is enabled.
 * @param status  - The status of the data.
 * @param tableTitle  - The title of the table.
 * @param additionalControls  - Additional controls to be displayed in the table.
 * @param search  - The search options for the table.
 * @param showControls  - A boolean value indicating whether the controls should be displayed.
 * @param handleChange  - A function that handles the change.
 * @param pagination  - The pagination options for the table.
 * @param disablePageSize - A boolean value indicating whether the page size should be disabled in the pagination.
 * @param renderSubComponent - A function that renders the subcomponent.
 * @param columnVisibility  - The column visibility.
 * @param setColumnVisibility - A function that sets the column visibility.
 * @param columnOrder - The column order.
 * @param setColumnOrder  - A function that sets the column order.
 * @param columnSorting - The column sorting, possible values:
          - "none" - No sorting is enabled.
          - "enable" - Sorting is enabled.
          - "manual" - Manual sorting is enabled.
 * @param sorting - The sorting.
 * @param setSorting  - A function that sets the sorting.
 * @param expanded  - The expanded.
 * @param setExpanded - A function that sets the expanded.
 * @param getRowId  - A function that returns the row id.
 * @param baseZIndex  - The base z index.
 * @param customDataTestID - optional locator for test automation
 * @category Table
 */
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
  getRowId = getDefaultRowId,
  baseZIndex = 0,
  customDataTestID,
  customAriaLabel,
}: TableProps<TData>): JSX.Element {
  const [tableData, setTableData] = useState(data);
  const liveRegionRef = useRef(null);
  const [sortingStatus, setSortingStatus] = useState("");
  const [announcementTimestamp, setAnnouncementTimestamp] = useState(
    Date.now(),
  );

  useEffect(() => {
    if (sortingStatus && announcementTimestamp) {
      liveRegionRef.current.textContent = sortingStatus;
    }
  }, [sortingStatus, announcementTimestamp]);

  // TODO: status fufilled is to be sent for all the tables (even without api calls)
  // also need in pagination (do sth about it)
  useDeepCompareEffect(() => {
    if (status === "fulfilled") {
      setTableData(data);
    }
  }, [data, status]);

  const initialState = useDeepCompareMemo(
    () => ({
      columnVisibility,
      columnOrder,
    }),
    [columnVisibility, columnOrder],
  );

  const state = useDeepCompareMemo(
    () => ({
      sorting,
      rowSelection,
      columnVisibility,
      columnOrder,
      expanded,
    }),
    [sorting, rowSelection, columnVisibility, columnOrder, expanded],
  );

  const expandedRowModel = useMemo(() => getExpandedRowModel<TData>(), []);
  const coreRowModel = useMemo(() => getCoreRowModel<TData>(), []);
  const sortedRowModel = useMemo(() => getSortedRowModel<TData>(), []);

  const [clickedColumnId, setClickedColumnId] = useState<string>(null);
  const table = useReactTable({
    columns,
    data: tableData,
    getRowCanExpand,
    initialState,
    state,
    manualSorting: columnSorting === "manual",
    sortDescFirst: false,
    autoResetExpanded: false,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getExpandedRowModel: expandedRowModel,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
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

  const handleSorting = (
    header: Header<TData, unknown>,
    headerName: ReactNode | JSX.Element,
    isColumnSorted: false | SortDirection,
  ) => {
    header.column.toggleSorting();
    if (isColumnSorted) {
      const sortingDirection =
        isColumnSorted === "desc"
          ? "Table not sorted"
          : `Table sorted by ${headerName} in descending order.`;
      setSortingStatus(sortingDirection);
    } else {
      setSortingStatus(`Table sorted by ${headerName} in ascending order.`);
    }
    // This is needed for when the sortingStatus between two columns stays the same.
    // If it's the same then the useEffect on line 69 will not fire. So, I added a new variable
    // announcementTimestamp so that it's announced everytime it's needed.
    setAnnouncementTimestamp(Date.now());
  };

  return (
    <div data-testid={customDataTestID} className="grow overflow-hidden">
      {(additionalControls ||
        tableTitle ||
        search?.enabled ||
        showControls) && (
        <TableHeader
          additionalControls={additionalControls}
          tableTitle={tableTitle}
          search={search}
          showControls={showControls}
          handleChange={handleChange}
          table={table}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          baseZIndex={baseZIndex}
        />
      )}
      <div className="overflow-y-auto w-full relative">
        <div
          key={announcementTimestamp}
          ref={liveRegionRef}
          className="sr-only"
          aria-live="polite"
        />
        <LoadingOverlay
          data-testid="loading-spinner-table"
          visible={status === "pending" || status === "uninitialized"}
          zIndex={0}
        />
        <table
          className="w-full text-left font-content shadow-xs text-sm"
          aria-label={customAriaLabel}
        >
          {/* Table header Section*/}
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
                  const headerName = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );

                  if (columnSorting === "none" || !isColumnSortable) {
                    return (
                      <th
                        className={commonHeaderClass}
                        key={header.id}
                        colSpan={header.colSpan}
                        scope={header.column.columnDef.meta?.scope || "col"}
                      >
                        {headerName}
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={header.id}
                        scope={header.column.columnDef.meta?.scope || "col"}
                        className={`
                        ${commonHeaderClass} whitespace-nowrap
                        ${
                          isColumnHighlighted
                            ? "hover:bg-nci-purple-lighter"
                            : "hover:bg-primary-lightest"
                        }
                      `}
                        aria-sort={
                          isColumnSorted
                            ? isColumnSorted === "desc"
                              ? "descending"
                              : "ascending"
                            : "none"
                        }
                        colSpan={header.colSpan}
                        role="columnheader"
                      >
                        <button
                          className="flex items-center font-heading"
                          onClick={() =>
                            handleSorting(header, headerName, isColumnSorted)
                          }
                        >
                          {headerName}
                          {isColumnSortable && (
                            <div
                              className="inline-block text-xs pl-3 align-middle text-base-light"
                              aria-hidden="true"
                            >
                              <BsCaretUpFill
                                className={
                                  isColumnSorted === "asc" ? "text-primary" : ""
                                }
                              />
                              <BsCaretDownFill
                                className={`${
                                  isColumnSorted === "desc"
                                    ? "text-primary"
                                    : ""
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
          {/* Table body Section */}
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <Fragment key={row.id}>
                <tr
                  className={`first:border-t-0 border border-base-lighter h-10 ${
                    index % 2 === 1 ? "bg-base-max" : "bg-base-lightest"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnDefCell = cell.column.columnDef.cell; // Access the required data
                    const columnId = cell.column.columnDef.id;
                    const cellValue = cell.getValue();

                    return (
                      <td key={cell.id} className="px-2.5 py-2 cursor-default">
                        {row.getCanExpand() &&
                        expandableColumnIds.includes(columnId) &&
                        // check to make sure item is expandable
                        (cellValue !== undefined
                          ? Array.isArray(cellValue) && cellValue.length > 1
                          : true) ? (
                          <button
                            onClick={() => {
                              setClickedColumnId(columnId);
                              setExpanded(row, columnId);
                            }}
                            className="cursor-auto align-bottom"
                            aria-expanded={row.getIsExpanded()}
                            aria-controls={`${row.id}_${columnId}_expanded`.replace(
                              /\W/g,
                              "_",
                            )}
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
                  <tr
                    id={`${row.id}_${clickedColumnId}_expanded`.replace(
                      /\W/g,
                      "_",
                    )}
                  >
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row, clickedColumnId })}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
          {/* Table footer Section */}
          {footer && (
            <tfoot className="font-heading text-sm text-base-contrast-max whitespace-pre-line leading-5 shadow-md border-1 border-base-lighter border-t-4 h-full">
              {footer}
            </tfoot>
          )}
        </table>
      </div>
      {/* Pagination Section */}
      {pagination && (
        <div className="flex flex-col w-full md:px-4 lg:flex-nowrap font-heading items-center text-content bg-base-max border-base-lighter border-1 border-t-0 py-3 xl:flex-row xl:justify-between">
          {!disablePageSize && (
            <div className="flex justify-between items-center w-full xl:w-fit">
              <div
                data-testid="area-show-number-of-entries"
                className="flex items-center m-auto ml-0 text-sm"
              >
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
                  data-testid="button-show-entries"
                  aria-label="select page size"
                />
                <span className="my-auto mx-1">Entries</span>
              </div>
              <div className="flex xl:hidden">
                <ShowingCount
                  from={pagination?.from}
                  label={pagination?.label}
                  total={pagination?.total}
                  dataLength={tableData?.length}
                  status={status}
                  pageSize={pageSize}
                  customDataTestID="xl-hidden-text-showing-count"
                />
              </div>
            </div>
          )}
          <div className="hidden xl:flex xl:items-center">
            <ShowingCount
              from={pagination?.from}
              label={pagination?.label}
              total={pagination?.total}
              dataLength={tableData?.length}
              status={status}
              pageSize={pageSize}
            />
          </div>
          <Pagination
            data-testid="pagination"
            color="accent.5"
            className="mt-4 gap-1 mx-auto xl:mx-0 xl:gap-2 xl:mr-0 xl:mt-0"
            value={pageOn}
            onChange={handlePageChange}
            total={pageTotal}
            radius="xs"
            size="sm"
            withEdges
            classNames={{ control: "border-0" }}
            getControlProps={(control) => {
              switch (control) {
                case "previous":
                  return { "aria-label": "previous page button" };
                case "next":
                  return { "aria-label": "next page button" };
                case "first":
                  return { "aria-label": "first page button" };
                case "last":
                  return { "aria-label": "last page button" };
                default:
                  return { "aria-label": `${control} page button` };
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
  customDataTestID = "text-showing-count",
}: {
  from: number;
  total: number;
  label: string;
  dataLength: number;
  status: DataStatus;
  pageSize: number;
  customDataTestID?: string;
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
    <p data-testid={customDataTestID} className="text-heading text-sm">
      Showing {outputString ?? "--"}
    </p>
  );
}

export default VerticalTable;
