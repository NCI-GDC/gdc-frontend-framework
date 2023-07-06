import React, { Dispatch, SetStateAction } from "react";
import {
  IoMdTrendingDown as SurvivalIcon,
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { ProteinChange, Impacts, Consequences } from "./smTableCells";
import { SomaticMutations, Impact, SsmToggledHandler } from "./types";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { Tooltip } from "@mantine/core";
import { startCase } from "lodash";
import { AnchorLink } from "@/components/AnchorLink";
import Link from "next/link";
import { entityMetadataType } from "src/utils/contexts";
import { SSMSData } from "@gff/core";
import { externalLinks, humanify } from "src/utils";
import {
  CheckboxSpring,
  RatioSpring,
  SelectReducerAction,
  SelectedReducer,
  Survival,
  SwitchSpring,
  TableCell,
  TableColumnDefinition,
  TableHeader,
  ToggledCheck,
} from "../shared";
import CohortInactiveIcon from "public/user-flow/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/user-flow/icons/cohort-dna.svg";
import { ImpactHeaderWithTooltip } from "../shared/ImpactHeaderWithTooltip";

interface SSMSCreateTableColumnProps {
  accessor: string;
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

export const ssmsCreateTableColumn = ({
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
}: SSMSCreateTableColumnProps): TableColumnDefinition => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={startCase(accessor)} />,
            cell: ({ row }) => {
              return (
                <>
                  {/* todo: make select/toggle columns fixed smaller width */}
                  {row.getCanExpand() && (
                    <CheckboxSpring
                      isActive={row.original["select"] in selectedMutations}
                      select={row}
                      handleCheck={setSelectedMutations}
                      multi={false}
                    />
                  )}
                </>
              );
            },
          },
        ],
      };
    case "cohort": // adds/removes an ssm to the current cohort.
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip="Click to add/remove mutations to/from your cohort filters"
              />
            ),
            cell: ({ row }) => {
              const isToggledSsm = toggledSsms.includes(
                row.original?.mutationID,
              );
              return (
                <>
                  {row.getCanExpand() && (
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
                      handleSwitch={() =>
                        handleSsmToggled({
                          mutationID: row.original?.mutationID,
                          symbol: row.original?.DNAChange,
                        })
                      }
                      tooltip={
                        isDemoMode
                          ? "Feature not available in demo mode"
                          : isToggledSsm
                          ? `Click to remove ${row.original?.DNAChange} from cohort filters`
                          : `Click to add ${row.original?.DNAChange} to cohort filters`
                      }
                      disabled={isDemoMode}
                    />
                  )}
                </>
              );
            },
          },
        ],
      };
    case "survival":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip="Click to change the survival plot display"
              />
            ),
            cell: ({ row }) => {
              if (row.depth > 0) {
                // this is an expanded row
                return null;
              }
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
                <>
                  {row.getCanExpand() && (
                    <ToggledCheck
                      ariaText={`Toggle survival plot for ${row?.original.proteinChange} mutation`}
                      margin="ml-0.5"
                      isActive={row.original["survival"].checked}
                      icon={<SurvivalIcon size={24} />}
                      survivalProps={{ plot: "gene.ssm.ssm_id" }}
                      selected={selected}
                      disabled={disabled}
                      handleSwitch={handleSurvivalPlotToggled}
                      tooltip={tooltip}
                    />
                  )}
                </>
              );
            },
          },
        ],
      };
    case "DNAChange":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <div className="text-left">
                <TableHeader
                  title={
                    isConsequenceTable
                      ? "Coding DNA Change"
                      : startCase(accessor)
                  }
                  tooltip={
                    isConsequenceTable
                      ? undefined
                      : `Genomic DNA Change, shown as
                   {chromosome}:g{start}{ref}>{tumor}`
                  }
                />
              </div>
            ),
            cell: ({ row }) => {
              const originalLabel = row.original["DNAChange"];
              const label = originalLabel
                ? truncateAfterMarker(originalLabel, 8)
                : originalLabel;
              const ssmsId = row.original[`mutationID`];
              return (
                <>
                  {row.getCanExpand() && (
                    <div className="font-content">
                      {label !== "" ? (
                        <Tooltip
                          label={originalLabel}
                          disabled={!originalLabel?.length}
                        >
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
                              <a className="underline text-utility-link">
                                {label}
                              </a>
                            </Link>
                          )}
                        </Tooltip>
                      ) : (
                        <div className="text-lg ml-3">--</div>
                      )}
                    </div>
                  )}
                </>
              );
            },
          },
        ],
      };
    case "affectedCasesAcrossTheGDC":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={`# Affected Cases
                 Across the GDC`}
                tooltip={`# Cases where Mutation is observed /
                  # Cases tested for Simple Somatic Mutations portal wide
                  Expand to see breakdown by project`}
              />
            ),
            cell: ({ row }) => {
              const { numerator, denominator } = row?.original[
                "affectedCasesAcrossTheGDC"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className="flex items-center gap-2">
                  {numerator !== 0 && row.getCanExpand() && (
                    <div className="flex items-center">
                      <button
                        aria-label="expand or collapse subrow"
                        aria-expanded={row.getCanExpand() ? "true" : "false"}
                        {...{
                          onClick: () => {
                            setMutationID(row.original[`mutationID`]);
                            row.toggleExpanded();
                          },
                          style: { cursor: "pointer" },
                        }}
                        className="font-content"
                      >
                        {!row.getIsExpanded() ? (
                          <DownIcon size="1.25em" className="text-accent" />
                        ) : (
                          <UpIcon size="1.25em" className="text-accent" />
                        )}
                      </button>
                    </div>
                  )}
                  {row.getCanExpand() && (
                    <RatioSpring
                      index={0}
                      item={{ numerator, denominator }}
                      list={false}
                    />
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "affectedCasesInCohort": {
      let tooltip = `# Cases where Mutation is observed in ${
        projectId ?? "Cohort"
      }
        / Cases tested for Simple Somatic Mutations in ${projectId ?? "Cohort"}
      `;

      if (geneSymbol) {
        tooltip = `# Cases where Mutation is observed in ${geneSymbol}
        / # Cases with variants in ${geneSymbol}`;
      }
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={`# Affected Cases
                   in ${
                     geneSymbol ? geneSymbol : projectId ? projectId : "Cohort"
                   }`}
                tooltip={tooltip}
              />
            ),
            cell: ({ row }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { numerator, denominator } = row?.original[
                "affectedCasesInCohort"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className="flex justify-between flex-nowrap items-center">
                  {row.getCanExpand() && (
                    <RatioSpring
                      index={0}
                      item={{ numerator, denominator }}
                      list={false}
                    />
                  )}
                </div>
              );
            },
          },
        ],
      };
    }
    case "proteinChange":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={startCase(accessor)} />,
            cell: ({ row }) => {
              return (
                <>
                  {row.getCanExpand() && (
                    <ProteinChange
                      proteinChange={row.original["proteinChange"]}
                      shouldOpenModal={isModal && geneSymbol === undefined}
                      shouldLink={projectId !== undefined}
                      setEntityMetadata={setEntityMetadata}
                    />
                  )}
                </>
              );
            },
          },
        ],
      };
    case "consequences":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip={
                  isConsequenceTable
                    ? "SO Term: consequence type"
                    : "Consequences for canonical transcript"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <div className="font-content">
                  {row.getCanExpand() && (
                    <Consequences consequences={row.original["consequences"]} />
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "impact":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <ImpactHeaderWithTooltip />,
            cell: ({ row }) => {
              return (
                <div className="flex">
                  {row.getCanExpand() && (
                    <Impacts impact={row.original["impact"]} />
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "gene_strand":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title="Gene Strand" className="w-18" />,
            cell: ({ row }) => {
              return (
                <div className="font-content text-lg font-bold">
                  {`${row.original["gene_strand"] > 0 ? "+" : "-"}`}
                </div>
              );
            },
          },
        ],
      };
    case "aa_change":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title="AA Change" className="w-18" />,
            cell: ({ row }) => {
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
          },
        ],
      };
    case "transcript_id":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title="Transcript" className="w-18" />,
            cell: ({ row }) => {
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
          },
        ],
      };
    case "mutationID":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={startCase(accessor)} />,
            cell: ({ row }) => (
              <TableCell row={row} accessor={accessor} anchor={false} />
            ),
          },
        ],
      };
    case "gene": {
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={startCase(accessor)} />,
            cell: ({ row }) => {
              const geneSymbol = row.original["gene_id"];
              return (
                <Link href={`/genes/${geneSymbol}`}>
                  <a className="text-utility-link font-content underline">
                    {row.original[`${accessor}`]
                      ? row.original[`${accessor}`]
                      : ""}
                  </a>
                </Link>
              );
            },
          },
        ],
      };
    }
    default:
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={startCase(accessor)} />,
            cell: ({ row }) => (
              <TableCell row={row} accessor={accessor} anchor={false} />
            ),
          },
        ],
      };
  }
};

