import { Columns } from "@/features/shared/VerticalTable";
import { Row, TableInstance } from "react-table";
import {
  SelectAllGeneIdsButton,
  SelectGeneIdButton,
} from "./SelectAllGenesButton";
import { ReactNode } from "react";
import { HeaderTooltip } from "../SomaticMutations/utils";
import { NumeratorDenominator } from "@/components/expandableTables/shared";
import SMTableRowExpandableRow from "../SomaticMutations/TableRowComponents/SMTableRowExpandableRow";

// not correct for all the cells
interface CellProps {
  value: ReactNode;
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

export const buildGenesTableColumn = (): Columns[] => {
  const columnListOrder: Columns[] = [
    {
      id: "selected",
      columnName: ({ data }: TableInstance) => {
        const geneIds = data.map((x) => x.selected);
        return <SelectAllGeneIdsButton geneIds={geneIds} />;
      },
      Cell: ({ value }: SelectColumnProps) => {
        return <SelectGeneIdButton geneId={value} />;
      },
      visible: true,
      disableSortBy: true,
    },
    {
      id: "cohort",
      HeaderTooltip: (
        <HeaderTooltip
          title="Cohort"
          tooltip="Click to add/remove genes to/from your cohort filters"
        />
      ),
      columnName: "Cohort",
      Cell: ({ value }: CellProps) => {
        return <>{value} </>;
      },
      disableSortBy: true,
      visible: true,
    },
    {
      id: "survival",
      HeaderTooltip: (
        <HeaderTooltip
          title="Survival"
          tooltip="Click to change the survival plot display"
        />
      ),
      columnName: "Survival",
      Cell: ({ value }: CellProps) => <>{value}</>,
      visible: true,
    },
    {
      id: "geneID",
      columnName: "Gene ID",
      Cell: ({ value }: CellProps) => <>{value} </>,
      disableSortBy: true,
      visible: false,
    },
    {
      id: "symbol",
      columnName: "Symbol",
      Cell: ({ value }: CellProps) => <>{value} </>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "name",
      columnName: "Name",
      Cell: ({ value }: CellProps) => {
        return <>{value} </>;
      },
      disableSortBy: true,
      visible: true,
    },
    {
      id: "cytoband",
      columnName: "Cytoband",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: false,
    },
    {
      id: "type",
      columnName: "Type",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: false,
    },
    {
      id: "SSMSAffectedCasesInCohort",
      HeaderTooltip: (
        <HeaderTooltip
          title={`# SSM Affected Cases
            in Cohort`}
          tooltip={`Breakdown of Affected Cases in Cohort:
                # Cases where Gene is mutated / # Cases tested for Simple Somatic Mutations`}
        />
      ),

      columnName: "# SSM Affected Cases in Cohort",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "SSMSAffectedCasesAcrossTheGDC",
      HeaderTooltip: (
        <HeaderTooltip
          title={`# SSM Affected Cases
          Across the GDC`}
          tooltip={`# Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide.
         Expand to see breakdown by project`}
        />
      ),
      columnName: "# SSM Affected Cases Across the GDC",
      Cell: ({ value, row }: CellProps) => {
        return (
          <SMTableRowExpandableRow
            value={["sss", "asss"]}
            row={row}
            label={
              <NumeratorDenominator
                numerator={value["numerator"]}
                denominator={value["denominator"]}
              />
            }
            expandedRowTitle="# SSMS Affected Cases Across The GDC"
          />
        );
      },
      disableSortBy: true,
      visible: true,
    },
    {
      id: "CNVGain",
      HeaderTooltip: (
        <HeaderTooltip
          title="# CNV Gain"
          tooltip="# Cases where CNV gain events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
        />
      ),
      columnName: "# CNV Gain",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "CNVLoss",
      HeaderTooltip: (
        <HeaderTooltip
          title="# CNV Loss"
          tooltip="# Cases where CNV loss events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
        />
      ),
      columnName: "# CNV Loss",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "mutations",
      HeaderTooltip: (
        <HeaderTooltip
          title="# Mutations"
          tooltip="# Unique Simple Somatic Mutations in the Gene in Cohort"
        />
      ),
      columnName: "# Mutations",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },

    {
      id: "annotations",
      columnName: "Annotations",
      Cell: ({ value }: CellProps) => {
        return <>{value} </>;
      },
      disableSortBy: true,
      visible: true,
    },
  ];

  return columnListOrder;
};
