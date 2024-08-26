import { DataStatus } from "@gff/core";
import { Pagination, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import ShowingCount from "./ShowingCount";
import { HandleChangeInput, PaginationOptions } from "./types";

interface TablePaginationProps<TData> {
  pagination: PaginationOptions;
  disablePageSize: boolean;
  handleChange: (obj: HandleChangeInput) => void;
  tableData: TData[];
  status: DataStatus;
}

function TablePagination<TData>({
  pagination,
  disablePageSize,
  handleChange,
  tableData,
  status,
}: TablePaginationProps<TData>): JSX.Element {
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

  return (
    <div className="flex flex-col w-full px-4 lg:flex-nowrap font-heading items-center text-content bg-base-max border-base-lighter border-1 border-t-0 py-3 xl:flex-row xl:justify-between">
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
  );
}

export default TablePagination;
