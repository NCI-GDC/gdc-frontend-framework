import React, { useEffect } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  fetchSsmsTable,
  GDCSsmsTable,
  selectSsmsTableData,
  FacetBuckets,
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
      console.log("dispatch table");
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
    <div className="w-100">
      Cases: {data.cases} Filtered Cases {data.filteredCases}
    </div>
  )
}

export default MutationTable;
