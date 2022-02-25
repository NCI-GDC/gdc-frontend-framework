import React, { useEffect, useState } from "react";
import {
  GDCGenesTable,
  useGenesTable
} from "@gff/core";
import { Pagination, Select, Table, Checkbox } from "@mantine/core";
import { MdCheck as CheckboxIcon} from "react-icons/md";

const GenesTable = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setPage] = useState(1);
  const [pages, setPages] = useState(10);
  const { data, isSuccess } = useGenesTable(
    { pageSize: pageSize, offset: offset }
  );

  useEffect(() => {
    setPages(Math.ceil(data.genes.filteredCases/pageSize));
  },[data, pageSize]);

  const handlePageSizeChange = (x:string) => {
    setPageSize(parseInt(x));
  }

  const handlePageChange = (x:number) => {
    setOffset((x-1) * pageSize)
    setPage(x);
  }
  if (!isSuccess)
    return (<div>Loading...</div>)

  return (
    <div className="flex flex-col w-100">
      <GenesTableSimple {...data.genes}/>
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

const GenesTableSimple: React.FC<GDCGenesTable> = ({ genes,
                                                     filteredCases,
                                                     cases,
                                                     cnvCases,
                                                     mutationCounts} : GDCGenesTable) => {


  return (
    <Table verticalSpacing={5} striped highlightOnHover >
      <thead>
      <tr className="bg-nci-gray-lighter text-nci-gray-darkest">
        <th>Symbol</th>
        <th>Name</th>
        <th># SSMS Affected Cases in Cohort</th>
        <th># SSMS Affected Cases Across the GDC</th>
        <th>CNV Gain</th>
        <th>CNV Loss</th>
        <th>Mutations</th>
        <th>Annotations</th>
        <th>Survival</th>
      </tr>
      </thead>
      <tbody>
      {
        genes?.map((x, i) => (
        <tr key={x.id} >
          <td className="px-2 break-all">
            <Checkbox icon={CheckboxIcon} label={x.symbol}/>
          </td>
          <td className="px-2">{x.name}</td>
          <td className="px-2"> {x.numCases} / {filteredCases} ({((x.numCases / filteredCases) * 100).toFixed(2).toLocaleString()}%)</td>
          <td className="px-2"> {x.ssm_case} / {cases}</td>
          <td className="px-2"> {x.case_cnv_gain} / {cnvCases} ({((x.case_cnv_gain / cnvCases) * 100).toFixed(2).toLocaleString()}%)</td>
          <td className="px-2"> {x.case_cnv_loss} / {cnvCases} ({((x.case_cnv_loss / cnvCases) * 100).toFixed(2).toLocaleString()}%)</td>
          <td className="px-2"> {mutationCounts
            ? mutationCounts[x.gene_id]
            : " loading"}{" "}</td>
          <td className="px-2">A</td>
          <td className="px-2">S</td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
};

export default GenesTable;
