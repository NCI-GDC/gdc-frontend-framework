import { DataStatus } from "@gff/core";
import {
  ColumnDef,
  ColumnOrderState,
  ColumnSort,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { ReactNode, Dispatch, SetStateAction } from "react";

interface PaginationOptions {
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

export interface TableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  renderSubComponent?: ({ row }: { row: Row<TData> }) => React.ReactElement;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  isColumnCustomizable?: boolean;
  footer?: React.ReactNode;
  setRowSelection?: any;
  rowSelection?: any;
  enableRowSelection?: boolean;
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
   * caption to display at top of table
   */
  tableTitle?: ReactNode;
  /**
   * Optional default table sort state
   */
  initialSort?: ColumnSort[];
  /**
   * html block left of column sorting controls
   */
  additionalControls?: ReactNode;
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
    /**
     * default search term if any
     */
    defaultSearchTerm?: string;
  };
  /**
   * shows column sorting controls and search bar
   * @defaultValue false
   */
  showControls?: boolean;
  /**
   * optional callback to handle changes
   */
  handleChange?: (obj: HandleChangeInput) => void;
  /**
   * optional pagination controls at bottom of table
   */
  pagination?: PaginationOptions;
  /**
   * optional disable page size for pagination
   */
  disablePageSize?: boolean;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnOrder?: ColumnOrderState;
  setColumnOrder?: Dispatch<SetStateAction<ColumnOrderState>>;
  setSortedRow?;
  enableSorting?;
  onExpandedChange?
  expanded?
  ariaTextOverwrite?
}

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
  sortBy?: SortingState;
  /**
   * search term change
   */
  newSearch?: string;
  /**
   * headings change
   */
  newHeadings?: any;
}
