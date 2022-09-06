import { useState, useMemo, useEffect } from "react";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { createTableColumn } from "./genesTableUtils";
import { GenesColumns } from "@/features/shared/table-utils";
import { GenesTable } from "./GenesTable";
import { INITIAL_FILTERS } from "./types";
import { useGetGenesTableQuery } from "@gff/core";

export interface GTableContainerProps {
  twStyles: string;
}

export const GTableContainer: React.VFC<GTableContainerProps> = ({
  twStyles,
}: GTableContainerProps) => {
  const [filters, setFilters] = useState([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

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
    filters: INITIAL_FILTERS,
  });

  useEffect(() => {
    console.log("useGetGenesTableQuery data", data);
  }, [data]);

  return <GenesTable initialData={[]} columns={[]} expanded={expanded} />;
};
