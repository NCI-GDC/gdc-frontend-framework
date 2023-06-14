import { Columns } from "@/features/shared/VerticalTable";
import { Row, TableInstance } from "react-table";
import { NumeratorDenominator } from "../../components/expandableTables/shared";
import {
  SelectMutationIdButton,
  SelectAllMutationIdsButton,
} from "./SelectAllMutationsButton";
import { ImpactHeaderWithTooltip } from "./TableRowComponents/ImpactHeaderWithTooltip";
import { HeaderTooltip } from "./utils";
import { ReactNode } from "react";
import SMTableRowExpandableRow from "./TableRowComponents/SMTableRowExpandableRow";

// not correct for all the cells
interface CellProps {
  value: ReactNode;
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

export const buildSMTableColumn = ({
  geneSymbol = undefined,
  projectId = undefined,
  isModal,
  isMutationFreqApp,
}: {
  geneSymbol: string | undefined;
  projectId: string | undefined;
  isModal: boolean;
  isMutationFreqApp: boolean;
}): Columns[] => {
  const columnListOrder: Columns[] = [
    {
      id: "selected",
      columnName: ({ data }: TableInstance) => {
        const mutationIds = data.map((x) => x.selected);
        return <SelectAllMutationIdsButton mutationIds={mutationIds} />;
      },
      Cell: ({ value }: SelectColumnProps) => {
        return <SelectMutationIdButton mutationId={value} />;
      },
      visible: true,
      disableSortBy: true,
    },
    {
      id: "cohort",
      columnName: "Cohort",
      HeaderTooltip: (
        <HeaderTooltip
          title="Cohort"
          tooltip="Click to add/remove mutations to/from your cohort filters"
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
      columnName: "Survival",
      HeaderTooltip: (
        <HeaderTooltip
          title="Survival"
          tooltip="Click to change the survival plot display"
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      visible: true,
    },
    {
      id: "mutationID",
      columnName: "Mutation ID",
      Cell: ({ value }: CellProps) => {
        return <>{value} </>;
      },
      disableSortBy: true,
      visible: false,
    },
    {
      id: "DNAChange",
      columnName: "DNA Change",
      HeaderTooltip: (
        <HeaderTooltip
          title="DNA Change"
          tooltip={`Genomic DNA Change, shown as
               {chromosome}:g{start}{ref}>{tumor}`}
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "proteinChange",
      columnName: "Protein Change",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "type",
      columnName: "Type",
      Cell: ({ value }: CellProps) => {
        return <>{value} </>;
      },
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
      id: "affectedCasesInCohort",
      HeaderTooltip: (
        <HeaderTooltip
          title={`# Affected Cases
              in ${geneSymbol ? geneSymbol : projectId ? projectId : "Cohort"}`}
          tooltip={`# Cases where Mutation is observed in ${
            geneSymbol ?? projectId ?? "Cohort"
          }
                  / ${
                    geneSymbol
                      ? `# Cases with variants in ${geneSymbol}`
                      : `Cases tested for Simple Somatic Mutations in ${
                          projectId ?? "Cohort"
                        }`
                  }
                `}
        />
      ),
      columnName: `# Affected Cases
      in ${geneSymbol ? geneSymbol : projectId ? projectId : "Cohort"}`,
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "affectedCasesAcrossTheGDC",
      HeaderTooltip: (
        <HeaderTooltip
          title={`# Affected Cases
            Across the GDC`}
          tooltip={`# Cases where Mutation is observed /
             # Cases tested for Simple Somatic Mutations portal wide
             Expand to see breakdown by project`}
        />
      ),
      columnName: `# Affected Cases
      Across the GDC`,
      Cell: ({ value, row }: CellProps) => {
        return (
          <SMTableRowExpandableRow
            mutationId={row.original["mutationID"]}
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
        // return <>{value}</>;
      },
      disableSortBy: true,
      visible: true,
    },
    {
      id: "impact",
      HeaderTooltip: (
        <ImpactHeaderWithTooltip geneSymbol={geneSymbol} isModal={isModal} />
      ),
      columnName: "Impact",
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
  ];

  return isMutationFreqApp
    ? columnListOrder
    : columnListOrder.filter(
        (elem) => elem.id !== "cohort" && elem.id !== "survival",
      );
};
