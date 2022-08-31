import { useState, useMemo } from "react";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { createTableColumn } from "./genesTableUtils";
import { GenesColumns } from "@/features/shared/table-utils";
import { GenesTable } from "./GenesTable";

export interface GTableContainerProps {
  props: string;
}

export const GTableContainer: React.VFC<GTableContainerProps> = ({
  props,
}: GTableContainerProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // data frome Genes Table

  const columns = useMemo<ColumnDef<GenesColumns>[]>(
    // data map and then pass down
    // include custom condition here or in createTableColumn
    () => [
      // ...data.map(
      // ...createTableColumn()
      // )
    ],
    [],
  );

  return <GenesTable data={[]} columns={columns} expanded={expanded} />;
};
