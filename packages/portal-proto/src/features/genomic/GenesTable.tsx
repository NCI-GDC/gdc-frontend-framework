import React, { useEffect, useState } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  fetchGenesTable,
  GDCGenesTable,
  selectGenesTableData, selectCohortCountsByName,
} from "@gff/core";
import { Pagination, Select, Table, Checkbox } from "@mantine/core";

interface GenesTableResponse {
  readonly data?: GDCGenesTable;
  readonly mutationsCount?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useGenesTable = (
  pageSize: number,
  offset: number,
): GenesTableResponse => {
  const coreDispatch = useCoreDispatch();
  const table = useCoreSelector((state) => selectGenesTableData(state));
  useEffect(() => {
    // fetch table information when pageSize or Offset (and eventually filters) changes
    coreDispatch(fetchGenesTable({ pageSize: pageSize, offset: offset }));
  }, [pageSize, offset]);
  return {
    data: { ...table?.data.genes },
    error: table?.error,
    isUninitialized: table === undefined,
    isFetching: table?.status === "pending",
    isSuccess: table?.status === "fulfilled",
    isError: table?.status === "rejected",
  };
};

const GenesTable = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activePage, setPage] = useState(1);
  const [pages, setPages] = useState(10);
  const { data, isSuccess } = useGenesTable(
    pageSize,
    offset,
  ); // using the local useGenesTable hook defined above

  useEffect(() => {
    setPages(Math.ceil(data.filteredCases/pageSize));
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
      <GenesTableSimple data={data}></GenesTableSimple>
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

const GenesTableSimple: React.FC<GDCGenesTable> = ({ data }: GDCGenesTable) => {

  const handleGenesSelected = (c) => {

  };

  return (
    <Table verticalSpacing={5} striped highlightOnHover >
      <thead>
      <tr className="bg-nci-gray-lighter text-white">
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
        data.genes?.map((x, i) => (
        <tr key={x.id} >
          <td className="px-2 break-all">
            <Checkbox onClick={() => handleGenesSelected(x)} label={x.symbol}/>
          </td>
          <td className="px-2">{x.name}</td>
          <td className="px-2"> {x.cnv_case} / {data.filteredCases}</td>
          <td className="px-2"> {x.ssm_case} / {data.cases}</td>
          <td className="px-2"> {x.case_cnv_gain} / {data.cnvCases}</td>
          <td className="px-2"> {x.case_cnv_loss} / {data.cnvCases}</td>
          <td className="px-2"> {data.mutationCounts
            ? data.mutationCounts[x.gene_id]
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
