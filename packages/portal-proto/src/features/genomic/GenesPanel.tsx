import React, { JSX, useCallback } from "react";
import { LoadingOverlay } from "@mantine/core";
import { GeneFrequencyChart } from "@/features/charts/GeneFrequencyChart";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot/types";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  ComparativeSurvival,
  emptySurvivalPlot,
} from "@/features/genomic/types";
import {
  useSelectFilterContent,
  useGenomicSurvivalPlot,
  useMutationFrequencyFilters,
} from "@/features/genomic/hooks";
import dynamic from "next/dynamic";
import { GenesTableContainer } from "../GenomicTables/GenesTable/GenesTableContainer";

const SurvivalPlot = dynamic(
  () => import("../charts/SurvivalPlot/SurvivalPlot"),
  {
    ssr: false,
  },
);

interface GenesPanelProps {
  comparativeSurvival: ComparativeSurvival;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneAndSSmToggled: (
    cohortStatus: string[],
    field: string,
    idField: string,
    payload: Record<string, any>,
  ) => void;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
}

export const GenesPanel = ({
  comparativeSurvival,
  handleSurvivalPlotToggled,
  handleGeneAndSSmToggled,
  handleMutationCountClick,
}: GenesPanelProps): JSX.Element => {
  const { cohortFilters, genomicFilters } = useMutationFrequencyFilters();

  const { survivalPlotData, survivalPlotReady, survivalPlotFetching } =
    useGenomicSurvivalPlot(comparativeSurvival, true);

  const currentGenes = useSelectFilterContent("genes.gene_id");
  const toggledGenes = useDeepCompareMemo(() => currentGenes, [currentGenes]);
  const handleGeneToggled = useCallback(
    (idAndSymbol: Record<string, any>) =>
      handleGeneAndSSmToggled(
        toggledGenes,
        "genes.gene_id",
        "geneID",
        idAndSymbol,
      ),
    [handleGeneAndSSmToggled, toggledGenes],
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 xl:gap-8 xl:flex-row bg-base-max mb-4">
        <div className="w-full xl:w-1/2 border border-base-lighter p-4">
          <GeneFrequencyChart
            marginBottom={95}
            genomicFilters={genomicFilters}
            cohortFilters={cohortFilters}
          />
        </div>
        <div className="w-full xl:w-1/2 relative border border-base-lighter p-4">
          <LoadingOverlay
            zIndex={0}
            data-testid="loading-spinner"
            visible={survivalPlotFetching}
          />
          <SurvivalPlot
            plotType={SurvivalPlotTypes.gene}
            data={
              survivalPlotReady && survivalPlotData.survivalData.length > 1
                ? survivalPlotData
                : emptySurvivalPlot
            }
            names={
              survivalPlotReady && comparativeSurvival
                ? [comparativeSurvival.symbol]
                : []
            }
            field="gene.symbol"
            tableTooltip
          />
        </div>
      </div>
      <GenesTableContainer
        selectedSurvivalPlot={comparativeSurvival}
        handleSurvivalPlotToggled={handleSurvivalPlotToggled}
        handleGeneToggled={handleGeneToggled}
        toggledGenes={toggledGenes}
        genomicFilters={genomicFilters}
        cohortFilters={cohortFilters}
        handleMutationCountClick={handleMutationCountClick}
      />
    </div>
  );
};
