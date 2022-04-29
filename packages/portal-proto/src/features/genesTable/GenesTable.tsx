import React, { useCallback, useEffect, useState } from "react";
import {
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  useGenesTable
} from "@gff/core";
import RingLoader from "react-spinners/RingLoader";
import { getCustomGridCell, getTableFormatData, tableFunc } from "./custom-config";
import VerticalTable from "../../components/VerticalTable";
import { Pagination, Select } from "@mantine/core";

interface GenesTableResponse {
  readonly data?: GDCGenesTable;
  readonly mutationsCount?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const GenesTable: React.FC<unknown> = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);

  const coreDispatch = useCoreDispatch();

  // using the useSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, error, isUninitialized, isFetching, isError } = useGenesTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchGenesTable({ pageSize: pageSize, offset: offset }));
  }, [pageSize, offset]);

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  }

  const handlePageChange = (x: number) => {
    setOffset((x - 1) * pageSize)
    setPage(x);
  }

  const generateTableContent = useCallback(() => {
    if (isUninitialized) {
      return (
        <div className="grid place-items-center">
          <div className="flex flex-row">
            <RingLoader color={"lightblue"} loading={true} size={100} />
          </div>
        </div>
      );
    }

    if (isFetching) {
      return (
        <div className="grid place-items-center">
          <div className="flex flex-row">
            <RingLoader color={"lightblue"} loading={true} size={100} />
          </div>
        </div>
      );
    }

    if (isError) {
      return <div>Failed to fetch table: {error}</div>;
    }

    return (<VerticalTable tableData={getTableFormatData(data)} tableFunc={tableFunc} customCellKeys={["annotations", "survival"]} customGridMapping={getCustomGridCell}></VerticalTable>)

  }, [data, error, isUninitialized, isFetching, isError, pageSize, offset]);

  return (
    <div className="flex flex-col w-100">
      <div className="flex-flex-row">{generateTableContent()}</div>
      <div className="flex flex-row items-center justify-start border-t border-nci-gray-light">
        <p className="px-2">Page Size:</p>
        <Select size="sm" radius="md"
          onChange={handlePageSizeChange}
          value={pageSize.toString()}
          data={[
            { value: '10', label: '10' },
            { value: '20', label: '20' },
            { value: '40', label: '40' },
            { value: '100', label: '100' },
          ]}
        />
        <Pagination
          classNames={{
            active: "bg-nci-gray"
          }}
          size="sm"
          radius="md"
          color="gray"
          className="ml-auto"
          page={activePage}
          onChange={(x) => handlePageChange(x)}
          total={pages} />
      </div>
    </div>
  );
};

export default GenesTable;
