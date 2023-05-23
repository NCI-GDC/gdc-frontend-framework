import {
  buildCohortGqlOperator,
  FilterSet,
  joinFilters,
  selectCurrentCohortFilters,
  useCoreSelector,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { Grid, LoadingOverlay } from "@mantine/core";
import { GeneFrequencyChart } from "@/features/charts/GeneFrequencyChart";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot";
import { GTableContainer } from "@/components/expandableTables/genes/GTableContainer";
import partial from "lodash/partial";
import React, { useMemo } from "react";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { useAppSelector } from "@/features/genomic/appApi";
import { selectGeneAndSSMFilters } from "@/features/genomic/geneAndSSMFiltersSlice";
import { overwritingDemoFilterMutationFrequency } from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";
import { emptySurvivalPlot } from "@/features/genomic/types";
import { useSelectFilterContent } from "@/features/genomic/hooks";
import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";
import dynamic from "next/dynamic";

const SurvivalPlot = dynamic(() => import("../charts/SurvivalPlot"), {
  ssr: false,
});

interface GenesPanelProps {
  topGeneSSMSSuccess: boolean;
  comparativeSurvival: Record<string, string>;
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
  const isDemoMode = useIsDemoApp();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );
  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const currentGenes = useSelectFilterContent("genes.gene_id");

  const filters = useMemo(
    () =>
      buildCohortGqlOperator(
        joinFilters(
          isDemoMode ? overwritingDemoFilter : cohortFilters,
          genomicFilters,
        ),
      ),

    [isDemoMode, cohortFilters, overwritingDemoFilter, genomicFilters],
  );

  const f = useMemo(
    () =>
      buildGeneHaveAndHaveNotFilters(
        filters,
        comparativeSurvival?.symbol,
        comparativeSurvival?.field,
      ),
    [comparativeSurvival?.field, comparativeSurvival?.symbol, filters],
  );

  const { data: survivalPlotData, isSuccess: survivalPlotReady } =
    useGetSurvivalPlotQuery({
      filters: comparativeSurvival !== undefined ? f : filters ? [filters] : [],
    });

  return (
    <div className="flex flex-col w-100 mx-6">
      <Grid className="mx-2 bg-base-max">
        <Grid.Col span={6}>
          <GeneFrequencyChart
            marginBottom={95}
            genomicFilters={genomicFilters}
            isDemoMode={isDemoMode}
            overwritingDemoFilter={overwritingDemoFilter}
          />
        </Grid.Col>
        <Grid.Col span={6} className="relative">
          <LoadingOverlay visible={!survivalPlotReady && !topGeneSSMSSuccess} />
          <SurvivalPlot
            plotType={SurvivalPlotTypes.mutation}
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
          />
        </Grid.Col>
      </Grid>
      <GTableContainer
        selectedSurvivalPlot={comparativeSurvival}
        handleSurvivalPlotToggled={handleSurvivalPlotToggled}
        handleGeneToggled={partial(
          handleGeneAndSSmToggled,
          currentGenes,
          "genes.gene_id",
          "geneID",
        )}
        toggledGenes={currentGenes}
        genomicFilters={genomicFilters}
        cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
        isDemoMode={isDemoMode}
        handleMutationCountClick={handleMutationCountClick}
      />
    </div>
  );
};
