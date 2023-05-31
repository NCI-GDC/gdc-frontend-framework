import { useState, useEffect } from "react";
import { PaginationOptions, Columns } from "@/features/shared/VerticalTable";
import { SortingRule } from "react-table";

/**
 * For use with the VerticalTable component or other paginated tables,
 * manages state for pages and for column sorting. Only for client-side pagination
 * @param fullData
 * @returns
 */
const useStandardPagination = (
  fullData: Record<string, any>[],
  columnListOrder: Columns[],
): PaginationOptions & {
  displayedData: Record<string, any>[];
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
  handleSortByChange: (x: SortingRule<any>[]) => void;
} => {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [activeSort, setActiveSort] = useState<SortingRule<any>[]>([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [columnSortingFns, setcolumnSortingFns] = useState({});

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
    setActivePage(1);
  };

  const handlePageChange = (x: number) => {
    setActivePage(x);
  };

  const handleSortByChange = (x: SortingRule<any>[]) => {
    setActiveSort(x);
  };

  useEffect(() => {
    // looks through columnListOrder for columns that have sortingFn and add them to an easily retrievable object
    setcolumnSortingFns(
      columnListOrder.reduce((output, column) => {
        if (column.sortingFn) {
          output[column.id] = column.sortingFn;
        }
        return output;
      }, {}),
    );
  }, [columnListOrder]);

  useEffect(() => {
    // if data changes set to first page
    setActivePage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullData]);

  useEffect(() => {
    const tempData = [...fullData];
    if (activeSort.length > 0) {
      // If multiple filters
      activeSort.forEach((obj) => {
        // check if special instructions
        if (columnSortingFns[obj.id]) {
          console.log("custom sort", obj.id);
          // sort by sortingFn
          tempData.sort(columnSortingFns[obj.id]);
          if (obj.desc) {
            tempData.reverse();
          }
          // check if object
        } else if (typeof tempData[0][obj.id] === "object") {
          // check if array
          if (Array.isArray(tempData[0][obj.id])) {
            //if array sort by length
            //TODO add this
          } else {
            // object needs sortingFn
            console.error(
              `cannot sort by ${obj.id} no sortingFn given`,
              tempData[0],
            );
          }
        } else {
          //TODO fix error when sorting numbers
          tempData.sort((a, b) => {
            // sort strings and numbers
            if (a[obj.id] < b[obj.id]) {
              return obj.desc ? -1 : 1;
            }
            if (a[obj.id] > b[obj.id]) {
              return obj.desc ? 1 : -1;
            }
            return 0;
          });
        }
      });
    }
    setDisplayedData(
      tempData.slice((activePage - 1) * pageSize, activePage * pageSize),
    );
  }, [fullData, activePage, pageSize, activeSort, columnSortingFns]);

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
  };
};

export default useStandardPagination;
