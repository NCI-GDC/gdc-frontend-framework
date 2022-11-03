import { Dispatch, SetStateAction } from "react";
import { animated } from "react-spring";
import ToggleSpring from "../shared/ToggleSpring";
import SwitchSpring from "../shared/SwitchSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  TableColumnState,
  TableCell,
  TableHeader,
  SurvivalIcon,
} from "../shared/types";
import { SingleSomaticMutation, SomaticMutation, Impacts } from "./types";
import CheckboxSpring from "../shared/CheckboxSpring";
import PercentageBar from "../shared/PercentageBar";
import { Survival } from "../shared/types";
import { Tooltip } from "@mantine/core";
import { TableColumnDefinition, WidthSpring } from "../shared/types";
import { Subrow } from "../shared/Subrow";
import { useGetSomaticMutationTableSubrowQuery } from "@gff/core";
import { Image } from "@/components/Image";

export const ProteinChange = ({
  proteinChange,
}: {
  proteinChange: {
    symbol: string;
    aaChange: string;
  };
}): JSX.Element => {
  const { symbol = "", aaChange = "" } = proteinChange;
  return (
    <div className={`flex flex-row w-max m-auto text-xs`}>
      <span className={`mx-0.5`}>{symbol}</span>
      <Tooltip label={aaChange}>
        <span className={`mx-0.5`}>{aaChange}</span>
      </Tooltip>
    </div>
  );
};

export const Consequence = ({
  consequence,
}: {
  consequence: {
    consequenceType: string;
  };
}): JSX.Element => {
  const { consequenceType = "" } = consequence;
  const cType = consequenceType.split("_")[0]
    ? consequenceType.split("_")[0]
    : ``;
  const formatConsequence = cType
    ? cType?.charAt(0).toUpperCase() + cType?.slice(1)
    : ``;
  return (
    <>
      <div className={`flex flex-row w-max m-auto text-xs`}>
        <span className={`mx-0.5 font-bold`}>{formatConsequence}</span>
      </div>
    </>
  );
};

