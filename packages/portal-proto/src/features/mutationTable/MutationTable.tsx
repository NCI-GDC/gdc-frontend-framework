import React, { useCallback, useEffect, useState } from "react";
import { fetchSsmsTable, useCoreDispatch, useSsmsTable } from "@gff/core";
import RingLoader from "react-spinners/RingLoader";
import { filterMutationType, formatImpact, tableFunc, truncateAfterMarker } from "./custom-config";
import VerticalTable from "../shared/VerticalTable";
import { Pagination, Select, Tooltip } from "@mantine/core";
import { GenomicTableProps } from "../genomic/types";
import { BsFileEarmarkTextFill, BsGraphDown } from "react-icons/bs";
import _ from "lodash";

const MutationTable: React.FC<GenomicTableProps> = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);

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

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  }

  const handlePageChange = (x: number) => {
    setOffset((x - 1) * pageSize)
    setPage(x);
  }


 const getCustomGridCell = (key) => {
   
  switch (key) {
      case "impact":
          return {
              Header: "Impact",
              accessor: 'impact',
              Cell: ({ value, row }) => (<>
                  <div className="grid place-items-center">
                      <div className="flex flex-row space-x-3">
                          {(value.vepImpact !== null) ? 
                          <Tooltip label={`VEP Impact: ${value.vepImpact}`}>
                              <div className={`${value.vepColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value.vepText}</div> 
                          </Tooltip>
                          : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                          {(value.siftScore !== null) ? 
                          <Tooltip label={`SIFT Impact: ${value.siftImpact} / SIFT Score: ${value.siftScore}`}>
                              <div className={`${value.siftColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value.siftText}</div> 
                          </Tooltip>
                          : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                          {(value.polyScore !== null) ? 
                          <Tooltip label={`PolyPhen Impact: ${value.polyImpact} / PolyPhen Score: ${value.polyScore}`}>
                              <div className={`${value.polyColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value.polyText}</div>
                          </Tooltip>
                          : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                      </div>
                  </div>
              </>),
          };
      case "survival":
          return {
              Header: "Survival",
              accessor: 'survival',
              Cell: ({ value, row }) => (
                  <div className="grid place-items-center">
                      <BsGraphDown onClick={() => tableFunc()}></BsGraphDown>
                  </div>
              )
          }
      case "annotations":
          return {
              Header: "Annotations",
              accessor: 'annotations',
              Cell: ({ value, row }) => (<div className="grid place-items-center">
                  <BsFileEarmarkTextFill></BsFileEarmarkTextFill>
              </div>)
          }
      default:
          console.log('key', key);
  }
}

 const getTableFormatData = (data) => {
  if (data.status === 'fulfilled') {
      const DNA_CHANGE_MARKERS = ['del', 'ins', '>'];
      const ssmsTableMapping = data.ssms.ssms.map((s) => {
          return {
              DNAChange: truncateAfterMarker(s.genomic_dna_change, DNA_CHANGE_MARKERS, 10),
              type: filterMutationType(s.mutation_subtype),
              consequences: _.startCase(_.toLower(s.consequence[0].consequence_type)) + ' ' + s.consequence[0].gene.symbol + ' ' + s.consequence[0].aa_change,
              affectedCasesInCohort: `${s.filteredOccurrences + ' / ' + data.ssms.filteredCases} (${(100 * s.filteredOccurrences / data.ssms.filteredCases).toFixed(2)}%)`,
              affectedCasesAcrossTheGDC: `${s.occurrence + ' / ' + data.ssms.cases} (${(100 * s.occurrence / data.ssms.cases).toFixed(2)}%)`,
              impact: formatImpact(s.consequence[0].annotation),
              survival: 'S'
          }
      })
      return ssmsTableMapping
  }
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

    return 
    // <VerticalTable tableData={getTableFormatData(data)} customCellKeys={["impact", "survival"]} customGridMapping={getCustomGridCell}></VerticalTable>

  }, [data, error, isUninitialized, isFetching, isError, pageSize, offset]);
  

  return (
    <div className="flex flex-col w-screen">
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

export default MutationTable;
