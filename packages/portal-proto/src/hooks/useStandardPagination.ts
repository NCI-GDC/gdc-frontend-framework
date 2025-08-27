import { useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { PaginationOptions } from "@/components/Table/types";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";

/**
 * For use with the VerticalTable component or other paginated tables,
 * manages state for pages and for column sorting. Only for client-side pagination
 */
function useStandardPagination<TData>(
  fullData: TData[],
  columns?: ColumnDef<TData, any>[],
): Omit<PaginationOptions, "label"> & {
  displayedData: TData[];
  /**
   * full data that is sorted or filtered without the slice
   */
  updatedFullData?: TData[];
  /**
   * callback to handle page size change
   */
  handlePageSizeChange: (x: string) => void;
  /**
   * callback to handle page change
   */
  handlePageChange: (x: number) => void;
  /**
   * callback to handle column sorting
   */
  handleSortByChange: (x: SortingState) => void;
} {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [activeSort, setActiveSort] = useState<SortingState>([]);

  const handlePageSizeChange = useCallback((pageSize: string) => {
    setPageSize(parseInt(pageSize));
    setActivePage(1);
  }, []);

  const handlePageChange = useCallback((pageNum: number) => {
    setActivePage(pageNum);
  }, []);

  const handleSortByChange = useCallback((sortBy: SortingState) => {
    setActiveSort(sortBy);
  }, []);

  const recursivelyExtractSortingFns = useCallback(
    (columns: ColumnDef<TData, any>[]) => {
      return columns.reduce((output, column) => {
        if (column.meta?.sortingFn) {
          output[column.id] = column.meta.sortingFn;
        }
        if ("columns" in column) {
          const nestedFns = recursivelyExtractSortingFns(column.columns);
          Object.assign(output, nestedFns);
        }
        return output;
      }, {} as Record<string, (a: TData, b: TData) => number>);
    },
    [],
  );

  const columnSortingFns = useDeepCompareMemo(
    () => (columns ? recursivelyExtractSortingFns(columns) : {}),
    [columns, recursivelyExtractSortingFns],
  );

  const sortData = useDeepCompareCallback(
    (data: TData[], sortState: SortingState) => {
      if (sortState.length === 0) return data;

      return [...data].sort((a, b) => {
        for (const sort of sortState) {
          const { id, desc } = sort;
          const customSortFn = columnSortingFns[id];

          if (customSortFn) {
            const result = customSortFn(a, b);
            if (result !== 0) return desc ? -result : result;
          } else {
            const valueA = a[id as keyof TData];
            const valueB = b[id as keyof TData];

            if (typeof valueA === "number" && typeof valueB === "number") {
              if (valueA !== valueB)
                return desc ? valueB - valueA : valueA - valueB;
            } else if (
              typeof valueA === "string" &&
              typeof valueB === "string"
            ) {
              const comparison = valueA.localeCompare(valueB);
              if (comparison !== 0) return desc ? -comparison : comparison;
            } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
              const lenDiff = valueA.length - valueB.length;
              if (lenDiff !== 0) return desc ? -lenDiff : lenDiff;
              // If lengths are equal, compare first elements
              if (valueA[0] < valueB[0]) return desc ? 1 : -1;
              if (valueA[0] > valueB[0]) return desc ? -1 : 1;
            } else {
              console.warn(`Unable to sort by ${id}. Unsupported data type.`);
            }
          }
        }
        return 0;
      });
    },
    [columnSortingFns],
  );

  const { updatedFullData, displayedData } = useDeepCompareMemo(() => {
    const sortedData = sortData(fullData, activeSort);
    return {
      updatedFullData: sortedData,
      displayedData: sortedData.slice(
        (activePage - 1) * pageSize,
        activePage * pageSize,
      ),
    };
  }, [fullData, activePage, pageSize, activeSort, sortData]);

  return {
    handlePageSizeChange,
    handlePageChange,
    handleSortByChange,
    page: activePage,
    pages: Math.ceil(fullData.length / pageSize),
    size: pageSize,
    from: (activePage - 1) * pageSize,
    total: fullData.length,
    displayedData,
    updatedFullData,
  };
}

export default useStandardPagination;
