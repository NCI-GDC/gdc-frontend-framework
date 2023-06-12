import {
  GDCSsmsTable,
  useLazyGetSomaticMutationTableSubrowQuery,
} from "@gff/core";
import { Survival } from "../../components/expandableTables/shared/types";
import {
  Column,
  SelectedReducer,
  SelectReducerAction,
} from "../../components/expandableTables/shared/types";
import { Columns } from "@/features/shared/VerticalTable";
import { Row, TableInstance } from "react-table";

import { Dispatch, SetStateAction } from "react";
import { entityMetadataType } from "src/utils/contexts";
import CohortInactiveIcon from "public/user-flow/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/user-flow/icons/cohort-dna.svg";
import {
  NumeratorDenominator,
  RatioSpring,
  SwitchSpring,
  ToggledCheck,
} from "../../components/expandableTables/shared";
import { IoMdTrendingDown as SurvivalIcon } from "react-icons/io";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { Tooltip, Text } from "@mantine/core";
import Link from "next/link";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import { AnchorLink } from "@/components/AnchorLink";
import { externalLinks } from "src/utils";
import {
  SelectMutationIdButton,
  SelectAllMutationIdsButton,
} from "./SelectAllMutationsButton";
import { Consequences, Impacts, ProteinChange } from "./smTableCells";
import { ImpactHeaderWithTooltip } from "./ImpactHeaderWithTooltip";

interface CellProps {
  value: string[];
  row: Row;
}

interface SelectColumnProps {
  value: string;
}

interface BuildSMTableProps {
  customColumnList: Columns[];
  selectedMutations?: SelectedReducer<SomaticMutations>;
  handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: ReadonlyArray<string>;
  geneSymbol?: string;
  projectId?: string;
  isDemoMode?: boolean;
  setEntityMetadata?: Dispatch<SetStateAction<entityMetadataType>>;
  isModal?: boolean;
  isConsequenceTable?: boolean;
}

type ModifiedType = Omit<Columns, "visible"> & { visible?: boolean };

const HeaderTooltip = ({ title, tooltip }) => {
  return (
    <Tooltip
      label={<Text className="whitespace-pre-line text-left">{tooltip}</Text>}
      width={200}
      multiline
      withArrow
      transition="fade"
      transitionDuration={200}
      position="bottom-start"
    >
      <div className="font-heading text-left text-sm whitespace-pre-line">
        {title}
      </div>
    </Tooltip>
  );
};

// probably should move to someplace else
export const buildSMTableColumn = ({
  customColumnList,
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
  const columnListOrder: ModifiedType[] = [
    {
      id: "selected",
      columnName: ({ data }: TableInstance) => {
        console.log({ data });
        const mutationIds = data.map((x) => x.selected);
        return <SelectAllMutationIdsButton mutationIds={mutationIds} />;
      },
      Cell: ({ value }: SelectColumnProps) => {
        return <SelectMutationIdButton mutationId={value} />;
      },
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
      Cell: ({ row }: CellProps) => {
        console.log({ toggledSsmsIn: toggledSsms });
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
              // console.log({
              //   mutationID: row.original?.["mutationID"],
              //   symbol: row.original?.["DNAChange"],
              // });
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
      columnName: (
        <HeaderTooltip
          title="Survival"
          tooltip="Click to change the survival plot display"
        />
      ),
      Cell: ({ row }: CellProps) => {
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
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
      disableSortBy: true,
    },
    {
      id: "DNAChange",
      columnName: (
        <HeaderTooltip
          title={isConsequenceTable ? "Coding DNA Change" : "DNA Change"}
          tooltip={
            isConsequenceTable
              ? undefined
              : `Genomic DNA Change, shown as
         {chromosome}:g{start}{ref}>{tumor}`
          }
        />
      ),
      Cell: ({ row }: CellProps) => {
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
      Cell: ({ row }: CellProps) => {
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
      Cell: ({ value }: CellProps) => {
        return <div className="text-left w-24">{value} </div>;
      },
    },
    {
      id: "consequences",
      columnName: (
        <HeaderTooltip
          title="Consequences"
          tooltip={
            isConsequenceTable
              ? "SO Term: consequence type"
              : "Consequences for canonical transcript"
          }
        />
      ),
      Cell: ({ row }: CellProps) => {
        return <Consequences consequences={row.original["consequences"]} />;
      },
      disableSortBy: true,
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
      Cell: ({ row }: CellProps) => {
        const { numerator, denominator } = row?.original[
          "affectedCasesInCohort"
        ] ?? { numerator: 0, denominator: 1 };
        return <RatioSpring index={0} item={{ numerator, denominator }} />;
      },
      disableSortBy: true,
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
        console.log({ value, row });
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
    },
    {
      id: "impact",
      columnName: (
        <ImpactHeaderWithTooltip geneSymbol={geneSymbol} isModal={isModal} />
      ),
      Cell: ({ row }: CellProps) => {
        return <Impacts impact={row.original["impact"]} />;
      },
      disableSortBy: true,
    },
    // consequence table
    {
      id: "gene_strand",
      columnName: "Gene Strand",
      Cell: ({ row }) => {
        return (
          <div className="font-content text-lg font-bold">
            {`${row.original["gene_strand"] > 0 ? "+" : "-"}`}
          </div>
        );
      },
      disableSortBy: true,
    },
    // consequence table
    {
      id: "aa_change",
      columnName: "AA Change",
      Cell: ({ row }) => {
        const label = row.original["aa_change"];
        return (
          <>
            {label !== null ? (
              <span>{label}</span>
            ) : (
              <span className="text-center text-lg">--</span>
            )}
          </>
        );
      },
      disableSortBy: true,
    },
    // consequence table
    {
      id: "transcript_id",
      columnName: "Transcript",
      Cell: ({ row }) => {
        const transcript_id = row.original?.transcript_id;
        const isC = row.original["is_canonical"] as boolean;
        return (
          <div>
            {transcript_id ? (
              <AnchorLink
                href={externalLinks.transcript(transcript_id)}
                title={transcript_id}
                toolTipLabel={isC ? "Canonical" : undefined}
                iconText={isC ? "C" : undefined}
              />
            ) : null}
          </div>
        );
      },
      disableSortBy: true,
    },
    // consequence table
    {
      id: "gene",
      columnName: "Gene",
      Cell: ({ row }) => {
        const transcript_id = row.original?.transcript_id;
        const isC = row.original["is_canonical"] as boolean;
        return (
          <div>
            {transcript_id ? (
              <AnchorLink
                href={externalLinks.transcript(transcript_id)}
                title={transcript_id}
                toolTipLabel={isC ? "Canonical" : undefined}
                iconText={isC ? "C" : undefined}
              />
            ) : null}
          </div>
        );
      },
      disableSortBy: true,
    },
  ];

  const filteredData = columnListOrder.map((obj) => {
    const match = customColumnList.find((matchObj) => matchObj.id === obj.id);

    if (match) {
      if (match.visible) {
        obj.visible = true;
      } else {
        obj.visible = false;
      }
      return obj;
    }
  });

  return filteredData.filter((elem) => elem !== undefined) as Columns[];
};

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
