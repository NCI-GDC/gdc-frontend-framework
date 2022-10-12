import { animated, useSpring } from "react-spring";
import ToggleSpring from "../shared/ToggleSpring";
import SwitchSpring from "../shared/SwitchSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  TableColumnState,
  TableCell,
  TableHeader,
  SurvivalIcon,
  AnnotationsIcon,
} from "../shared/types";
import { SomaticMutation } from "./types";
import CheckboxSpring from "../shared/CheckboxSpring";
import { Survival } from "../shared/types";
import { SMSubrow } from "./SMSubRow";

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

export const convertMutationFilter = (mutationId: string) => {
  console.log("mutationId", mutationId);
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
              //<Tooltip label={`Click icon to plot ${value.symbol}`}>
              //          </Tooltip> */}
              return (
                <>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={row.original["survival"].checked}
                      icon={<SurvivalIcon />}
                      selected={row.original["survival"]}
                      handleSwitch={handleSurvivalPlotToggled}
                    />
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
                    // <TableCell row={row} accessor={accessor} />
                    <button
                      onClick={() =>
                        console.log("impact", row.original["impact"])
                      }
                    >
                      impact
                    </button>
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
  // console.log("sm", sm);
  return {
    select: sm.ssm_id,
    mutationID: sm.ssm_id,
    DNAChange: sm.genomic_dna_change,
    type: filterMutationType(sm.mutation_subtype),
    consequences: {
      consequenceType: sm.consequence[0].consequence_type,
      symbol: sm.consequence[0].gene.symbol,
      aaChange: sm.consequence[0].aa_change,
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
      name: sm.consequence[0].gene.name,
      symbol: sm.consequence[0].gene.symbol,
      checked: sm.consequence[0].gene.symbol == selectedSurvivalPlot?.symbol,
    },
    impact: {}, // todo
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    ssmsTotal,
  };
};
