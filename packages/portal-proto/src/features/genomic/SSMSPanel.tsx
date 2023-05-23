import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import partial from "lodash/partial";
import { LoadingOverlay } from "@mantine/core";
import {
  buildCohortGqlOperator,
  FilterSet,
  joinFilters,
  selectCurrentCohortFilters,
  useCoreSelector,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot";
import { SMTableContainer } from "@/components/expandableTables/somaticMutations/SMTableContainer";
import { emptySurvivalPlot } from "@/features/genomic/types";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { useAppSelector } from "@/features/genomic/appApi";
import { selectGeneAndSSMFilters } from "@/features/genomic/geneAndSSMFiltersSlice";
import { overwritingDemoFilterMutationFrequency } from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";
import { useSelectFilterContent } from "@/features/genomic/hooks";
import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";

const SurvivalPlot = dynamic(() => import("../charts/SurvivalPlot"), {
  ssr: false,
});

interface SSMSPanelProps {
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
  searchTermsForGene: { geneId?: string; geneSymbol?: string };
}

export function SSMSPanel({
  topGeneSSMSSuccess,
  comparativeSurvival,
  handleSurvivalPlotToggled,
  handleGeneAndSSmToggled,
  searchTermsForGene,
}: SSMSPanelProps) {
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

  /**
   * Get genes in cohort
   */
  const currentMutations = useSelectFilterContent("ssms.ssm_id");

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
    <div className="flex flex-col w-100 mx-6 mb-8">
      <div className="bg-base-max">
        <LoadingOverlay visible={!survivalPlotReady && !topGeneSSMSSuccess} />
        <SurvivalPlot
          plotType={SurvivalPlotTypes.mutation}
          data={
            survivalPlotReady &&
            comparativeSurvival &&
            survivalPlotData.survivalData.length > 1
              ? survivalPlotData
              : emptySurvivalPlot
          }
          names={
            survivalPlotReady && comparativeSurvival
              ? [comparativeSurvival.name]
              : []
          }
        />
      </div>
      <SMTableContainer
        selectedSurvivalPlot={comparativeSurvival}
        handleSurvivalPlotToggled={handleSurvivalPlotToggled}
        genomicFilters={genomicFilters}
        cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
        handleSsmToggled={partial(
          handleGeneAndSSmToggled,
          currentMutations,
          "ssms.ssm_id",
          "mutationID",
        )}
        toggledSsms={currentMutations}
        isDemoMode={isDemoMode}
        isModal={true}
        searchTermsForGene={searchTermsForGene}
      />
    </div>
  );
}
