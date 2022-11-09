import { Dispatch, SetStateAction } from "react";
import ToggleSpring from "../shared/ToggleSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import { animated } from "react-spring";
import CheckboxSpring from "../shared/CheckboxSpring";
import SwitchSpring from "../shared/SwitchSpring";
import {
  SelectedReducer,
  TableColumnDefinition,
  WidthSpring,
} from "../shared/types";
import { SurvivalIcon, AnnotationsIcon } from "../shared/sharedTableUtils";
import {
  TableCell,
  TableHeader,
  AffectedCases,
} from "../shared/sharedTableCells";
import { Genes, SingleGene, Gene } from "./types";
import { Tooltip } from "@mantine/core";
import { SelectReducerAction } from "../shared/types";

export const createTableColumn = (
  accessor: string,
  partitionWidth: WidthSpring,
  selectedGenes: SelectedReducer<Genes>,
  setSelectedGenes: Dispatch<SelectReducerAction<Genes>>,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    geneSymbol: string,
  ) => void,
  setGeneID: Dispatch<SetStateAction<string>>,
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
                      isActive={row.original["select"] in selectedGenes}
                      select={row}
                      handleCheck={setSelectedGenes}
                      multi={false}
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
    case "annotations":
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
                  className={`w-max mx-auto`}
                >
                  {row.getCanExpand() && (
                    <Tooltip label={"Cancer Gene Census"}>
                      <div className={`block m-auto w-max`}>
                        <AnnotationsIcon />
                      </div>
                    </Tooltip>
                  )}
                </animated.div>
              );
            },
          },
        ],
      };
    case "SSMSAffectedCasesInCohort":
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
                  "Breakdown of Affected Cases in Cohort # of Cases where Gene is mutated / # Cases tested for Simple Somatic Mutations"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <div className={`flex flex-col`}>
                    {row.getCanExpand() && (
                      <AffectedCases
                        ratio={
                          row?.original[`SSMSAffectedCasesInCohort`]?.split(" ")
                            ? row.original[`SSMSAffectedCasesInCohort`].split(
                                " ",
                              )
                            : [0, "", "", ""]
                        }
                      />
                    )}
                  </div>
                </animated.div>
              );
            },
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
            header: () => (
              <TableHeader
                title={accessor}
                tooltip={
                  "# of Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide | Expand to see breakdown by project"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <AffectedCases
                      ratio={
                        row?.original[`SSMSAffectedCasesAcrossTheGDC`]?.split(
                          " ",
                        )
                          ? row.original[`SSMSAffectedCasesAcrossTheGDC`].split(
                              " ",
                            )
                          : [0, "", "", ""]
                      }
                    />
                  )}
                  {row.getCanExpand() && (
                    <div className={`text-center content-center`}>
                      <button
                        aria-controls={`expandedSubrow`}
                        aria-expanded={row.getCanExpand() ? "true" : "false"}
                        {...{
                          onClick: () => {
                            setGeneID(row.original[`geneID`]);
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
    case "CNVGain":
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
                  "# of Cases where CNV gain events are observed in Gene / # of Cases tested for Copy Number Alteration in Gene"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                  )}
                </animated.div>
              );
            },
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
            header: () => (
              <TableHeader
                title={accessor}
                tooltip={
                  "# of Cases where CNV loss events are observed in Gene / # of Cases tested for Copy Number Alteration in Gene"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                  )}
                </animated.div>
              );
            },
          },
        ],
      };
    case "cytoband":
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
                  {row.getCanExpand() && (
                    <div className={`flex flex-col items-center`}>
                      {row.original["cytoband"].map((cytoband, key) => {
                        return (
                          <div
                            key={`cytoband-${key}`}
                            className={`my-0.5 text-xs`}
                          >
                            {cytoband}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </animated.div>
              );
            },
          },
        ],
      };
    case "mutations":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={accessor}
                tooltip={"# Simple Somatic Mutations in the Gene in Cohort"}
              />
            ),
            cell: ({ row }) => {
              return (
                <animated.div style={partitionWidth}>
                  <TableCell
                    row={row}
                    accessor={accessor}
                    anchor={false}
                    tooltip={""}
                  />
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
                  <TableCell
                    row={row}
                    accessor={accessor}
                    anchor={["symbol"].includes(accessor) ? true : false}
                    tooltip={""}
                  />
                </animated.div>
              );
            },
          },
        ],
      };
  }
};

export const getGene = (
  g: SingleGene,
  selectedSurvivalPlot: Record<string, string>,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  genesTotal: number,
): Gene => {
  return {
    select: g.gene_id,
    geneID: g.gene_id,
    survival: {
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    symbol: g.symbol,
    name: g.name,
    type: g.biotype,
    cytoband: g.cytoband,
    SSMSAffectedCasesInCohort:
      g.ssm_case > 0
        ? `${g.ssm_case} / ${filteredCases} (${(
            (100 * g.ssm_case) /
            filteredCases
          ).toFixed(2)}%)`
        : `0`,
    SSMSAffectedCasesAcrossTheGDC:
      g.ssm_case > 0
        ? `${g.ssm_case} / ${cases} (${((100 * g.ssm_case) / cases).toFixed(
            2,
          )}%)`
        : `0`,
    CNVGain:
      g.cnv_case > 0
        ? `${g.case_cnv_gain} / ${g.cnv_case} (${(
            (100 * g.case_cnv_gain) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    CNVLoss:
      g.cnv_case > 0
        ? `${g.case_cnv_loss} / ${g.cnv_case} (${(
            (100 * g.case_cnv_loss) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    genesTotal,
  };
};
