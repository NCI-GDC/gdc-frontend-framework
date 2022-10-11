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
                      <></>
                      // <CheckboxContainer
                      //   isActive={row.original["select"] in selectedGenes}
                      //   select={row}
                      //   handleCheck={selectMutation}
                      //   width={width / visibleColumns.length}
                      //   wSpring={partitionWidth}
                      // />
                    )}
                  </div>
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
    case "annotations":
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
                  className={`w-max mx-auto`}
                >
                  {row.getCanExpand() && (
                    <div className={`block m-auto w-max`}>
                      <AnnotationsIcon />
                    </div>
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
    case "SSMSAffectedCasesAcrossTheGDC":
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
                            onClick: row.getToggleExpandedHandler(),
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
    case "CNVGain":
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
    case "CNVLoss":
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

export const getMutation = (
  sm: SomaticMutation,
  selectedSurvivalPlot: Record<string, string>,
  // mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
) => {
  console.log("sm", sm);
  return {
    select: sm.ssm_id,

    //   select: sm.gene_id,
    //   mutationID: sm.gene_id,
    //   survival: {
    //     name: sm.name,
    //     symbol: sm.symbol,
    //     checked: sm.symbol == selectedSurvivalPlot?.symbol,
    //   },
    //   symbol: sm.symbol,
    //   name: sm.name,
    //   affectedCasesInCohort:
    //     sm.cnv_case > 0
    //       ? `${sm.cnv_case + " / " + filteredCases} (${(
    //           (100 * sm.cnv_case) /
    //           filteredCases
    //         ).toFixed(2)}%)`
    //       : `0`,
    //   affectedCasesAcrossTheGDC:
    //     sm.ssm_case > 0
    //       ? `${sm.ssm_case + " / " + cases} (${(
    //           (100 * sm.ssm_case) /
    //           cases
    //         ).toFixed(2)}%)`
    //       : `0`,
    //   CNVsmain:
    //     sm.cnv_case > 0
    //       ? `${sm.case_cnv_smain + " / " + sm.cnv_case} (${(
    //           (100 * sm.case_cnv_smain) /
    //           sm.cnv_case
    //         ).toFixed(2)}%)`
    //       : `--`,
    //   CNVLoss:
    //     sm.cnv_case > 0
    //       ? `${sm.case_cnv_loss + " / " + sm.cnv_case} (${(
    //           (100 * sm.case_cnv_loss) /
    //           sm.cnv_case
    //         ).toFixed(2)}%)`
    //       : `--`,
    //   mutations: mutationCounts[sm.ssms_id],
    //   annotations: sm.is_cancer_gene_census,
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    ssmsTotal,
  };
};
