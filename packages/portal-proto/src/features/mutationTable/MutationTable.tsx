import React, { useEffect, useState } from "react";
import { fetchSsmsTable, useCoreDispatch, useSsmsTable } from "@gff/core";

const MutationTable: React.FC<unknown> = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const coreDispatch = useCoreDispatch();

  // using the useSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, error, isUninitialized, isFetching, isError } = useSsmsTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchSsmsTable({ pageSize: pageSize, offset: offset }));
  }, [pageSize, offset]);

  const nextPage = () => {
    setOffset(offset + pageSize);
  };

  const prevPage = () => {
    setOffset(Math.max(offset - pageSize, 0));
  };

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
        <span>DNA Change</span> <span>Type </span> <span>Consequences</span>
        <span># Affected Cases in Cohort </span>
        <span># Affected Cases Across the GDC </span>
        <span>Impact</span> <span>Survival</span>
      </div>
      {data.ssms.ssms.map((x, index) => {
        return (
          <div
            className={`grid grid-cols-7 gap-x-10 ${
              index % 2 == 0 ? "bg-nci-cyan-lighter" : "bg-nci-teal-light"
            }`}
            key={x.id}
          >
            <span>{x.genomic_dna_change} </span>{" "}
            <span>{x.mutation_subtype}</span>
            <span>
              {x.consequence[0].gene.symbol} {x.consequence[0].aa_change}{" "}
            </span>
            <span>
              {x.filteredOccurrences} / {data.ssms.filteredCases}{" "}
            </span>
            <span>
              {x.occurrence} / {data.ssms.cases}{" "}
            </span>
            <span>Impact</span> <span>S</span>
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

export default MutationTable;
