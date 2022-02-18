import React, { useEffect, useState } from "react";
import { fetchSsmsTable, useCoreDispatch, useSsmsTable } from "@gff/core";
import HorizontalTable from "../../components/HorizontalTable";
import { Select } from "../../components/Select";

const MutationTable: React.FC<unknown> = () => {
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
  const { data, error, isUninitialized, isFetching, isError } = useSsmsTable({
    pageSize: pageSize,
    offset: offset,
  });

  useEffect(() => {
    coreDispatch(fetchSsmsTable({ pageSize: pageSize, offset: offset }));
  }, [pageSize, offset]);

  const getTableFormatData = (data) => {
    if (data.status === 'fulfilled') {
      const tableRows = [];
      data.ssms.ssms.forEach(element => {
        tableRows.push({
          dnaChange: element.genomic_dna_change,
          type: element.mutation_subtype,
          consequences: element.consequence[0].gene.symbol + ' ' + element.consequence[0].aa_change,
          affectedCasesInCohort: `${element.filteredOccurrences + ' / ' + data.ssms.filteredCases}`,
          affectedCasesAcrossTheGdc:  `${element.occurrence + ' / ' + data.ssms.cases}`,
          impact: 'Impact',
          survival: 'S'
        })
      })
      return tableRows
    }
  }

  const handleDisplayChange = (displayChange) => {
    setPageSize(displayChange);
    setPageSizeDisplay(displayOptions.filter(op => op.value === displayChange)[0]);
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
      <HorizontalTable inputData={getTableFormatData(data)}></HorizontalTable>
      <div className="flex flex-row w-2/3 justify-center gap-x-3">
      <div className="w-20">{displayFilter}</div>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={prevPage}>Prev {pageSize}</button>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={nextPage}>Next {pageSize}</button>
      </div>
    </div>
  );
};

export default MutationTable;
