import React, { useEffect } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  fetchSsmsTable,
  GDCSsmsTable,
  selectSsmsTableData,
} from "@gff/core";

interface SSMSTableResponce {
  readonly data?: GDCSsmsTable;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}


const useSSMSTable = (pageSize:number, offset:number): SSMSTableResponce => {
  const coreDispatch = useCoreDispatch();
  const table = useCoreSelector((state) =>
    selectSsmsTableData(state),
  );

  useEffect(() => {
    console.log(table);
    if (table.status === "uninitialized") {
      coreDispatch(fetchSsmsTable({ pageSize:pageSize, offset:offset }));
    }
  }, [coreDispatch, table, pageSize, offset]);

  return {
    data: { ... table?.data.ssms },
    error: table?.error,
    isUninitialized: table === undefined,
    isFetching: table?.status === "pending",
    isSuccess: table?.status === "fulfilled",
    isError: table?.status === "rejected",
  };
};

interface MutationTableProps {
  readonly pageSize: number;
  readonly offset: number;
}

const MutationTable : React.FC<MutationTableProps> = ({ pageSize, offset } : MutationTableProps) => {

  const { data, error, isUninitialized, isFetching, isError } =
    useSSMSTable(10, 0);

  if (isUninitialized) {
    return <div>Initializing table...</div>;
  }

  if (isFetching) {
    return <div>Fetching table...</div>;
  }

  if (isError) {
    return <div>Failed to fetch table: {error}</div>;
  }

  return (
    <div className="flex flex-col w-100">
      <div className={"grid grid-cols-7 gap-x-10"}>
        <span>DNA Change</span>	<span>Type </span>	<span>Consequences</span>
        <span># Affected Cases in Cohort	</span>
        <span># Affected Cases Across the GDC </span>
        <span>Impact</span>	<span>Survival</span>
      </div>
      {
        data.ssms.map((x, index) => {
          return (<div className={`grid grid-cols-7 gap-x-10 ${index % 2 == 0 ? "bg-nci-cyan-lighter" : "bg-nci-teal-light"}`} key={x.id}>
            <span>{x.genomic_dna_change} </span> <span>{x.mutation_subtype}</span>
            <span>{x.consequence[0].gene.symbol} {x.consequence[0].aa_change}	</span>
            <span>{x.filteredOccurrences} / {data.filteredCases} </span>
            <span>{x.occurrence} / {data.cases} </span>
            <span>Impact</span> <span>S</span>
          </div>);
        })
      }
      </div>
  )
}

export default MutationTable;
