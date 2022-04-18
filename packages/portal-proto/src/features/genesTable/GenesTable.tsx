import React, { useEffect, useState } from "react";
import {
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  useGenesTable
} from "@gff/core";
import { Select } from "../../components/Select";
import RingLoader from "react-spinners/RingLoader";
import { getCustomGridCell, getTableFormatData, tableFunc, sortableOptions } from "./custom-config";
import ProtoTable from "../../components/ProtoTable";

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
  const [pageSizeDisplay, setPageSizeDisplay] = useState( { value: 10, label: "10" });
  const [offset, setOffset] = useState(0);
  const [displayOptions, setDisplayOptions] = useState([
    { value: 10, label: "10" },
    { value: 20, label: "20" }, 
    { value: 40, label: "40" }, 
    { value: 60, label: "60" }, 
    { value: 80, label: "80" }, 
    { value: 100, label: "100" }
  ]);
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


  const handleDisplayChange = (displayChange) => {
    setPageSize(displayChange);
    setPageSizeDisplay(displayOptions.filter(op => op.value === displayChange)[0]);
  }

  if (isUninitialized) {
    return (
      <div className="w-max m-auto mt-40">
        <RingLoader color={"lightblue"} loading={true} size={150} />
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="w-max m-auto mt-40">
        <RingLoader color={"lightblue"} loading={true} size={150} />
      </div>
    );
  }
  
  if (isError) {
    return <div>Failed to fetch table: {error}</div>;
  }

  const nextPage = () => {
    setOffset(offset + pageSize);
  };

  const prevPage = () => {
    setOffset(Math.max(offset - pageSize, 0));
  };

  const displayFilter = (<Select
  label="Number of Displayed Entries"
  inputId="primary-sites-displayed"
  options={displayOptions}
  value={pageSizeDisplay}
  isMulti={false}
  onChange={(e) => {
      handleDisplayChange(e.value)
  }}
/>);

  return (
    <div className="flex flex-col w-100">
      <ProtoTable inputData={getTableFormatData(data)} tableFunc={tableFunc} customCellKeys={["annotations", "survival"]} customGridMapping={getCustomGridCell} sortableOptions={sortableOptions}></ProtoTable>
      <div className="flex flex-row w-2/3 justify-center gap-x-3">
        <div className="w-20">{displayFilter}</div>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={prevPage}>Prev {pageSize}</button>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={nextPage}>Next {pageSize}</button>
      </div>
    </div>
  );
};

export default GenesTable;
