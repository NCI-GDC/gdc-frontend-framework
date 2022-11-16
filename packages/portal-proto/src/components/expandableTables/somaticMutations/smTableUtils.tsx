import { Dispatch, SetStateAction } from "react";
import ToggleSpring from "../shared/ToggleSpring";
import SwitchSpring from "../shared/SwitchSpring";
import RatioSpring from "../shared/RatioSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import { SelectedReducer, SelectReducerAction } from "../shared/types";
import { SurvivalIcon } from "../shared/sharedTableUtils";
import { TableCell, TableHeader } from "../shared/sharedTableCells";
import { ProteinChange, Impacts, Consequences } from "./smTableCells";
import { SingleSomaticMutation, SomaticMutations, Impact } from "./types";
import CheckboxSpring from "../shared/CheckboxSpring";
import { Survival } from "../shared/types";
import { TableColumnDefinition } from "../shared/types";
import { Image } from "@/components/Image";
import { Text, Tooltip } from "@mantine/core";

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
  width?: string | number,
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
              <div className="ml-0">
                {" "}
                <TableHeader title={accessor} tooltip={""} />{" "}
              </div>
            ),
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""}`}>
                  {/* todo: make select/toggle columns fixed smaller width */}
                  {row.getCanExpand() && (
                    <CheckboxSpring
                      isActive={row.original["select"] in selectedMutations}
                      select={row}
                      handleCheck={setSelectedMutations}
                      multi={false}
                    />
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "cohort":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <div className="text-center">
                {" "}
                <TableHeader title={accessor} tooltip={""} />{" "}
              </div>
            ),
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""}`}>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={row.original["cohort"].checked}
                      margin={`my-0.5 ml-0`}
                      icon={
                        <Image
                          src={"/user-flow/icons/cohort-dna.svg"}
                          width={16}
                          height={16}
                        />
                      }
                      selected={row.original["cohort"]}
                      handleSwitch={undefined} // handleCohortSwitch
                      tooltip={""}
                    />
                  )}
                </div>
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
            header: () => <TableHeader title={accessor} tooltip={""} />,
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""}`}>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      margin={`mt-1 ml-0.5`}
                      isActive={row.original["survival"].checked}
                      icon={<SurvivalIcon />}
                      survivalProps={{ plot: "gene.ssm.ssm_id" }}
                      selected={row.original["survival"]}
                      handleSwitch={handleSurvivalPlotToggled}
                      tooltip={`Click icon to plot ${row.original["survival"].symbol}`}
                    />
                  )}
                </div>
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
                  title={accessor}
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
              return (
                <div className={`${width ? width : ""} text-left pl-2`}>
                  <Tooltip
                    label={originalLabel}
                    disabled={!originalLabel?.length}
                  >
                    <Text size="sm">{label}</Text>
                  </Tooltip>
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
                title={accessor}
                tooltip={`# of Cases where Mutation is observed / 
                  # Cases tested for Simple Somatic Mutations portal wide
                  Expand to see breakdown by project`}
              />
            ),
            cell: ({ row }) => {
              const { numerator, denominator } = row?.original[
                "affectedCasesAcrossTheGDC"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className={`${width ? width : ""} content-center`}>
                  {row.getCanExpand() && (
                    <RatioSpring
                      index={0}
                      item={{ numerator, denominator }}
                      orientation="horizontal"
                    />
                  )}
                  {row.getCanExpand() && (
                    <div className={`text-center`}>
                      <button
                        aria-controls={`expandedSubrow`}
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
                            <MdKeyboardArrowDown size="small" color="white" />
                          }
                        />
                      </button>
                    </div>
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
                title={accessor}
                tooltip={
                  "# of Cases where Mutation is observed in Cohort / # of Cases tested for Simple Somatic Mutations in Cohort"
                }
              />
            ),
            cell: ({ row }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { numerator, denominator } = row?.original[
                "affectedCasesInCohort"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className={`${width ? width : ""} content-center`}>
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
            header: () => <TableHeader title={accessor} tooltip={""} />,
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""}`}>
                  {row.getCanExpand() && (
                    <ProteinChange
                      proteinChange={row.original["proteinChange"]}
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
                title={accessor}
                tooltip={"Consequences for canonical transcript"}
              />
            ),
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""} content-center`}>
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
              const twIconStyles = `w-7 h-7 text-white font-bold border rounded-md text-center`;
              return (
                <Tooltip
                  label={
                    <div className="flex flex-col">
                      <Text>Impact for canonical transcript:</Text>
                      <div className="flex flex-row items-bottom">
                        VEP:
                        <div className={`${twIconStyles} bg-red-500 mx-1`}>
                          <div className={`mt-1`}>{"HI"}</div>
                        </div>
                        high
                        <div className={`${twIconStyles} bg-green-500 mx-1`}>
                          <div className={`mt-1`}>{"LO"}</div>
                        </div>
                        low
                        <div className={`${twIconStyles} bg-gray-500 mx-1`}>
                          <div className={`mt-1`}>{"MO"}</div>
                        </div>
                        moderate
                        <div className={`${twIconStyles} bg-gray-500 mx-1`}>
                          <div className={`mt-1`}>{"MR"}</div>
                        </div>
                        modifier
                      </div>
                      <div className="flex flex-row items-bottom">
                        SIFT:
                        <div className={`${twIconStyles} bg-red-500 mx-1`}>
                          <div className={`mt-1`}>{"DH"}</div>
                        </div>
                        deleterious
                        <div className={`${twIconStyles} bg-gray-500 mx-1`}>
                          <div className={`mt-1`}>{"DL"}</div>
                        </div>
                        deleterious_low_confidence
                        <div className={`${twIconStyles} bg-gray-500 mx-1`}>
                          <div className={`mt-1`}>{"TO"}</div>
                        </div>
                        tolerated
                        <div className={`${twIconStyles} bg-green-500 mx-1`}>
                          <div className={`mt-1`}>{"TL"}</div>
                        </div>
                        tolerated_low_confidence
                      </div>
                      <div className="flex flex-row items-bottom">
                        PolyPhen:
                        <div className={`${twIconStyles} bg-green-500 mx-1`}>
                          <div className={`mt-1`}>{"BE"}</div>
                        </div>
                        benign
                        <div className={`${twIconStyles} bg-gray-500 mx-1`}>
                          <div className={`mt-1`}>{"PO"}</div>
                        </div>
                        possibly_damaging
                        <div className={`${twIconStyles} bg-red-500 mx-1`}>
                          <div className={`mt-1`}>{"PR"}</div>
                        </div>
                        probably_damaging
                        <div className={`${twIconStyles} bg-gray-500 mx-1`}>
                          <div className={`mt-1`}>{"UN"}</div>
                        </div>
                        unknown
                      </div>
                    </div>
                  }
                  width="auto"
                  withArrow
                  arrowSize={6}
                  transition="fade"
                  transitionDuration={200}
                  multiline
                  classNames={{
                    tooltip:
                      "bg-base-lightest text-base-contrast-lightest font-heading text-left",
                  }}
                >
                  <div>Impact</div>
                </Tooltip>
              );
            },
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""} content-center`}>
                  {row.getCanExpand() && (
                    <Impacts impact={row.original["impact"]} />
                  )}
                </div>
              );
            },
          },
        ],
      };
    default:
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={accessor} tooltip={""} />,
            cell: ({ row }) => {
              return (
                <div className={`${width ? width : ""}`}>
                  <>
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                  </>
                </div>
              );
            },
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
  sm: SingleSomaticMutation,
  selectedSurvivalPlot: Record<string, string>,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
): SomaticMutations => {
  const { ssm_id, genomic_dna_change } = sm;
  const {
    gene = {
      symbol: "",
      name: "",
    },
    annotation = {
      polyphen_impact: "",
      polyphen_score: "",
      sift_impact: "",
      sift_score: "",
      vep_impact: "",
    },
    aa_change = "",
    consequence_type = "",
  } = sm.consequence[0] ?? {};
  return {
    select: sm.ssm_id,
    mutationID: sm.ssm_id,
    DNAChange: sm.genomic_dna_change,
    type: filterMutationType(sm.mutation_subtype),
    consequences: consequence_type,
    proteinChange: {
      symbol: gene.symbol,
      aaChange: aa_change,
    },
    affectedCasesInCohort: {
      numerator: sm.filteredOccurrences,
      denominator: filteredCases,
    },
    affectedCasesAcrossTheGDC: {
      numerator: sm.occurrence,
      denominator: cases,
    },
    cohort: {
      checked: true,
    },
    survival: {
      label: gene.symbol + " " + aa_change,
      name: genomic_dna_change,
      symbol: ssm_id,
      checked: ssm_id == selectedSurvivalPlot?.symbol,
    },
    impact: {
      polyphenImpact: annotation.polyphen_impact,
      polyphenScore: annotation.polyphen_score,
      siftImpact: annotation.sift_impact,
      siftScore: annotation.sift_score,
      vepImpact: annotation.vep_impact,
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
