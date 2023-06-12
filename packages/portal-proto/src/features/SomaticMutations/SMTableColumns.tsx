import { Columns } from "@/features/shared/VerticalTable";
import { Row, TableInstance } from "react-table";
import { NumeratorDenominator } from "../../components/expandableTables/shared";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import {
  SelectMutationIdButton,
  SelectAllMutationIdsButton,
} from "./SelectAllMutationsButton";
import { ImpactHeaderWithTooltip } from "./TableRowComponents/ImpactHeaderWithTooltip";
import { HeaderTooltip } from "./utils";
import { ReactNode } from "react";

// not correct for all the cells
interface CellProps {
  value: ReactNode;
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

export const buildSMTableColumnNew = ({
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
      columnName: (
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
      id: "mutationID",
      columnName: "Mutation ID",
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
      disableSortBy: true,
      visible: false,
    },
    {
      id: "DNAChange",
      columnName: (
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
      columnName: (
        <HeaderTooltip
          title="Consequences"
          tooltip="Consequences for canonical transcript"
        />
      ),
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "affectedCasesInCohort",
      columnName: (
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
      Cell: ({ value }: CellProps) => <>{value}</>,
      disableSortBy: true,
      visible: true,
    },
    {
      id: "affectedCasesAcrossTheGDC",
      columnName: (
        <HeaderTooltip
          title={`# Affected Cases
            Across the GDC`}
          tooltip={`# Cases where Mutation is observed /
             # Cases tested for Simple Somatic Mutations portal wide
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
      id: "impact",
      columnName: (
        <ImpactHeaderWithTooltip geneSymbol={geneSymbol} isModal={isModal} />
      ),
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
