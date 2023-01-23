import React, { Dispatch, SetStateAction } from "react";
import ToggleSpring from "../shared/ToggleSpring";
import { Tooltip } from "@mantine/core";
import { MdKeyboardArrowDown } from "react-icons/md";
import CheckboxSpring from "../shared/CheckboxSpring";
import SwitchSpring from "../shared/SwitchSpring";
import RatioSpring from "../shared/RatioSpring";
import { SelectedReducer, TableColumnDefinition } from "../shared/types";
import { AnnotationsIcon } from "../shared/sharedTableUtils";
import { IoMdTrendingDown as SurvivalIcon } from "react-icons/io";
import { TableCell, TableHeader } from "../shared/sharedTableCells";
import { Genes, SingleGene, Gene, GeneToggledHandler } from "./types";
import { SelectReducerAction } from "../shared/types";
import { Image } from "@/components/Image";
import { startCase } from "lodash";
import Link from "next/link";
import ToggledCheck from "@/components/expandableTables/shared/ToggledCheck";

export const createTableColumn = (
  accessor: string,
  selectedGenes: SelectedReducer<Genes>,
  setSelectedGenes: Dispatch<SelectReducerAction<Genes>>,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void,
  handleGeneToggled: GeneToggledHandler,
  toggledGenes: ReadonlyArray<string>,
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
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip={""}
                className="ml-1 mr-2"
              />
            ),
            cell: ({ row }) => {
              return (
                <div className="ml-1.5 mr-2">
                  {/* todo: make select/toggle columns fixed smaller width */}
                  {row.getCanExpand() && (
                    <CheckboxSpring
                      isActive={row.original["select"] in selectedGenes}
                      select={row}
                      handleCheck={setSelectedGenes}
                      multi={false}
                    />
                  )}
                </div>
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
              <TableHeader
                title={startCase(accessor)}
                tooltip={""}
                className="mx-3"
              />
            ),
            cell: ({ row }) => {
              return (
                <>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={toggledGenes.includes(row.original?.geneID)}
                      margin={`my-0.5 ml-0`}
                      icon={
                        <Image
                          src={"/user-flow/icons/cohort-dna.svg"}
                          width={16}
                          height={16}
                        />
                      }
                      selected={row.original["cohort"]}
                      handleSwitch={() =>
                        handleGeneToggled({
                          geneID: row.original?.geneID,
                          symbol: row.original?.symbol,
                        })
                      }
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
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip={""}
                className="mr-3"
              />
            ),
            cell: ({ row }) => {
              if (row.depth > 0) {
                // this is an expanded row
                return null;
              }

              const { numerator } = row?.original[
                "SSMSAffectedCasesInCohort"
              ] ?? { numerator: 0 };
              const disabled = numerator < 10;
              const selected = row.original["survival"];
              const isActive = selected.checked;
              const tooltip = disabled
                ? `Not enough data`
                : isActive
                ? `Click to remove ${selected.symbol} from plot`
                : `Click to plot ${selected.symbol}`;
              // NOTE: If button is disabled then tooltips will not show up
              // https://floating-ui.com/docs/react#disabled-elements
              return (
                <>
                  {row.getCanExpand() && (
                    <Tooltip
                      label={`${tooltip}`}
                      disabled={!tooltip || tooltip.length == 0}
                      withArrow
                      arrowSize={6}
                      transition="fade"
                      transitionDuration={200}
                      multiline
                      classNames={{
                        tooltip:
                          "bg-base-lightest text-base-contrast-max font-heading text-bold text-left",
                      }}
                    >
                      <ToggledCheck
                        margin="mt-[0.42em] ml-0.5"
                        isActive={row.original["survival"].checked}
                        icon={<SurvivalIcon size={24} />}
                        selected={row.original["survival"]}
                        handleSwitch={handleSurvivalPlotToggled}
                        survivalProps={{ plot: "gene.symbol" }}
                        tooltip={tooltip}
                        disabled={disabled}
                      />
                    </Tooltip>
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
            header: () => (
              <TableHeader title={startCase(accessor)} tooltip={""} />
            ),
            cell: ({ row }) => {
              return (
                <div>
                  {row.getCanExpand() && (
                    <Tooltip label={"Cancer Gene Census"}>
                      <div className={`block m-auto w-max`}>
                        {row.original["annotations"] && <AnnotationsIcon />}
                      </div>
                    </Tooltip>
                  )}
                </div>
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
                title={`# SSM Affected Cases
               in Cohort`}
                className="flex flex-row justify-start mr-2 "
                tooltip={`Breakdown of Affected Cases in Cohort:
                # Cases where Gene is mutated / # Cases tested for Simple Somatic Mutations`}
              />
            ),
            cell: ({ row }) => {
              const { numerator, denominator } = row?.original[
                "SSMSAffectedCasesInCohort"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className={`flex flex-row justify-start`}>
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
    case "SSMSAffectedCasesAcrossTheGDC":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={`# SSM Affected Cases
                 Across the GDC`}
                className="flex flex-row justify-start mx-4"
                tooltip={`# Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide.
                Expand to see breakdown by project`}
              />
            ),
            cell: ({ row }) => {
              const { numerator, denominator } = row?.original[
                "SSMSAffectedCasesAcrossTheGDC"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className="flex flex-row justify-between flex-nowrap items-center">
                  {row.getCanExpand() && (
                    <RatioSpring
                      index={0}
                      item={{ numerator, denominator }}
                      orientation="horizontal"
                    />
                  )}
                  {row.getCanExpand() && (
                    <div className="text-center content-center mr-6">
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
                            <MdKeyboardArrowDown size="0.75em" color="white" />
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
    case "CNVGain":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title={`# ${startCase(accessor)}`}
                className="flex flex-row justify-start mr-8"
                tooltip={
                  "# Cases where CNV gain events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <div className={`content-center`}>
                  {row.getCanExpand() && (
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                  )}
                </div>
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
                title={`# ${startCase(accessor)}`}
                className="flex flex-row justify-start mr-2"
                tooltip={
                  "# Cases where CNV loss events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
                }
              />
            ),
            cell: ({ row }) => {
              return (
                <div className={`content-center`}>
                  {row.getCanExpand() && (
                    <TableCell
                      row={row}
                      accessor={accessor}
                      anchor={false}
                      tooltip={""}
                    />
                  )}
                </div>
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
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip={""}
                className="mx-4 whitespace-nowrap"
              />
            ),
            cell: ({ row }) => {
              return (
                <div>
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
                </div>
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
                title="# Mutations"
                tooltip={
                  "# Unique Simple Somatic Mutations in the Gene in Cohort"
                }
                className="w-20"
              />
            ),
            cell: ({ row }) => {
              return (
                <div>
                  {row.getCanExpand() && (
                    <div className="text-center text-xs">
                      {row?.original["mutations"]?.toLocaleString("en-US") ??
                        ""}
                    </div>
                  )}
                </div>
              );
            },
          },
        ],
      };
    case "symbol":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title="Symbol"
                tooltip=""
                className="flex flex-row justify-start w-14 mr-2"
              />
            ),
            cell: ({ row }) => {
              return (
                <Link href={`/genes/${row.original?.geneID}`}>
                  <a className="text-utility-link underline text-sm">
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
    case "name":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => (
              <TableHeader
                title="Name"
                tooltip=""
                className="flex flex-row justify-start lg:w-100 md:w-32 sm:w-16"
              />
            ),
            cell: ({ row }) => {
              return (
                <div className={`text-xs`}>
                  {row.original[`${accessor}`]
                    ? row.original[`${accessor}`]
                    : ""}
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
            header: () => (
              <TableHeader
                title={startCase(accessor)}
                tooltip={""}
                className="w-fit"
              />
            ),
            cell: ({ row }) => {
              return (
                <div className="flex flex-row justify-start">
                  <TableCell
                    row={row}
                    accessor={accessor}
                    anchor={["symbol"].includes(accessor)}
                    tooltip={""}
                  />
                </div>
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
  cnvCases: number,
  genesTotal: number,
): Gene => {
  return {
    select: g.gene_id,
    geneID: g.gene_id,
    survival: {
      label: g.symbol,
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    cohort: {
      checked: true,
    },
    symbol: g.symbol,
    name: g.name,
    type: g.biotype,
    cytoband: g.cytoband,
    SSMSAffectedCasesInCohort: {
      numerator: g.numCases,
      denominator: filteredCases,
    },
    SSMSAffectedCasesAcrossTheGDC: {
      numerator: g.ssm_case,
      denominator: cases,
    },
    CNVGain:
      cnvCases > 0
        ? `${g.case_cnv_gain.toLocaleString()} / ${cnvCases.toLocaleString()} (${(
            (100 * g.case_cnv_gain) /
            cnvCases
          ).toFixed(2)}%)`
        : `--`,
    CNVLoss:
      cnvCases > 0
        ? `${g.case_cnv_loss.toLocaleString()} / ${cnvCases.toLocaleString()} (${(
            (100 * g.case_cnv_loss) /
            cnvCases
          ).toFixed(2)}%)`
        : `--`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
    // do not remove subRows key, It's needed for row.getCanExpand() to be true
    subRows: " ",
    genesTotal,
  };
};
