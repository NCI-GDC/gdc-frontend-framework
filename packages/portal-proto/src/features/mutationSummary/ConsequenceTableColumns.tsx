import { Columns } from "../shared/VerticalTable";
import { HeaderTooltip } from "../SomaticMutations/utils";
import { ReactNode } from "react";
import { Row } from "react-table";
import { ImpactHeaderWithTooltip } from "../SomaticMutations/TableRowComponents/ImpactHeaderWithTooltip";

interface CellProps {
  value: ReactNode;
  row: Row;
}

export const ConsequenceColumnListOrder: Columns[] = [
  {
    id: "gene",
    columnName: "Gene",
    Cell: ({ value }: CellProps) => <>{value}</>,
    disableSortBy: true,
    visible: true,
  },
  {
    id: "aa_change",
    columnName: "AA Change",
    Cell: ({ value }: CellProps) => <>{value}</>,
    disableSortBy: true,
    visible: true,
  },
  {
    id: "DNAChange",
    columnName: "Coding DNA Change",
    Cell: ({ value }: CellProps) => <>{value}</>,
    disableSortBy: true,
    visible: true,
  },

  {
    id: "consequences",
    HeaderTooltip: (
      <HeaderTooltip
        title="Consequences"
        tooltip="Consequences for canonical transcript"
      />
    ),
    columnName: "Consequences",
    Cell: ({ value }: CellProps) => <>{value}</>,
    disableSortBy: true,
    visible: true,
  },
  {
    id: "impact",
    HeaderTooltip: (
      <ImpactHeaderWithTooltip geneSymbol={undefined} isModal={undefined} />
    ),
    columnName: "Impact",
    Cell: ({ value }: CellProps) => <>{value}</>,
    disableSortBy: true,
    visible: true,
  },
  {
    id: "gene_strand",
    columnName: "Gene Strand",
    Cell: ({ value }: CellProps) => (
      <span className="font-bold text-xl">{value}</span>
    ),
    disableSortBy: true,
    visible: true,
  },
  {
    id: "transcript_id",
    columnName: "Transcript",
    Cell: ({ value }: CellProps) => <>{value}</>,
    disableSortBy: true,
    visible: true,
  },
];
