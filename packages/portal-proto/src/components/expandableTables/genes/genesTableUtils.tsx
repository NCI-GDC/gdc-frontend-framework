import React, { Dispatch, SetStateAction } from "react";
import { Tooltip } from "@mantine/core";
import {
  IoMdTrendingDown as SurvivalIcon,
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import CheckboxSpring from "../shared/CheckboxSpring";
import SwitchSpring from "../shared/SwitchSpring";
import RatioSpring from "../shared/RatioSpring";
import { SelectedReducer, TableColumnDefinition } from "../shared/types";
import { AnnotationsIcon } from "../shared/sharedTableUtils";
import { TableCell, TableHeader } from "../shared/sharedTableCells";
import { Genes, SingleGene, Gene, GeneToggledHandler } from "./types";
import { SelectReducerAction } from "../shared/types";
import { Image } from "@/components/Image";
import { startCase } from "lodash";
import ToggledCheck from "@/components/expandableTables/shared/ToggledCheck";
import { entityMetadataType } from "src/utils/contexts";
import { FilterSet } from "@gff/core";

interface GeneCreateTableColumnProps {
  accessor: string;
  selectedGenes: SelectedReducer<Genes>;
  setSelectedGenes: Dispatch<SelectReducerAction<Genes>>;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  toggledGenes: ReadonlyArray<string>;
  setGeneID: Dispatch<SetStateAction<string>>;
  isDemoMode: boolean;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
  genomicFilters: FilterSet;
}

export const geneCreateTableColumn = ({
  accessor,
  selectedGenes,
  setSelectedGenes,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  toggledGenes,
  setGeneID,
  isDemoMode,
  setEntityMetadata,
  genomicFilters,
}: GeneCreateTableColumnProps): TableColumnDefinition => {
  switch (accessor) {
    case "select":
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
                className="flex justify-start"
              />
            ),
            cell: ({ row }) => {
              return (
                <>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={toggledGenes.includes(row.original?.geneID)}
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
                        handleGeneToggled({
                          geneID: row.original?.geneID,
                          symbol: row.original?.symbol,
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
                        margin="ml-0.5"
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
                <div className="flex justify-start">
                  {row.getCanExpand() && (
                    <RatioSpring index={0} item={{ numerator, denominator }} />
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
                tooltip={`# Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide.
                Expand to see breakdown by project`}
              />
            ),
            cell: ({ row }) => {
              const { numerator, denominator } = row?.original[
                "SSMSAffectedCasesAcrossTheGDC"
              ] ?? { numerator: 0, denominator: 1 };
              return (
                <div className="flex items-center gap-2">
                  {row.getCanExpand() && (
                    <div className="flex items-center">
                      <button
                        aria-label="expand or collapse subrow"
                        aria-expanded={row.getCanExpand() ? "true" : "false"}
                        {...{
                          onClick: () => {
                            setGeneID(row.original[`geneID`]);
                            row.toggleExpanded();
                          },
                          style: { cursor: "pointer" },
                        }}
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
                    <RatioSpring index={0} item={{ numerator, denominator }} />
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
                          <div key={`cytoband-${key}`} className="my-0.5">
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
                <>
                  {row.getCanExpand() && (
                    <span>
                      {row?.original["mutations"]?.toLocaleString("en-US") ??
                        ""}
                    </span>
                  )}
                </>
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
              const label = row.original[`${accessor}`]
                ? row.original[`${accessor}`]
                : "";
              return (
                <button
                  className="text-utility-link underline font-content"
                  onClick={() =>
                    setEntityMetadata({
                      entity_type: "genes",
                      entity_id: row.original?.geneID,
                      contextSensitive: true,
                      // TODO: rename
                      contextFilters: genomicFilters,
                    })
                  }
                >
                  {label}
                </button>
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
                <span>
                  {row.original[`${accessor}`]
                    ? row.original[`${accessor}`]
                    : ""}
                </span>
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
