import React, { useEffect, useState } from "react";
import {
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  useGenesTable
} from "@gff/core";
import HorizontalTable from "../../components/HorizontalTable";
import { Select } from "../../components/Select";

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

  const getTableFormatData = (data) => {
    if (data.status === 'fulfilled') {
      const tableRows = [];
      data.genes.genes.forEach(element => {
        tableRows.push({
          symbol: element.symbol,
          name: element.name,
          ssmsAffectedCasesInCohort: `${element.cnv_case + ' / ' + data.genes.filteredCases}`,
          ssmsAffectedCasesAcrossTheGdc: `${element.ssm_case + ' / ' + data.genes.cases}`,
          cnvGain: `${element.case_cnv_gain + ' / ' + data.genes.cnvCases}`,
          cnvLoss: `${element.case_cnv_loss + ' / ' + data.genes.cnvCases}`,
          mutations: data.genes.mutationCounts[element.gene_id],
          annotations: "A",
          survival: "S"
        })
      })
      return tableRows
    }
  }

  const handleDisplayChange = (displayChange) => {
    setPageSize(displayChange);
    setPageSizeDisplay(displayOptions.filter(op => op.value === displayChange)[0]);
  }

  useEffect(() => {
    getTableFormatData(data);
  }, [data]);

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
      <HorizontalTable inputData={getTableFormatData(data)}></HorizontalTable>
      <div className="flex flex-row w-2/3 justify-center gap-x-3">
        <div className="w-20">{displayFilter}</div>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={prevPage}>Prev {pageSize}</button>
        <button className="bg-nci-gray-light hover:bg-nci-gray-dark" onClick={nextPage}>Next {pageSize}</button>
      </div>
    </div>
  );
};

export default GenesTable;
