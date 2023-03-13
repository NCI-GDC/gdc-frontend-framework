import React, { Dispatch, SetStateAction } from "react";
import ToggleSpring from "../shared/ToggleSpring";
import SwitchSpring from "../shared/SwitchSpring";
import RatioSpring from "../shared/RatioSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { IoMdTrendingDown as SurvivalIcon } from "react-icons/io";
import { TableCell, TableHeader } from "../shared/sharedTableCells";
import { ProteinChange, Impacts, Consequences } from "./smTableCells";
import { SomaticMutations, Impact, SsmToggledHandler } from "./types";
import CheckboxSpring from "../shared/CheckboxSpring";
import { Survival } from "../shared/types";
import { TableColumnDefinition } from "../shared/types";
import { Image } from "@/components/Image";
import { Text, Tooltip } from "@mantine/core";
import { startCase } from "lodash";
import { AnchorLink } from "@/components/AnchorLink";
import Link from "next/link";
import ToggledCheck from "@/components/expandableTables/shared/ToggledCheck";
import { entityMetadataType } from "src/utils/contexts";
import { SSMSData } from "@gff/core";
import { externalLinks } from "src/utils";
import tw from "tailwind-styled-components";

export const createTableColumn = (
  accessor: string,
  selectedMutations: SelectedReducer<SomaticMutations>,
  setSelectedMutations: Dispatch<SelectReducerAction<SomaticMutations>>,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void,
  setMutationID: Dispatch<SetStateAction<string>>,
  handleSsmToggled: SsmToggledHandler,
  toggledSsms: ReadonlyArray<string>,
  geneSymbol: string = undefined,
  isDemoMode: boolean,
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>,
  isModal: boolean,
  isConsequenceTable?: boolean,
): TableColumnDefinition => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip={""}
                className="ml-1 mr-2"
              />
            ),
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
    case "cohort": // adds/removes a gene to the current cohort.
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader title={startCase(accessor)} tooltip={""} />
            ),
            cell: ({ row }) => {
              return (
                <>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={toggledSsms.includes(row.original?.mutationID)}
                      margin=""
                      icon={
                        isDemoMode ? (
                          <Image
                            src={"/user-flow/icons/CohortSym_inactive.svg"}
                            width={16}
                            height={16}
                          />
                        ) : (
                          <Image
                            src={"/user-flow/icons/cohort-dna.svg"}
                            width={16}
                            height={16}
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
                        isDemoMode && "Feature not available in demo mode"
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
              <TableHeader title={startCase(accessor)} tooltip={""} />
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
                  title={startCase(accessor)}
                  tooltip={`Genomic DNA Change, shown as
                   {chromosome}:g{start}{ref}>{tumor}`}
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
                <div className="font-content">
                  {label !== "" ? (
                    <Tooltip
                      label={originalLabel}
                      disabled={!originalLabel?.length}
                    >
                      {isConsequenceTable ? (
                        <span>{label}</span>
                      ) : isModal ? (
                        <button
                          className="text-utility-link underline"
                          onClick={() =>
                            setEntityMetadata({
                              entity_type: "ssms",
                              entity_id: ssmsId,
                            })
                          }
                        >
                          {label}
                        </button>
                      ) : (
                        <Link href={`/ssms/${ssmsId}`}>
                          <a className="underline text-utility-link">{label}</a>
                        </Link>
                      )}
                    </Tooltip>
                  ) : (
                    <div className="text-lg ml-3">{"--"}</div>
                  )}
                </div>
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
                <div className="flex flex-nowrap items-center">
                  {row.getCanExpand() && (
                    <div className="text-center content-center mr-2">
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
                      >
                        <ToggleSpring
                          isExpanded={row.getIsExpanded()}
                          icon={
                            <MdKeyboardArrowDown size="0.75em" color="white" />
                          }
                        />
                      </button>
                    </div>
                  )}
                  {row.getCanExpand() && (
                    <RatioSpring
                      index={0}
                      item={{ numerator, denominator }}
                      orientation="horizontal"
                    />
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "affectedCasesInCohort":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={`# Affected Cases
                   in ${geneSymbol ? geneSymbol : "Cohort"}`}
                tooltip={`# Cases where Mutation is observed in ${
                  geneSymbol ?? "Cohort"
                } / # Cases tested for Simple Somatic Mutations in Cohort`}
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
                    <>
                      <RatioSpring
                        index={0}
                        item={{ numerator, denominator }}
                        orientation="horizontal"
                      />
                    </>
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "proteinChange":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader title={startCase(accessor)} tooltip={""} />
            ),
            cell: ({ row }) => {
              return (
                <div>
                  {row.getCanExpand() && (
                    <ProteinChange
                      proteinChange={row.original["proteinChange"]}
                      shouldLink={isModal && geneSymbol === undefined}
                      setEntityMetadata={setEntityMetadata}
                    />
                  )}
                </div>
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
                tooltip="Consequences for canonical transcript"
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
            header: () => {
              const TwIconDiv = tw.div`w-7 h-6 text-base-max border rounded-md flex justify-center items-center`;
              return (
                <Tooltip
                  label={
                    <div className="flex flex-col gap-1">
                      <Text>Impact for canonical transcript:</Text>
                      <div className="flex flex-row items-bottom gap-1">
                        VEP:
                        <TwIconDiv className="bg-red-500 mx-1">HI</TwIconDiv>
                        high
                        <TwIconDiv className="bg-green-500 mx-1">LO</TwIconDiv>
                        low
                        <TwIconDiv className=" bg-gray-500 mx-1">MO</TwIconDiv>
                        moderate
                        <TwIconDiv className=" bg-gray-500 mx-1">MR</TwIconDiv>
                        modifier
                      </div>
                      <div className="flex flex-row items-bottom gap-1">
                        SIFT:
                        <TwIconDiv className=" bg-red-500 mx-1">DH</TwIconDiv>
                        deleterious
                        <TwIconDiv className=" bg-gray-500 mx-1">DL</TwIconDiv>
                        deleterious_low_confidence
                        <TwIconDiv className=" bg-gray-500 mx-1">TO</TwIconDiv>
                        tolerated
                        <TwIconDiv className=" bg-green-500 mx-1">TL</TwIconDiv>
                        tolerated_low_confidence
                      </div>
                      <div className="flex flex-row items-bottom gap-1">
                        PolyPhen:
                        <TwIconDiv className=" bg-green-500 mx-1">BE</TwIconDiv>
                        benign
                        <TwIconDiv className=" bg-gray-500 mx-1">PO</TwIconDiv>
                        possibly_damaging
                        <TwIconDiv className=" bg-red-500 mx-1">PR</TwIconDiv>
                        probably_damaging
                        <TwIconDiv className=" bg-gray-500 mx-1">UN</TwIconDiv>
                        unknown
                      </div>
                    </div>
                  }
                  width="auto"
                  withArrow
                  arrowSize={8}
                  transition="fade"
                  offset={10}
                  transitionDuration={200}
                  multiline
                  classNames={{
                    tooltip:
                      "bg-base-lightest text-base-contrast-lightest font-heading text-left",
                  }}
                  position={geneSymbol && isModal ? "left-start" : "top"}
                >
                  <div className="font-heading text-left whitespace-pre-line">
                    Impact
                  </div>
                </Tooltip>
              );
            },
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
            header: () => (
              <TableHeader title="Gene Strand" tooltip={""} className="w-18" />
            ),
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
            header: () => (
              <TableHeader title="AA Change" tooltip={""} className="w-18" />
            ),
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
            header: () => (
              <TableHeader title="Transcript" tooltip={""} className="w-18" />
            ),
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
            header: () => (
              <TableHeader title={startCase(accessor)} tooltip={""} />
            ),
            cell: ({ row }) => (
              <TableCell
                row={row}
                accessor={accessor}
                anchor={false}
                tooltip={""}
              />
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
            header: () => (
              <TableHeader title={startCase(accessor)} tooltip={""} />
            ),
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
            header: () => (
              <TableHeader title={startCase(accessor)} tooltip={""} />
            ),
            cell: ({ row }) => (
              <TableCell
                row={row}
                accessor={accessor}
                anchor={false}
                tooltip={""}
              />
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

  const {
    transcript: {
      consequence_type,
      gene: { gene_id, symbol },
      aa_change,
      annotation: {
        polyphen_impact,
        polyphen_score,
        sift_impact,
        sift_score,
        vep_impact,
      },
    },
  } = consequence[0];

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
      label: aa_change ? symbol + " " + aa_change : symbol,
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
