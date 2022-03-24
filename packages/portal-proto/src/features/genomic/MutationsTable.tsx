import React, { useEffect, useState } from "react";
import { Pagination, Select, Table, Checkbox } from "@mantine/core";
import {
  GDCSsmsTable,
  useSsmsTable
} from "@gff/core";
import { BiLineChartDown as SurvivalPlotIcon } from "react-icons/bi";

const MutationsTable: React.FC<unknown> = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setPage] = useState(1);
  const [pages, setPages] = useState(10);
  // using the useCohortSsmsTable from core and the associated useEffect hook
  // exploring different ways to dispatch the pageSize/offset changes
  const { data, isSuccess } = useSsmsTable({ pageSize: pageSize, offset: offset });

  const handlePageSizeChange = (x:string) => {
    setPageSize(parseInt(x));
  }

  const handlePageChange = (x:number) => {
    setOffset((x-1) * pageSize)
    setPage(x);
  }

  return (
    <div className="flex flex-col w-100">
      <MutationTableSimple {...data.ssms}/>
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

const MutationTableSimple: React.FC<GDCSsmsTable> = ( data : GDCSsmsTable) => {
  return (
    <Table verticalSpacing={5} striped highlightOnHover >
      <thead>
      <tr className="bg-nci-gray-lighter text-white">
        <th>DNA Change</th>
        <th>Type</th>
        <th>Consequences</th>
        <th># Affected Cases in Cohort</th>
        <th># Affected Cases Across the GDC</th>
        <th>Impact</th>
        <th>Survival</th>
      </tr>
      </thead>
      <tbody>
      { data.ssms.map((x) => (
          <tr key={x.id}>
            <td> <Checkbox label={x.genomic_dna_change} /></td>
            <td>{x.mutation_subtype}</td>
            <td>{x.consequence[0].gene.symbol} {x.consequence[0].aa_change}</td>
            <td>{x.filteredOccurrences} / {data.filteredCases} ({((x.filteredOccurrences / data.filteredCases) * 100).toFixed(2).toLocaleString()}%)</td>
            <td>{x.occurrence} / {data.cases} ({((x.occurrence / data.cases) * 100).toFixed(2).toLocaleString()}%)</td>
            <td>Impact</td>
            <td><SurvivalPlotIcon size="1.25rem"/></td>
          </tr>
        ))}
       </tbody>
    </Table>
  );
};

export default MutationsTable;
