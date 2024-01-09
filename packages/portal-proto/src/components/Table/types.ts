import { DataStatus } from "@gff/core";
import {
  ColumnDef,
  ColumnOrderState,
  ExpandedState,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { ReactNode, Dispatch, SetStateAction } from "react";
import "@tanstack/react-table";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    highlighted?: boolean;
    sortingFn?: (rowA: TData, rowB: TData) => 1 | -1 | 0;
    scope?: "col" | "colgroup";
  }
}

/**
 *  Pagination options
 *  @property page - page on
 *  @property pages - total pages
 *  @property size - size of data set shown
 *  @property from - 0 indexed starting point of data shown
 *  @property total - total size of data set
 *  @property label - optional label of data shown
 *  @property disablePageSize - optional disable page size for pagination
 *  @category Table
 */

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

/**
 * Table props used to generate a table
 * @property data - array of data to go in the table
 * @property columns - list of columns in default order they appear and a number of properties
 * @property renderSubComponent - optional component to generate expanded row element
 * @property getRowCanExpand - optional if provided, allows you to override the default behavior of determining whether a row can be expanded. Default to make all rows expandable: getRowCanExpand=\{() =\> true\}
 * @property expandableColumnIds - optional ids of column that can make row expand
 * @property footer - optional table footer element
 * @property setRowSelection - optional handle for onRowSelectionChange
 * @property rowSelection - optional state for rowSelection
 * @property enableRowSelection - optional boolean to enable row selection
 * @property status - optional shows different table content depending on state
 * @property tableTitle - caption to display at top of table
 * @property additionalControls - html block left of column sorting controls
 * @property search - optional search bar to display in top right of table
 * @property columnSorting - column sorting
 * @property showControls - shows column sorting controls and search bar
 * @property handleChange - optional callback to handle changes
 * @property pagination - optional pagination controls at bottom of table
 * @property disablePageSize - optional disable page size for pagination
 * @property columnVisibility - optional state variable to denote visible columns
 * @property setColumnVisibility - optional handle for onColumnVisibilityChange
 * @property columnOrder - optional state variable to denote column order
 * @property setColumnOrder - optional handle for onColumnOrderChange
 * @property sorting - optional state variable to denote sorting
 * @property setSorting - optional handle for onSortingChange
 * @property expanded - optional state variable to denote expand state of a row
 * @property setExpanded - optional handle for onExpandedChange
 * @property getRowId - optional function is used to derive a unique ID for any given row
 * @property baseZIndex - optional used to properly set z-index of table elements (e.g. tooltips)
 * @category Table
 */

export interface TableProps<TData> {
  /**
   * array of data to go in the table
   */
  data: TData[];
  /**
   * list of columns in default order they appear and a number of properties
   */
  columns: ColumnDef<TData, any>[];
  /**
   * Optional
   * Component to generate expanded row element
   */
  renderSubComponent?: ({
    row,
    clickedColumnId,
  }: {
    row: Row<TData>;
    clickedColumnId: string;
  }) => React.ReactElement;
  /**
   * Optional
   * If provided, allows you to override the default behavior of determining whether a row can be expanded.
   * Default to make all rows expandable: getRowCanExpand=\{() =\> true\}
   */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /*
   * Optional ids of column that can make row expand
   */
  expandableColumnIds?: string[];
  /*
   * Option table footer element
   */
  footer?: React.ReactNode;
  /*
   * Optional handle for onRowSelectionChange
   */
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  /*
   * Optional state for rowSelection
   */
  rowSelection?: RowSelectionState;
  /*
   * Optional boolean to enable row selection
   */
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
    /**
     * optional tooltip to display under search bar
     */
    tooltip?: string;
  };
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
  /*
   * Optional state variable to denote visible columns
   */
  columnVisibility?: VisibilityState;
  /*
   * Optional handle for onColumnVisibilityChange
   */
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>;
  /*
   * Optional state variable to denote column order
   */
  columnOrder?: ColumnOrderState;
  /*
   * Optional handle for onColumnOrderChange
   */
  setColumnOrder?: Dispatch<SetStateAction<ColumnOrderState>>;
  /*
   * Optional state variable to denote sorting
   */
  sorting?: SortingState;
  /*
   * Optional handle for onSortingChange
   */
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  /*
   * Optional state variable to denote expand state of a row
   */
  expanded?: ExpandedState;
  /*
   * Optional handle for onExpandedChange
   */
  setExpanded?: (row: Row<TData>, columnId: string) => void;
  /**
   * optional function is used to derive a unique ID for any given row
   */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  /**
   * optional used to properly set z-index of table elements (e.g. tooltips)
   */
  baseZIndex?: number;
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
