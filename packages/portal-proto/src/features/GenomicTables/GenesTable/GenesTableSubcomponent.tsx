import { useGetGeneTableSubrowQuery } from "@gff/core";
import { Row } from "@tanstack/react-table";
import { Gene } from "./types";
import CommonSubcomponent from "../SharedComponent/CommonSubcomponent";

function GenesTableSubcomponent({ row }: { row: Row<Gene> }): JSX.Element {
  const {
    data: subData,
    isFetching,
    isSuccess,
    isError,
  } = useGetGeneTableSubrowQuery({ id: row.original.gene_id });
  return (
    <CommonSubcomponent
      subData={subData}
      subrowTitle="# SSMS Affected Cases Across The GDC"
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
    />
  );
}

export default GenesTableSubcomponent;
