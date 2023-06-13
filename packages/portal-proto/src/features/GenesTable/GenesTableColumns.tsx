import { Columns } from "@/features/shared/VerticalTable";
import { Row, TableInstance } from "react-table";
import {
  SelectAllGeneIdsButton,
  SelectGeneIdButton,
} from "./SelectAllGenesButton";
import { ReactNode } from "react";
import { HeaderTooltip } from "../SomaticMutations/utils";
import CollapsibleRow from "../shared/CollapsibleRow";
import { NumeratorDenominator } from "@/components/expandableTables/shared";

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
      columnName: (
        <HeaderTooltip
          title="Cohort"
          tooltip="Click to add/remove genes to/from your cohort filters"
        />
      ),
      Cell: ({ value }: CellProps) => {
        return <>{value} </>;
      },
      disableSortBy: true,
      visible: true,
    },
    {
      id: "survival",
      columnName: (
        <HeaderTooltip
          title="Survival"
          tooltip="Click to change the survival plot display"
        />
      ),
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
      columnName: (
        <HeaderTooltip
          title={`# SSM Affected Cases
            in Cohort`}
          tooltip={`Breakdown of Affected Cases in Cohort:
                # Cases where Gene is mutated / # Cases tested for Simple Somatic Mutations`}
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "SSMSAffectedCasesAcrossTheGDC",
      columnName: (
        <HeaderTooltip
          title={`# SSM Affected Cases
          Across the GDC`}
          tooltip={`# Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide.
         Expand to see breakdown by project`}
        />
      ),
      Cell: ({ value, row }: CellProps) => {
        return (
          <CollapsibleRow
            value={["sss", "asss"]}
            row={row}
            label={
              <NumeratorDenominator
                numerator={value["numerator"]}
                denominator={value["denominator"]}
              />
            }
            hideValueLength={true}
            expandedRowTitle="# SSMS Affected Cases Across The GDC"
          />
        );
      },
      disableSortBy: true,
      visible: true,
    },
    {
      id: "CNVGain",
      columnName: (
        <HeaderTooltip
          title={`# CNV Gain`}
          tooltip={
            "# Cases where CNV gain events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
          }
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "CNVLoss",
      columnName: (
        <HeaderTooltip
          title={`# CNV Loss`}
          tooltip={
            "# Cases where CNV loss events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
          }
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "mutations",
      columnName: (
        <HeaderTooltip
          title="# Mutations"
          tooltip="# Unique Simple Somatic Mutations in the Gene in Cohort"
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },

    {
      id: "annotations",
      columnName: "Annotations",
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
      disableSortBy: true,
      visible: true,
    },
  ];

  return columnListOrder;
};
