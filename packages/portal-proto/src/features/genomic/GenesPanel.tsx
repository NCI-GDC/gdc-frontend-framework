import { Grid, LoadingOverlay } from "@mantine/core";
import { GeneFrequencyChart } from "@/features/charts/GeneFrequencyChart";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot";
import React, { useCallback } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  ComparativeSurvival,
  emptySurvivalPlot,
} from "@/features/genomic/types";
import {
  useSelectFilterContent,
  useGeneAndSSMPanelData,
} from "@/features/genomic/hooks";
import dynamic from "next/dynamic";
import { GTableContainer } from "../GenomicTables/GenesTable/GTableContainer";

const SurvivalPlot = dynamic(() => import("../charts/SurvivalPlot"), {
  ssr: false,
});

interface GenesPanelProps {
  topGeneSSMSSuccess: boolean;
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
  topGeneSSMSSuccess,
  comparativeSurvival,
  handleSurvivalPlotToggled,
  handleGeneAndSSmToggled,
  handleMutationCountClick,
}: GenesPanelProps): JSX.Element => {
  const {
    isDemoMode,
    cohortFilters,
    genomicFilters,
    overwritingDemoFilter,
    survivalPlotData,
    survivalPlotFetching,
    survivalPlotReady,
  } = useGeneAndSSMPanelData(comparativeSurvival, true);

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
    <div className="flex flex-col w-100 mx-6">
      <Grid className="mx-2 bg-base-max">
        <Grid.Col span={6}>
          <GeneFrequencyChart
            marginBottom={95}
            genomicFilters={genomicFilters}
            cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
          />
        </Grid.Col>
        <Grid.Col span={6} className="relative">
          <LoadingOverlay
            zIndex={0}
            data-testid="loading-spinner"
            visible={
              survivalPlotFetching ||
              (!survivalPlotReady && !topGeneSSMSSuccess)
            }
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
        </Grid.Col>
      </Grid>
      <GTableContainer
        selectedSurvivalPlot={comparativeSurvival}
        handleSurvivalPlotToggled={handleSurvivalPlotToggled}
        handleGeneToggled={handleGeneToggled}
        toggledGenes={toggledGenes}
        genomicFilters={genomicFilters}
        cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
        isDemoMode={isDemoMode}
        handleMutationCountClick={handleMutationCountClick}
      />
    </div>
  );
};
