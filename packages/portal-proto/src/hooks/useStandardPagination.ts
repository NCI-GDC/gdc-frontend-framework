import { useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { PaginationOptions } from "@/components/Table/types";
import { useDeepCompareEffect } from "use-deep-compare";

/**
 * For use with the VerticalTable component or other paginated tables,
 * manages state for pages and for column sorting. Only for client-side pagination
 */
function useStandardPagination<TData>(
  fullData: TData[],
  columns?: ColumnDef<TData, any>[],
): PaginationOptions & {
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
  const [displayedData, setDisplayedData] = useState([]);
  const [updatedFullData, setUpdatedFullData] = useState([]);
  const [activeSort, setActiveSort] = useState<SortingState>([]);
  const [columnSortingFns, setColumnSortingFns] = useState({});

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
    setActivePage(1);
  };

  const handlePageChange = (x: number) => {
    setActivePage(x);
  };

  const handleSortByChange = (x: SortingState) => {
    setActiveSort(x);
  };

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
      }, {});
    },
    [],
  );

  useDeepCompareEffect(() => {
    if (!columns) {
      return;
    }

    const sortingFns = recursivelyExtractSortingFns(columns);
    setColumnSortingFns(sortingFns);
  }, [columns, recursivelyExtractSortingFns]);

  useDeepCompareEffect(() => {
    const tempData = [...fullData];
    if (activeSort.length > 0) {
      // If multiple filters
      activeSort.forEach((obj) => {
        // check if special instructions
        if (columnSortingFns[obj.id]) {
          // sort by sortingFn
          tempData.sort(columnSortingFns[obj.id]);
          if (obj.desc) {
            tempData.reverse();
          }
        } else {
          switch (typeof tempData[0]?.[obj.id]) {
            case "number":
            case "string":
              tempData.sort((a, b) => {
                // sort strings and numbers
                if (a[obj.id] < b[obj.id]) {
                  return obj.desc ? 1 : -1;
                }
                if (a[obj.id] > b[obj.id]) {
                  return obj.desc ? -1 : 1;
                }
                return 0;
              });
              break;
            case "object":
              // check if array
              if (Array.isArray(tempData[0][obj.id])) {
                //if array sort by length
                tempData.sort((a, b) => {
                  if (a[obj.id].length < b[obj.id].length) {
                    return obj.desc ? 1 : -1;
                  }
                  if (a[obj.id].length > b[obj.id].length) {
                    return obj.desc ? -1 : 1;
                  }
                  //If same length sort by first item
                  try {
                    if (a[obj.id][0] < b[obj.id][0]) {
                      return obj.desc ? 1 : -1;
                    }
                    if (a[obj.id][0] > b[obj.id][0]) {
                      return obj.desc ? -1 : 1;
                    }
                  } catch {
                    return 0;
                  }
                  return 0;
                });
                break;
              }
            // fallsthrough non array object needs sortingFn
            default:
              console.error(`cannot sort by ${obj.id} no sortingFn given`);
          }
        }
      });
    }
    setUpdatedFullData(tempData);
    setDisplayedData(
      tempData.slice((activePage - 1) * pageSize, activePage * pageSize),
    );
  }, [fullData, activePage, pageSize, columnSortingFns, activeSort]);

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
