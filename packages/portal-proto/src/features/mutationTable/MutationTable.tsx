import React, { useEffect } from "react";
import {
  useSsmsTable,
} from "@gff/core";


interface MutationTableProps {
  readonly pageSize: number;
  readonly offset: number;
}

const MutationTable : React.FC<MutationTableProps> = ({ pageSize, offset } : MutationTableProps) => {

  const { data, error, isUninitialized, isFetching, isError } =
    useSsmsTable({ pageSize: 10,  offset: 0 });

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
        data.ssms.ssms.map((x, index) => {
          return (<div className={`grid grid-cols-7 gap-x-10 ${index % 2 == 0 ? "bg-nci-cyan-lighter" : "bg-nci-teal-light"}`} key={x.id}>
            <span>{x.genomic_dna_change} </span> <span>{x.mutation_subtype}</span>
            <span>{x.consequence[0].gene.symbol} {x.consequence[0].aa_change}	</span>
            <span>{x.filteredOccurrences} / {data.ssms.filteredCases} </span>
            <span>{x.occurrence} / {data.ssms.cases} </span>
            <span>Impact</span> <span>S</span>
          </div>);
        })
      }
      </div>
  )
}

export default MutationTable;