export const filterMutationType = (mutationSubType: string): string => {
  if (
    ["Oligo-nucleotide polymorphism", "Tri-nucleotide polymorphism"].includes(
      mutationSubType,
    )
  )
    return mutationSubType;
  const split = mutationSubType.split(" ");
  const operation = split[split.length - 1];
  return operation.charAt(0).toUpperCase() + operation.slice(1);
};

export type MutationsColumn = {
  select: string;
  mutationID: string;
  DNAChange: string;
  type: string;
  consequences: {
    consequenceType: string;
  };
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
  survival: Survival;
  impact: Impact;
  subRows: string;
  ssmsTotal: number;
};

export const getMutation = (
  sm: SSMSData,
  selectedSurvivalPlot: Record<string, string>,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
): SomaticMutations => {
  const {
    ssm_id,
    genomic_dna_change,
    mutation_subtype,
    consequence,
    filteredOccurrences,
    occurrence,
  } = sm;

  const [
    {
      transcript: {
        consequence_type = undefined,
        gene: { gene_id = undefined, symbol = undefined } = {},
        aa_change = undefined,
        annotation: {
          polyphen_impact = undefined,
          polyphen_score = undefined,
          sift_impact = undefined,
          sift_score = undefined,
          vep_impact = undefined,
        } = {},
      } = {},
    } = {},
  ] = consequence;

  return {
    select: ssm_id,
    mutationID: ssm_id,
    DNAChange: genomic_dna_change,
    type: filterMutationType(mutation_subtype),
    consequences: consequence_type,
    proteinChange: {
      symbol: symbol,
      geneId: gene_id,
      aaChange: aa_change,
    },
    affectedCasesInCohort: {
      numerator: filteredOccurrences,
      denominator: filteredCases,
    },
    affectedCasesAcrossTheGDC: {
      numerator: occurrence,
      denominator: cases,
    },
    cohort: {
      checked: true,
    },
    survival: {
      label: `${symbol} ${aa_change ? aa_change : ""} ${humanify({
        term: consequence_type?.replace("_variant", "").replace("_", " "),
      })}`,
      name: genomic_dna_change,
      symbol: ssm_id,
      checked: ssm_id == selectedSurvivalPlot?.symbol,
    },
    impact: {
      polyphenImpact: polyphen_impact,
      polyphenScore: polyphen_score,
      siftImpact: sift_impact,
      siftScore: sift_score,
      vepImpact: vep_impact,
    },
    // do not remove subRows key, it's needed for row.getCanExpand() to be true
    subRows: " ",
    ssmsTotal,
  };
};

export const DNA_CHANGE_MARKERS = ["del", "ins", ">"];

export const truncateAfterMarker = (
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
