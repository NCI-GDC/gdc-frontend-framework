import React, { useEffect, useState } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  selectGenesTableData,
} from "@gff/core";

interface GenesTableResponse {
  readonly data?: GDCGenesTable;
  readonly mutationsCount?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useGenesTable = (
  pageSize: number,
  offset: number,
): GenesTableResponse => {
  const coreDispatch = useCoreDispatch();
  const table = useCoreSelector((state) => selectGenesTableData(state));
  useEffect(() => {
    // fetch table information when pageSize or Offset (and eventually filters) changes
    coreDispatch(fetchGenesTable({ pageSize: pageSize, offset: offset }));
  }, [pageSize, offset]);
  return {
    data: { ...table?.data.genes },
    error: table?.error,
    isUninitialized: table === undefined,
    isFetching: table?.status === "pending",
    isSuccess: table?.status === "fulfilled",
    isError: table?.status === "rejected",
  };
};

const GenesTable = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, error, isUninitialized, isFetching, isError } = useGenesTable(
    pageSize,
    offset,
  ); // using the local useGenesTable hook defined above

  /* these should be replaced with a spinner */
  if (isUninitialized) {
    return <div>Initializing table...</div>;
  }

  if (isFetching) {
    return <div>Fetching table...</div>;
  }
  /* end of spinner */
  if (isError) {
    return <div>Failed to fetch table: {error}</div>;
  }

  const nextPage = () => {
    setOffset(offset + pageSize);
  };

  const prevPage = () => {
    setOffset(Math.max(offset - pageSize, 0));
  };

  return (
    <div className="flex flex-col w-100">
      <div className={"grid grid-cols-9 gap-x-8"}>
        <span>Symbol</span>
        <span>Name </span>
        <span># SSMS Affected Cases in Cohort </span>
        <span># SSMS Affected Cases Across the GDC </span>
        <span>CNV Gain </span>
        <span>CNV Loss </span>
        <span>Mutations</span>
        <span>Annotations</span>
        <span>Survival</span>
      </div>
      {data.genes.map((x, index) => {
        return (
          <div
            className={`grid grid-cols-9 gap-x-8 ${
              index % 2 == 0 ? "bg-nci-cyan-lighter" : "bg-nci-teal-light"
            }`}
            key={x.id}
          >
            <span>{x.symbol} </span>
            <span>{x.name}</span>
            <span>
              {x.cnv_case} / {data.filteredCases}{" "}
            </span>
            <span>
              {x.ssm_case} / {data.cases}{" "}
            </span>
            <span>
              {x.case_cnv_gain} / {data.cnvCases}{" "}
            </span>
            <span>
              {x.case_cnv_loss} / {data.cnvCases}{" "}
            </span>
            <span>
              {data.mutationCounts
                ? data.mutationCounts[x.gene_id]
                : " loading"}{" "}
            </span>
            <span>A</span>
            <span>S</span>
          </div>
        );
      })}
      <div className="flex flex-row w-2/3 justify-center gap-x-3">
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={prevPage}>Prev 10</button>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={nextPage}>Next 10</button>
      </div>
    </div>
  );
};

export default GenesTable;
