import { GDCSsmsTable } from "@gff/core";
import { Survival } from "../shared/types";
import { Column, SelectedReducer, SelectReducerAction } from "../shared/types";
import { Columns } from "@/features/shared/VerticalTable";
import { Row, TableInstance } from "react-table";
import {
  SelectMutationIdsButton,
  SelectMutationIdButton,
} from "./SelectAllMutationsButton";
import { Dispatch, SetStateAction } from "react";
import { entityMetadataType } from "src/utils/contexts";
import CohortInactiveIcon from "public/user-flow/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/user-flow/icons/cohort-dna.svg";
import { RatioSpring, SwitchSpring, ToggledCheck } from "../shared";
import {
  IoMdTrendingDown as SurvivalIcon,
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { Tooltip } from "@mantine/core";
import Link from "next/link";
import { Consequences, Impacts, ProteinChange } from "./smTableCells";
import CollapsibleRow from "@/features/shared/CollapsibleRow";

interface CellProps {
  value: string[];
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

interface BuildSMTableProps {
  accessor?: string;
  selectedMutations?: SelectedReducer<SomaticMutations>;
  setSelectedMutations?: Dispatch<SelectReducerAction<SomaticMutations>>;
  handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  setMutationID?: Dispatch<SetStateAction<string>>;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: ReadonlyArray<string>;
  geneSymbol?: string;
  projectId?: string;
  isDemoMode?: boolean;
  setEntityMetadata?: Dispatch<SetStateAction<entityMetadataType>>;
  isModal?: boolean;
  isConsequenceTable?: boolean;
}

export const buildSMTableColumn = ({
  accessor,
  selectedMutations,
  setSelectedMutations,
  setMutationID,
  handleSsmToggled,
  handleSurvivalPlotToggled,
  toggledSsms,
  geneSymbol = undefined,
  projectId = undefined,
  isDemoMode,
  setEntityMetadata,
  isModal,
  isConsequenceTable,
}: BuildSMTableProps): Columns[] => {
  const columnListOrder: Columns[] = [
    {
      id: "selected",
      visible: true,
      columnName: ({ data }: TableInstance) => {
        const mutationIds = data.map((x) => x.selected);
        return <SelectMutationIdsButton mutationIds={mutationIds} />;
      },
      Cell: ({ value }: SelectColumnProps) => {
        return <SelectMutationIdButton mutationId={value} />;
      },
      disableSortBy: true,
    },
    {
      id: "cohort",
      columnName: "Cohort",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        console.log({ toggledSsms });
        const isToggledSsm = toggledSsms.includes(row.original?.["mutationID"]);
        return (
          <SwitchSpring
            isActive={isToggledSsm}
            icon={
              isDemoMode ? (
                <CohortInactiveIcon
                  width={16}
                  height={16}
                  aria-label="inactive cohort icon"
                  viewBox="-4 -1 30 30"
                />
              ) : (
                <CohortActiveIcon
                  width={16}
                  height={16}
                  aria-label="active cohort icon"
                  viewBox="-4 -1 30 30"
                />
              )
            }
            selected={row.original["cohort"]}
            handleSwitch={() => {
              console.log({
                mutationID: row.original?.["mutationID"],
                symbol: row.original?.["DNAChange"],
              });
              handleSsmToggled({
                mutationID: row.original?.["mutationID"],
                symbol: row.original?.["DNAChange"],
              });
            }}
            tooltip={
              isDemoMode
                ? "Feature not available in demo mode"
                : isToggledSsm
                ? `Click to remove ${row.original?.["DNAChange"]} from cohort filters`
                : `Click to add ${row.original?.["DNAChange"]} to cohort filters`
            }
            disabled={isDemoMode}
          />
        );
      },
      disableSortBy: true,
    },
    {
      id: "survival",
      columnName: "Survival",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        const { numerator } = row?.original["affectedCasesInCohort"] ?? {
          numerator: 0,
        };
        const disabled = numerator < 10;
        const selected = row.original["survival"];
        const isActive = selected.checked;
        const tooltip = disabled
          ? `Not enough data`
          : isActive
          ? `Click to remove ${selected.name} from plot`
          : `Click to plot ${selected.name}`;
        return (
          <ToggledCheck
            ariaText={`Toggle survival plot for ${row?.original?.["proteinChange"]} mutation`}
            margin="ml-0.5"
            isActive={row.original["survival"].checked}
            icon={<SurvivalIcon size={24} />}
            survivalProps={{ plot: "gene.ssm.ssm_id" }}
            selected={selected}
            disabled={disabled}
            handleSwitch={handleSurvivalPlotToggled}
            tooltip={tooltip}
          />
        );
      },
      disableSortBy: true,
    },
    {
      id: "mutationID",
      columnName: "Mutation ID",
      visible: false,
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
      disableSortBy: true,
    },
    {
      id: "DNAChange",
      columnName: "DNA Change",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        const originalLabel = row.original["DNAChange"];
        const label = originalLabel
          ? truncateAfterMarker(originalLabel, 8)
          : originalLabel;
        const ssmsId = row.original[`mutationID`];
        return (
          <div className="font-content">
            {label !== "" ? (
              <Tooltip label={originalLabel} disabled={!originalLabel?.length}>
                {isConsequenceTable ? (
                  <span>{label}</span>
                ) : isModal && !geneSymbol ? (
                  <PopupIconButton
                    handleClick={() =>
                      setEntityMetadata({
                        entity_type: "ssms",
                        entity_id: ssmsId,
                      })
                    }
                    label={label}
                  />
                ) : (
                  <Link href={`/ssms/${ssmsId}`}>
                    <a className="underline text-utility-link">{label}</a>
                  </Link>
                )}
              </Tooltip>
            ) : (
              <div className="text-lg ml-3">--</div>
            )}
          </div>
        );
      },
      disableSortBy: true,
    },
    {
      id: "proteinChange",
      columnName: "Protein Change",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        return (
          <ProteinChange
            proteinChange={row.original["proteinChange"]}
            shouldOpenModal={isModal && geneSymbol === undefined}
            shouldLink={projectId !== undefined}
            setEntityMetadata={setEntityMetadata}
          />
        );
      },
      disableSortBy: true,
    },
    {
      id: "type",
      columnName: "Type",
      visible: true,
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
    },
    {
      id: "consequences",
      columnName: "Consequences",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        return <Consequences consequences={row.original["consequences"]} />;
      },
      disableSortBy: true,
    },
    {
      id: "affectedCasesInCohort",
      columnName: "# Affected Cases in Cohort",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        const { numerator, denominator } = row?.original[
          "affectedCasesInCohort"
        ] ?? { numerator: 0, denominator: 1 };
        return <RatioSpring index={0} item={{ numerator, denominator }} />;
      },
      disableSortBy: true,
    },
    {
      id: "affectedCasesAcrossTheGDC",
      columnName: "# Affected Cases Across the GDC",
      visible: true,
      Cell: ({ value, row }: CellProps) => {
        console.log(value);
        return <CollapsibleRow value={value} row={row} label="COMPONENT" />;
      },
      disableSortBy: true,
    },
    {
      id: "impact",
      columnName: "Impact",
      visible: true,
      Cell: ({ row }: CellProps) => {
        return <Impacts impact={row.original["impact"]} />;
      },
      disableSortBy: true,
    },
  ];

  return columnListOrder;
};

