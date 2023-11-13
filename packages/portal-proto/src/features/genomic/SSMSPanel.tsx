import React, { useCallback, useEffect } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import dynamic from "next/dynamic";
import partial from "lodash/partial";
import { LoadingOverlay } from "@mantine/core";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot";
import { emptySurvivalPlot } from "@/features/genomic/types";
import {
  useGeneAndSSMPanelData,
  useSelectFilterContent,
} from "@/features/genomic/hooks";
import { useScrollIntoView } from "@mantine/hooks";
import { SMTableContainer } from "../GenomicTables/SomaticMutationsTable/SMTableContainer";
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
  const toggledMutations = useDeepCompareMemo(
    () => currentMutations,
    [currentMutations],
  );
  const handleSsmToggled = useCallback(
    () =>
      partial(
        handleGeneAndSSmToggled,
        toggledMutations,
        "ssms.ssm_id",
        "mutationID",
      ),
    [handleGeneAndSSmToggled, toggledMutations],
  );

  /* Scroll for gene search */
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 500,
    duration: 1000,
  });

  useEffect(() => {
    // should happen only on mount
    if (searchTermsForGene) scrollIntoView();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Scroll for gene search end */

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
      <div ref={targetRef}>
        <SMTableContainer
          selectedSurvivalPlot={comparativeSurvival}
          handleSurvivalPlotToggled={handleSurvivalPlotToggled}
          genomicFilters={genomicFilters}
          cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
          handleSsmToggled={handleSsmToggled}
          toggledSsms={toggledMutations}
          isDemoMode={isDemoMode}
          isModal={true}
          searchTermsForGene={searchTermsForGene}
        />
      </div>
    </div>
  );
};
