import { useState, useEffect } from "react";
import { PaginationOptions } from "@/features/shared/VerticalTable";

const useStandardPagination = (
  fullData: any[],
): PaginationOptions & { displayedData: any[] } => {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [displayedData, setDisplayedData] = useState([]);

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
    setActivePage(1);
  };

  const handlePageChange = (x: number) => {
    setActivePage(x);
  };

  useEffect(() => {
    setDisplayedData(
      fullData.slice((activePage - 1) * pageSize, activePage * pageSize),
    );
  }, [fullData, activePage, pageSize]);

  return {
    handlePageSizeChange,
    handlePageChange,
    page: activePage,
    pages: Math.ceil(fullData.length / pageSize),
    size: pageSize,
    from: (activePage - 1) * pageSize,
    total: fullData.length,
    displayedData,
  };
};

export default useStandardPagination;
