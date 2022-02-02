import React, { useEffect, useState } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  fetchGenesTable,
  fetchSmsAggregations,
  GDCGenesTable,
  selectGenesTableData,
  selectSSMSAggregationData,
  TablePageOffsetProps,
  useSSMSAggregations,

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


const useGenesTable = (pageSize:number, offset:number) : GenesTableResponse => {
  const coreDispatch = useCoreDispatch();
  const table = useCoreSelector((state) =>
    selectGenesTableData(state),
  );
  useEffect(() => { // fetch table information when pageSize or Offset (and eventually filters) changes
      coreDispatch(fetchGenesTable({ pageSize:pageSize, offset:offset }));
  }, [ pageSize, offset]);
   return {
    data: { ...table?.data.genes },
    error: table?.error,
    isUninitialized: table === undefined,
    isFetching: table?.status === "pending",
    isSuccess: table?.status === "fulfilled",
    isError: table?.status === "rejected",
   };
 };

const GenesTable : React.FC<TablePageOffsetProps> = ({ pageSize, offset } : TablePageOffsetProps) => {

  const [poffset, setOffset] = useState(0);

  const { data, error, isUninitialized, isFetching, isError } =
    useGenesTable(  pageSize, poffset   );

  if (isUninitialized) {
    return <div>Initializing table...</div>;
  }

  if (isFetching) {
    return <div>Fetching table...</div>;
  }

  if (isError) {
    return <div>Failed to fetch table: {error}</div>;
  }

  const handleClick = () => {
    setOffset(poffset + 2);
  }

  return (
    <div className="flex flex-col w-100">
      <div className={"grid grid-cols-9 gap-x-8"}>
        <span>Symbol</span>
        <span>Name </span>
        <span># SSMS Affected Cases in Cohort	</span>
        <span># SSMS Affected Cases Across the GDC </span>
        <span>CNV Gain </span>
        <span>CNV Loss </span>
        <span>Mutations</span>
        <span>Annotations</span>
        <span>Survival</span>
      </div>
      {
        data.genes.map((x, index) => {
          return (<div className={`grid grid-cols-9 gap-x-8 ${index % 2 == 0 ? "bg-nci-cyan-lighter" : "bg-nci-teal-light"}`} key={x.id}>
            <span>{x.symbol} </span>
            <span>{x.name}</span>
            <span>{x.cnv_case} / {data.filteredCases} </span>
            <span>{x.ssm_case} / {data.cases} </span>
            <span>{x.case_cnv_gain} / {data.cnvCases} </span>
            <span>{x.case_cnv_loss} / {data.cnvCases} </span>
            <span>{data.mutationCounts  ? data.mutationCounts[x.gene_id] : " loading"} </span>
            <span>A</span>
            <span>S</span>
          </div>);
        })
      }
      <button onClick={handleClick} >Next 10</button>
      </div>
  )
}

export default GenesTable;
