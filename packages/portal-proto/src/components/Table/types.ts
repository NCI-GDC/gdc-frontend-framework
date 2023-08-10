import { DataStatus } from "@gff/core";
import {
  ColumnDef,
  ColumnOrderState,
  ColumnSort,
  ExpandedState,
  Row,
  RowSelectionState,
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
    clickedColumnIndex,
  }: {
    row: Row<TData>;
    clickedColumnIndex: number;
  }) => React.ReactElement;
  /**
   * Optional
   * If provided, allows you to override the default behavior of determining whether a row can be expanded.
   * Default to make all rows expandable: getRowCanExpand={() => true}
   */
  getRowCanExpand?: (row: Row<TData>) => boolean;
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
  setExpanded?: Dispatch<SetStateAction<ExpandedState>>;
  /*
   * Optional
   * Overwrite aria-label for Search Text Input
   */
  ariaTextOverwrite?: string;
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
