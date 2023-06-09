import React, { useMemo } from "react";
import { SomaticMutations } from "@/features/SomaticMutations/types";
import { ColumnDef } from "@tanstack/react-table";
import { ssmsCreateTableColumn } from "@/features/SomaticMutations/smTableUtils";
import { ConsequenceTableData } from "@/features/mutationSummary/types";
import { Column, ExpTable } from "@/components/expandableTables/shared";

export interface ConsequenceTableProps {
  status: string;
  readonly tableData: ConsequenceTableData[];
  columnListOrder: Column[];
  visibleColumns: Column[];
}

export const ConsequenceTable: React.FC<ConsequenceTableProps> = ({
  status,
  tableData,
  columnListOrder,
  visibleColumns,
}: ConsequenceTableProps) => {
  // `exp` is non-mutable within the lexical scope of handleExpandedProxy
  //  this effect hook is a workaround that updates expanded after expandedProxy updates

  const columns = useMemo<ColumnDef<SomaticMutations>[]>(
    () => {
      return visibleColumns.map(({ id: accessor }: Column) => {
        return ssmsCreateTableColumn({
          accessor,
          isConsequenceTable: true,
        });
      });
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleColumns],
  );

  return (
    <>
      <ExpTable
        status={status}
        data={tableData}
        columns={columns}
        expanded={[]}
        handleExpandedProxy={() => null}
        selectAll={() => null}
        allSelected={[]}
        firstColumn={columnListOrder[0].id}
        subrow={null}
      />
    </>
  );
};

export default ConsequenceTable;
