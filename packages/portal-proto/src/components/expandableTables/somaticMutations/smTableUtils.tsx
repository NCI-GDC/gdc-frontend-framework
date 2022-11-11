import { Dispatch, SetStateAction } from "react";
import { animated } from "react-spring";
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
import { TableColumnDefinition, WidthSpring } from "../shared/types";
import { Image } from "@/components/Image";

export const createTableColumn = (
  accessor: string,
  partitionWidth: WidthSpring,
  selectedMutations: SelectedReducer<SomaticMutations>,
  setSelectedMutations: Dispatch<SelectReducerAction<SomaticMutations>>,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void,
  setMutationID: Dispatch<SetStateAction<string>>,
): TableColumnDefinition => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={accessor} tooltip={""} />,
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
    case "cohort":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader title={accessor} tooltip={""} />,
            cell: ({ row }) => {
              return (
                <>
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
            header: () => <TableHeader title={accessor} tooltip={""} />,
            cell: ({ row }) => {
              return (
                <>
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
              <TableHeader
                title={accessor}
                tooltip={
                  "Genomic DNA Change, shown as {chromosome}:g{start}{ref}>{tumor}"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div style={partitionWidth}>
                  <TableCell
                    row={row}
                    accessor={accessor}
                    anchor={true}
                    tooltip={row.original["DNAChange"]}
                  />
                </animated.div>
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
                tooltip={
                  "# of Cases where Mutation is observed / # Cases tested for Simple Somatic Mutations portal wide | Expand to see breakdown by project"
                }
              />
            ),
            cell: ({ row }) => {
              const { numerator, denominator } = row?.original[
                "affectedCasesAcrossTheGDC"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <RatioSpring
                      index={0}
                      item={{ numerator, denominator }}
                      orientation={"vertical"}
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
                </animated.div>
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
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <>
                      <RatioSpring
                        index={0}
                        item={{ numerator, denominator }}
                        orientation={"vertical"}
                      />
                    </>
                  )}
                </animated.div>
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
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <ProteinChange
                      proteinChange={row.original["proteinChange"]}
                    />
                  )}
                </animated.div>
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
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <Consequences consequences={row.original["consequences"]} />
                  )}
                </animated.div>
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
            header: () => (
              <TableHeader
                title={accessor}
                // todo: tooltip
                tooltip={""}
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <Impacts impact={row.original["impact"]} />
                  )}
                </animated.div>
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
                <animated.div style={partitionWidth}>
                  <>
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                  </>
                </animated.div>
              );
            },
          },
        ],
      };
  }
};

export const filterMutationType = (mutationSubType: string): string => {
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
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    ssmsTotal,
  };
};