const Impact = ({ impact }: { impact: Impacts }): JSX.Element => {
  const { polyphenImpact, polyphenScore, siftImpact, siftScore, vepImpact } =
    impact;
  const twIconStyles = `w-7 h-7 text-white font-bold border rounded-md text-center`;
  const blankIconStyles = `w-7 h-7 text-black font-bold text-center`;
  return (
    <div
      className={`flex flex-row m-auto w-max h-max items-center content-center`}
    >
      <Tooltip label={`VEP Impact: ${vepImpact}`} disabled={!vepImpact.length}>
        <div className={`text-xs`}>
          {vepImpact === "HIGH" ? (
            <div className={`${twIconStyles} bg-red-500`}>
              <div className={`mt-1`}>{"HI"}</div>
            </div>
          ) : vepImpact === "MODERATE" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"MO"}</div>
            </div>
          ) : vepImpact === "LOW" ? (
            <div className={`${twIconStyles} bg-green-500`}>
              <div className={`mt-1`}>{"LOW"}</div>
            </div>
          ) : vepImpact === "MODIFIER" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"MO"}</div>
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-white`}>
              <div className={`mt-1`}>{"_"}</div>
            </div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`SIFT Impact: ${siftImpact} / SIFT Score: ${siftScore}`}
        disabled={!siftImpact.length || siftScore === null}
      >
        <div className={`text-xs`}>
          {siftImpact === "deleterious" ? (
            <div className={`${twIconStyles} bg-red-500`}>
              <div className={`mt-1`}>{"DH"}</div>
            </div>
          ) : siftImpact === "deleterious_low_confidence" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"DL"}</div>
            </div>
          ) : siftImpact === "tolerated" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"TO"}</div>
            </div>
          ) : siftImpact === "tolerated_low_confidence" ? (
            <div className={`${twIconStyles} bg-green-500`}>
              <div className={`mt-1`}>{"TL"}</div>
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-white`}>
              <div className={`mb-2`}>{"_"}</div>
            </div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`PolyPhen Impact: ${polyphenImpact} / PolyPhen Score: ${polyphenScore}`}
        disabled={!polyphenImpact.length || polyphenScore === null}
      >
        <div className={`text-xs`}>
          {polyphenImpact === "benign" ? (
            <div className={`${twIconStyles} bg-green-500`}>
              <div className={`mt-1`}>{"BE"}</div>
            </div>
          ) : polyphenImpact === "probably_damaging" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"PO"}</div>
            </div>
          ) : polyphenImpact === "uknown" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"UN"}</div>
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-white`}>
              <div className={`mb-2`}>{"_"}</div>
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export const createTableColumn = (
  accessor: string,
  width: number,
  partitionWidth: WidthSpring,
  visibleColumns: TableColumnState[],
  selectedMutations: Record<string, MutationsColumn>[],
  selectMutation: (geneId: string) => any,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    geneSymbol: string,
  ) => any,
  setMutationID: Dispatch<SetStateAction<string>>,
  mutationID: string,
): TableColumnDefinition => {
  // subrow position relative to first column
  const subrow =
    visibleColumns[0].id === accessor ? (
      <Subrow
        id={mutationID}
        width={width}
        query={useGetSomaticMutationTableSubrowQuery}
        subrowTitle={`Affected Cases Across The GDC`}
      />
    ) : null;
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
                      handleCheck={selectMutation}
                    />
                  )}
                  <>{!row.getCanExpand() && subrow}</>
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
                  <>{!row.getCanExpand() && subrow}</>
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
                      selected={row.original["survival"]}
                      handleSwitch={handleSurvivalPlotToggled}
                      tooltip={`Click icon to plot ${row.original["survival"].symbol}`}
                    />
                  )}
                  <>{!row.getCanExpand() && subrow}</>
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
                  <>
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={true}
                      tooltip={row.original["DNAChange"]}
                    />
                    <>{!row.getCanExpand() && subrow}</>
                  </>
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
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <>
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                    {row.getCanExpand() && (
                      <div className={`text-center`}>
                        <button
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
                            twStyles={`bg-red-500 rounded-md h-3 w-3`}
                          />
                        </button>
                      </div>
                    )}
                  </>
                  <>{!row.getCanExpand() && subrow}</>
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
              const [numerator, slash, denominator, fraction] = row.original[
                "affectedCasesInCohort"
              ]?.split(" ") ?? ["0", "", "", ""];

              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <>
                      <TableCell
                        row={row}
                        accessor={accessor}
                        anchor={false}
                        tooltip={""}
                      />
                      <PercentageBar
                        numerator={numerator}
                        denominator={denominator}
                        scale={width / visibleColumns?.length ?? 80}
                      />
                    </>
                  )}
                  <>{!row.getCanExpand() && subrow}</>
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
                  <>{!row.getCanExpand() && subrow}</>
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
                    <Consequence consequence={row.original["consequences"]} />
                  )}
                  <>{!row.getCanExpand() && subrow}</>
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
                    <Impact impact={row.original["impact"]} />
                  )}
                  <>{!row.getCanExpand() && subrow}</>
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
                    <>{!row.getCanExpand() && subrow}</>
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
  const splitStr = mutationSubType.split(" ");
  const operation = splitStr[splitStr.length - 1];
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
  affectedCasesInCohort: string;
  affectedCasesAcrossTheGDC: string;
  survival: Survival;
  impact: Impacts;
  subRows: string;
  ssmsTotal: number;
};

export const getMutation = (
  sm: SingleSomaticMutation,
  selectedSurvivalPlot: Record<string, string>,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
): SomaticMutation => {
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
  console.log("sm", sm);
  return {
    select: sm.ssm_id,
    mutationID: sm.ssm_id,
    DNAChange: sm.genomic_dna_change,
    type: filterMutationType(sm.mutation_subtype),
    consequences: {
      consequenceType: consequence_type,
    },
    proteinChange: {
      symbol: gene.symbol,
      aaChange: aa_change,
    },
    affectedCasesInCohort:
      sm.filteredOccurrences > 0
        ? `${sm.filteredOccurrences} / ${filteredCases} (${(
            (100 * sm.filteredOccurrences) /
            filteredCases
          ).toFixed(2)}%)`
        : `--`,
    affectedCasesAcrossTheGDC:
      sm.occurrence > 0
        ? `${sm.occurrence} / ${cases} (${(
            (100 * sm.occurrence) /
            cases
          ).toFixed(2)}%)`
        : `--`,
    cohort: {
      checked: true,
    },
    survival: {
      name: gene.name,
      symbol: gene.symbol,
      checked: gene.symbol == selectedSurvivalPlot?.symbol,
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
