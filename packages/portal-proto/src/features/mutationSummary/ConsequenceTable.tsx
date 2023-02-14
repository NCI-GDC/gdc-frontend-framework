import React, { SetStateAction, useMemo, Dispatch } from "react";
import { SomaticMutations } from "@/components/expandableTables/somaticMutations/types";
import { ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "@/components/expandableTables/shared/ExpTable";
import { createTableColumn } from "@/components/expandableTables/somaticMutations/smTableUtils";
import { Column } from "@/components/expandableTables/shared/types";
import { ConsequenceTableData } from "@/features/mutationSummary/types";
import { entityMetadataType } from "src/utils/contexts";

export interface ConsequenceTableProps {
  ssmsId: string;
  status: string;
  readonly tableData: ConsequenceTableData[];
  pageSize: number;
  page: number;
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
        return createTableColumn(
          accessor,
          {},
          () => null,
          () => null,
          () => null,
          () => null,
          [],
          "",
          false,
          {} as Dispatch<SetStateAction<entityMetadataType>>,
        );
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
