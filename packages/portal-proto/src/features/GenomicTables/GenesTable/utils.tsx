// This table can be found at /analysis_page?app=MutationFrequencyApp
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Gene, GeneToggledHandler, columnFilterType } from "./types";
import { Dispatch, SetStateAction, useMemo, useId } from "react";
import { Checkbox, Tooltip } from "@mantine/core";
import {
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { entityMetadataType } from "@/utils/contexts";
import { FilterSet, GeneRowInfo } from "@gff/core";
import { CountButton } from "@/components/CountButton/CountButton";
import { HeaderTooltip } from "@/components/Table/HeaderTooltip";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import CohortCreationButton from "@/components/CohortCreationButton";
import { GenesTableCohort, GenesTableSurvival } from "./TableComponents";
import NumeratorDenominator from "@/components/NumeratorDenominator";
import AnnotationsIcon from "./AnnotationsIcon";
import RatioWithSpring from "@/components/RatioWithSpring";
import { ComparativeSurvival } from "@/features/genomic/types";

export const useGenerateGenesTableColumns = ({
  handleSurvivalPlotToggled,
  handleGeneToggled,
  toggledGenes,
  isDemoMode,
  setEntityMetadata,
  cohortFilters,
  genomicFilters,
  generateFilters,
  handleMutationCountClick,
  currentPage,
  totalPages,
}: {
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  toggledGenes: ReadonlyArray<string>;
  isDemoMode: boolean;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
  cohortFilters: FilterSet;
  genomicFilters: FilterSet;
  generateFilters: (type: columnFilterType, geneId: string) => FilterSet;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
  currentPage: number;
  totalPages: number;
}): ColumnDef<Gene>[] => {
  const componentId = useId();
  const genesTableColumnHelper = useMemo(() => createColumnHelper<Gene>(), []);
  console.log({ cohortFilters }, "table");

  const genesTableDefaultColumns = useMemo<ColumnDef<Gene>[]>(
    () => [
      genesTableColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            size="xs"
            classNames={{
              input: "checked:bg-accent checked:border-accent",
              label: "sr-only",
            }}
            label={`Select all gene rows on page ${currentPage} of ${totalPages}`}
            {...{
              checked: table.getIsAllRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size="xs"
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
            aria-label={row.original.symbol}
            {...{
              checked: row.getIsSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
        enableHiding: false,
      }),
      genesTableColumnHelper.display({
        id: "cohort",
        header: () => (
          <HeaderTooltip
            title="Cohort"
            tooltip="Add/remove mutated (SSM/CNV) genes to/from your cohort filters"
          />
        ),
        cell: ({ row }) => (
          <GenesTableCohort
            toggledGenes={toggledGenes}
            geneID={row.original.gene_id}
            isDemoMode={isDemoMode}
            cohort={row.original.cohort}
            handleGeneToggled={handleGeneToggled}
            symbol={row.original.symbol}
          />
        ),
      }),
      genesTableColumnHelper.display({
        id: "survival",
        header: () => (
          <HeaderTooltip
            title="Survival"
            tooltip="Change the survival plot display"
          />
        ),
        cell: ({ row }) => (
          <GenesTableSurvival
            SSMSAffectedCasesInCohort={
              row.original["#_ssm_affected_cases_in_cohort"]
            }
            survival={row.original.survival}
            handleSurvivalPlotToggled={handleSurvivalPlotToggled}
            symbol={row.original.symbol}
          />
        ),
      }),
      genesTableColumnHelper.accessor("gene_id", {
        id: "gene_id",
        header: "Gene ID",
      }),
      genesTableColumnHelper.display({
        id: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <PopupIconButton
            handleClick={() =>
              setEntityMetadata({
                entity_type: "genes",
                entity_id: row.original.gene_id,
                contextSensitive: true,
                contextFilters: genomicFilters,
              })
            }
            label={row.original.symbol}
            ariaId={`${componentId}-genes-table-${row.original.gene_id}`}
          />
        ),
      }),
      genesTableColumnHelper.accessor("name", {
        id: "name",
        header: "Name",
      }),
      genesTableColumnHelper.display({
        id: "cytoband",
        header: "Cytoband",
        cell: ({ row }) => (
          <div className="flex flex-col items-center">
            {row.original.cytoband.map((cytoband, key) => {
              return (
                <div key={`cytoband-${key}`} className="my-0.5">
                  {cytoband}
                </div>
              );
            })}
          </div>
        ),
      }),
      genesTableColumnHelper.accessor("type", {
        id: "type",
        header: "Type",
      }),
      genesTableColumnHelper.display({
        id: "#_ssm_affected_cases_in_cohort",
        header: () => (
          <HeaderTooltip
            title={`# SSM Affected Cases
          in Cohort`}
            tooltip={`Breakdown of Affected Cases in Cohort:
           # Cases where Gene is mutated / # Cases tested for Simple Somatic Mutations`}
          />
        ),
        cell: ({ row }) => (
          <CohortCreationButton
            label={
              <NumeratorDenominator
                numerator={
                  row.original["#_ssm_affected_cases_in_cohort"].numerator
                }
                denominator={
                  row.original["#_ssm_affected_cases_in_cohort"].denominator
                }
                boldNumerator={true}
              />
            }
            numCases={row.original["#_ssm_affected_cases_in_cohort"].numerator}
            filters={generateFilters("ssmaffected", row.original.gene_id)}
            caseFilters={cohortFilters}
            createStaticCohort
          />
        ),
      }),
      genesTableColumnHelper.display({
        id: "#_ssm_affected_cases_across_the_gdc",
        header: () => (
          <HeaderTooltip
            title={`# SSM Affected Cases
          Across the GDC`}
            tooltip={`# Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide.
         Expand to see breakdown by project`}
          />
        ),
        cell: ({ row }) => {
          const { numerator, denominator } = row?.original[
            "#_ssm_affected_cases_across_the_gdc"
          ] ?? { numerator: 0, denominator: 1 };
          return (
            <div
              className={`flex items-center gap-2 ${
                numerator !== 0 && "cursor-pointer"
              }`}
            >
              {numerator !== 0 && row.getCanExpand() && (
                <div className="flex items-center">
                  {!row.getIsExpanded() ? (
                    <DownIcon size="1.25em" className="text-accent" />
                  ) : (
                    <UpIcon size="1.25em" className="text-accent" />
                  )}
                </div>
              )}
              {row.getCanExpand() && (
                <RatioWithSpring index={0} item={{ numerator, denominator }} />
              )}
            </div>
          );
        },
      }),
      genesTableColumnHelper.display({
        id: "#_cnv_gain",
        header: () => (
          <HeaderTooltip
            title="# CNV Gain"
            tooltip={
              "# Cases where CNV gain events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
            }
          />
        ),
        cell: ({ row }) => {
          const { numerator, denominator } = row.original["#_cnv_gain"] ?? {
            numerator: 0,
            denominator: 1,
          };
          return (
            <CohortCreationButton
              label={
                <NumeratorDenominator
                  numerator={numerator}
                  denominator={denominator}
                  boldNumerator={true}
                />
              }
              numCases={numerator}
              filters={generateFilters("cnvgain", row.original.gene_id)}
              caseFilters={cohortFilters}
              createStaticCohort
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: "#_cnv_loss",
        header: () => (
          <HeaderTooltip
            title="# CNV Loss"
            tooltip={
              "# Cases where CNV loss events are observed in Gene / # Cases tested for Copy Number Alterations in Gene"
            }
          />
        ),
        cell: ({ row }) => {
          const { numerator, denominator } = row.original["#_cnv_loss"] ?? {
            numerator: 0,
            denominator: 1,
          };
          return (
            <CohortCreationButton
              label={
                <NumeratorDenominator
                  numerator={numerator}
                  denominator={denominator}
                  boldNumerator={true}
                />
              }
              numCases={numerator}
              filters={generateFilters("cnvloss", row.original.gene_id)}
              caseFilters={cohortFilters}
              createStaticCohort
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: "#_mutations",
        header: () => (
          <HeaderTooltip
            title="# Mutations"
            tooltip="# Unique Simple Somatic Mutations in the Gene in Cohort"
          />
        ),
        cell: ({ row }) => {
          const count = row.original["#_mutations"] ?? 0;
          const disabled = count === 0;
          return (
            <CountButton
              tooltipLabel={
                count === 0
                  ? `No SSMs in ${row?.original?.symbol}`
                  : `Search the mutations table for ${row?.original?.symbol}`
              }
              disabled={disabled}
              handleOnClick={() => {
                handleMutationCountClick(
                  row?.original?.gene_id ?? "",
                  row?.original?.symbol ?? "",
                );
              }}
              count={count !== 0 ? parseInt(count.replace(/,/g, ""), 10) : 0}
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: "annotations",
        header: "Annotations",
        cell: ({ row }) => (
          <Tooltip label="Cancer Gene Census">
            <span>
              {row.original.annotations && (
                <AnnotationsIcon label={"Cancer Gene Census"} />
              )}
            </span>
          </Tooltip>
        ),
      }),
    ],
    [
      genesTableColumnHelper,
      setEntityMetadata,
      genomicFilters,
      handleGeneToggled,
      handleMutationCountClick,
      isDemoMode,
      toggledGenes,
      generateFilters,
      handleSurvivalPlotToggled,
      componentId,
      currentPage,
      totalPages,
      cohortFilters,
    ],
  );

  return genesTableDefaultColumns;
};

export const getGene = (
  g: GeneRowInfo,
  selectedSurvivalPlot: ComparativeSurvival,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  cnvCases: number,
): Gene => {
  return {
    gene_id: g.gene_id,
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
    "#_ssm_affected_cases_in_cohort": {
      numerator: g.numCases,
      denominator: filteredCases,
    },
    "#_ssm_affected_cases_across_the_gdc": {
      numerator: g.ssm_case,
      denominator: cases,
    },
    "#_cnv_gain": {
      numerator: g.case_cnv_gain,
      denominator: cnvCases,
    },
    "#_cnv_loss": {
      numerator: g.case_cnv_loss,
      denominator: cnvCases,
    },
    "#_mutations": mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
  };
};
