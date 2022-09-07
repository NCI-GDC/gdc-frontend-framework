import { useState, useMemo, useEffect } from "react";
import { createTableColumn } from "./genesTableUtils";
import { GenesColumns } from "@/features/shared/table-utils";
import { GenesTable } from "./GenesTable";
import { getGraphQLFilters } from "./types";
import { useGetGenesTableQuery } from "@gff/core";

export interface GTableContainerProps {
  twStyles: string;
}

export const GTableContainer: React.VFC<GTableContainerProps> = ({
  twStyles,
}: GTableContainerProps) => {
  const [filters, setFilters] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);

  // data frome Genes Table

  // const columns = useMemo<ColumnDef<GenesColumns>[]>(
  //   // data map and then pass down
  //   // include custom condition here or in createTableColumn
  //   () => [
  //     // ...data.map(
  //     // ...createTableColumn()
  //     // )
  //   ],
  //   [],
  // );

  const { data, isLoading, isError } = useGetGenesTableQuery({
    filters: getGraphQLFilters(pageSize, offset),
  });

  useEffect(() => {
    console.log("useGetGenesTableQuery data", data);
  }, [data]);

  return <GenesTable initialData={[]} columns={[]} />;
};
