import { useState, useEffect } from "react";
import { PaginationOptions } from "@/features/shared/VerticalTable";
import { SortingState } from "@tanstack/react-table";

/**
 * For use with the VerticalTable component or other paginated tables,
 * manages state for pages and for column sorting. Only for client-side pagination
 * @param fullData
 * @returns
 */
function useStandardPagination<TData>(
  fullData: TData[],
  customSortingFns?: Record<string, any>,
): PaginationOptions & {
  displayedData: TData[];
  /**
   * callback to handle page size change
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

  useEffect(() => {
    const tempData = [...fullData];
    if (activeSort.length > 0) {
      // If multiple filters
      activeSort.forEach((obj) => {
        // check if special instructions
        if (customSortingFns[obj.id]) {
          // sort by sortingFn
          console.log("here: ", customSortingFns[obj.id], obj);
          tempData.sort(customSortingFns[obj.id]);
          if (obj.desc) {
            console.log("reversing");
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
                    return obj.desc ? -1 : 1;
                  }
                  if (a[obj.id].length > b[obj.id].length) {
                    return obj.desc ? 1 : -1;
                  }
                  //If same length sort by first item
                  try {
                    if (a[obj.id][0] > b[obj.id][0]) {
                      return obj.desc ? -1 : 1;
                    }
                    if (a[obj.id][0] < b[obj.id][0]) {
                      return obj.desc ? 1 : -1;
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
  }, [fullData, activePage, pageSize, customSortingFns, activeSort]);

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
