import { animated, useSpring } from "react-spring";
import ToggleSpring from "../shared/ToggleSpring";
import SwitchSpring from "../shared/SwitchSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  TableColumnState,
  TableCell,
  TableHeader,
  SurvivalIcon,
} from "../shared/types";
import { SomaticMutation } from "./types";
import CheckboxSpring from "../shared/CheckboxSpring";
import { Survival } from "../shared/types";
import { SMSubrow } from "./SMSubRow";
import { Tooltip } from "@mantine/core";

export interface MConsequence {
  consequenceType: string;
  symbol: string;
  aaChange: string;
}

export const Consequence = ({
  consequence,
}: {
  consequence: MConsequence;
}): JSX.Element => {
  const { consequenceType, symbol, aaChange } = consequence;
  const fc = consequenceType.split("_")[0] ? consequenceType.split("_")[0] : ``;
  const formatConsequence = fc
    ? fc?.charAt(0).toUpperCase() + fc?.slice(1)
    : ``;
  return (
    <>
      <div className={`flex flex-row w-max m-auto text-xs`}>
        <span className={`mx-0.5 font-bold`}>{formatConsequence}</span>
        <span className={`mx-0.5`}>{symbol}</span>
        <span className={`mx-0.5`}>{aaChange}</span>
      </div>
    </>
  );
};

const Impact = ({ row, accessor }) => {
  const { polyphenImpact, polyphenScore, siftImpact, siftScore, vepImpact } =
    row.original[`${accessor}`];
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

export const convertMutationFilter = (mutationId: string) => {
  return {
    filters_mutation: {
      content: [
        {
          content: {
            field: "ssms.ssm_id",
            value: [mutationId],
          },
          op: "in",
        },
        {
          content: {
            field: "cases.gene.ssm.observation.observation_id",
            value: "MISSING",
          },
          op: "NOT",
        },
      ],
    },
  };
};

export const createTableColumn = (
  accessor: string,
  width: number,
  partitionWidth: any,
  visibleColumns: TableColumnState[],
  selectedMutations: any, // todo: add type,
  selectMutation: (geneId: string) => any,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    geneSymbol: string,
  ) => any,
  setMutationID,
  mutationID,
) => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <div>
                  <div className={`content-center`}>
                    {row.getCanExpand() && (
                      <CheckboxSpring
                        isActive={row.original["select"] in selectedMutations}
                        select={row}
                        handleCheck={selectMutation}
                        wSpring={partitionWidth}
                      />
                    )}
                  </div>
                  <>
                    <SMSubrow
                      mutationId={mutationID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></SMSubrow>
                  </>
                </div>
              );
            },
            footer: (props) => props.column.id,
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
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row, getValue }) => {
              return (
                <>
                  {row.getCanExpand() && (
                    // <Tooltip
                    //   label={`Click icon to plot ${row.original["survival"].symbol}`}
                    // >
                    <SwitchSpring
                      isActive={row.original["survival"].checked}
                      icon={<SurvivalIcon />}
                      selected={row.original["survival"]}
                      handleSwitch={handleSurvivalPlotToggled}
                    />
                    // </Tooltip>
                  )}
                  {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                    <div className={`relative`}>
                      {/* <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases> */}
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
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <>
                    <TableCell row={row} accessor={accessor} />
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
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        {/* <GeneAffectedCases
                            geneId={row.value}
                            width={width}
                            opening={row.getCanExpand()}
                          ></GeneAffectedCases> */}
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
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
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <TableCell row={row} accessor={accessor} />
                  )}
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        {/* <GeneAffectedCases
                            geneId={row.value}
                            width={width}
                            opening={row.getCanExpand()}
                          ></GeneAffectedCases> */}
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
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
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {/* {row.getCanExpand() && (
                      <TableCell row={row} accessor={accessor} />
                    )} */}
                  {row.getCanExpand() && (
                    <Consequence consequence={row.original["consequences"]} />
                  )}
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        {/* <GeneAffectedCases
                                  geneId={row.value}
                                  width={width}
                                  opening={row.getCanExpand()}
                                ></GeneAffectedCases> */}
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
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
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <Impact row={row} accessor={accessor} />
                  )}
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        {/* <GeneAffectedCases
                                geneId={row.value}
                                width={width}
                                opening={row.getCanExpand()}
                              ></GeneAffectedCases> */}
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
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
            header: () => <TableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div style={partitionWidth}>
                  <>
                    <TableCell row={row} accessor={accessor} />
                    <>
                      {!row.getCanExpand() &&
                        visibleColumns[0].id === accessor && (
                          <div className={`relative`}>
                            {/* <GeneAffectedCases
                                geneId={row.value}
                                width={width}
                                opening={row.getCanExpand()}
                              ></GeneAffectedCases> */}
                          </div>
                        )}
                    </>
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
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
  consequences: MConsequence;
  affectedCasesInCohort: string;
  affectedCasesAcrossTheGDC: string;
  survival: Survival;
  impact: string;
  subRows: string;
  ssmsTotal: number;
};

export const getMutation = (
  sm: SomaticMutation,
  selectedSurvivalPlot: Record<string, string>,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
) => {
  const { gene, annotation, aa_change, consequence_type } = sm.consequence[0];
  return {
    select: sm.ssm_id,
    mutationID: sm.ssm_id,
    DNAChange: sm.genomic_dna_change,
    type: filterMutationType(sm.mutation_subtype),
    consequences: {
      consequenceType: consequence_type,
      symbol: gene.symbol,
      aaChange: aa_change,
    },
    affectedCasesInCohort:
      sm.filteredOccurences > 0
        ? `${sm.filteredOccurences} / ${filteredCases} (${(
            (100 * sm.filteredOccurences) /
            filteredCases
          ).toFixed(2)}%)`
        : `--`,
    affectedCasesAcrossTheGDC:
      sm.occurence > 0
        ? `${sm.occurence} / ${cases} (${((100 * sm.occurence) / cases).toFixed(
            2,
          )}%)`
        : `--`,
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
