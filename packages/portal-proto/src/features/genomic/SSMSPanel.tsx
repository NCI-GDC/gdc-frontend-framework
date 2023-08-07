import React from "react";
import dynamic from "next/dynamic";
import partial from "lodash/partial";
import { LoadingOverlay } from "@mantine/core";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot";
import { SMTableContainer } from "@/features/SomaticMutations/SMTableContainer";
import { emptySurvivalPlot } from "@/features/genomic/types";
import {
  useGeneAndSSMPanelData,
  useSelectFilterContent,
} from "@/features/genomic/hooks";
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

export const SSMSPanel = ({
  topGeneSSMSSuccess,
  comparativeSurvival,
  handleSurvivalPlotToggled,
  handleGeneAndSSmToggled,
  searchTermsForGene,
}: SSMSPanelProps): JSX.Element => {
  const {
    isDemoMode,
    cohortFilters,
    genomicFilters,
    overwritingDemoFilter,
    survivalPlotData,
    survivalPlotFetching,
    survivalPlotReady,
  } = useGeneAndSSMPanelData(comparativeSurvival, false);

  /**
   * Get the mutations in cohort
   */
  const currentMutations = useSelectFilterContent("ssms.ssm_id");

  return (
    <div className="flex flex-col w-100 mx-6 mb-8">
      <div className="bg-base-max relative">
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={
            survivalPlotFetching || (!survivalPlotReady && !topGeneSSMSSuccess)
          }
          zIndex={0}
        />
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
};