export const DEFAULT_SMTABLE_ORDER: Column[] = [
  { id: "select", columnName: "Select", visible: true },
  { id: "cohort", columnName: "Cohort", visible: true },
  { id: "survival", columnName: "Survival", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "proteinChange", columnName: "Protein Change", visible: true },
  { id: "type", columnName: "Type", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
  {
    id: "affectedCasesInCohort",
    columnName: "# Affected Cases in Cohort",
    visible: true,
  },
  {
    id: "affectedCasesAcrossTheGDC",
    columnName: "# Affected Cases Across the GDC",
    visible: true,
  },
  { id: "impact", columnName: "Impact", visible: true },
] as Column[];

export interface Impact {
  polyphenImpact: string;
  polyphenScore: number | string;
  siftImpact: string;
  siftScore: number | string;
  vepImpact: string;
}

export interface SomaticMutations {
  select: string;
  mutationID: string;
  DNAChange: string;
  type: string;
  consequences: string;
  proteinChange: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  affectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  affectedCasesAcrossTheGDC: {
    numerator: number;
    denominator: number;
  };
  cohort: {
    checked: boolean;
  };
  survival: Survival;
  impact: Impact;
  subRows: string;
  ssmsTotal: number;
}

export type SsmToggledHandler = (symbol: Record<string, any>) => void;

export interface SomaticMutationsTableProps {
  status: string;
  readonly initialData: GDCSsmsTable;
  readonly selectedSurvivalPlot: Record<string, string>;
  width: number;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  pageSize: number;
  page: number;
  selectedMutations: SelectedReducer<SomaticMutations>;
  setSelectedMutations: (action: SelectReducerAction<SomaticMutations>) => void;
  handleSMTotal: (smTotal: number) => void;
  columnListOrder: Column[];
  visibleColumns: Column[];
  searchTerm: string;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: ReadonlyArray<string>;
  geneSymbol?: string;
  projectId?: string;
  isDemoMode?: boolean;
  isModal?: boolean;
}

const DNA_CHANGE_MARKERS = ["del", "ins", ">"];
const truncateAfterMarker = (
  term: string,
  length: number,
  markers: string[] = DNA_CHANGE_MARKERS,
  omission = "…",
): string => {
  const markersByIndex = markers.reduce(
    (acc, marker) => {
      const index = term.indexOf(marker);
      if (index !== -1) {
        return { index, marker };
      }
      return acc;
    },
    { index: -1, marker: "" },
  );
  const { index, marker } = markersByIndex;
  if (index !== -1 && term.length > index + marker.length + 8) {
    return `${term.substring(0, index + marker.length + 8)}${omission}`;
  }
  return term;
};
