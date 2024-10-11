import { useState, useEffect } from "react";
import { Alert, LoadingOverlay } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  GqlOperation,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot/types";
import { getFormattedTimestamp } from "@/utils/date";
import { isInterval, parseContinuousBucket } from "../utils";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";
import { DEMO_COHORT_FILTERS } from "../constants";
import { ExternalDownloadStateSurvivalPlot } from "@/features/charts/SurvivalPlot/SurvivalPlot";

interface ClinicalSurvivalPlotProps {
  readonly field: string;
  readonly selectedSurvivalPlots: string[];
  readonly customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval;
  readonly continuous: boolean;
}

const ClinicalSurvivalPlot: React.FC<ClinicalSurvivalPlotProps> = ({
  field,
  selectedSurvivalPlots,
  customBinnedData,
  continuous,
}: ClinicalSurvivalPlotProps) => {
  const isDemoMode = useIsDemoApp();
  const [plotType, setPlotType] = useState(undefined);
  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
    ),
  );

  useEffect(() => {
    if (selectedSurvivalPlots.length === 0) {
      setPlotType(SurvivalPlotTypes.overall);
    } else {
      if (continuous) {
        setPlotType(SurvivalPlotTypes.continuous);
      } else {
        setPlotType(SurvivalPlotTypes.categorical);
      }
    }
  }, [selectedSurvivalPlots, continuous]);

  const filters =
    selectedSurvivalPlots.length === 0
      ? cohortFilters && [cohortFilters]
      : selectedSurvivalPlots.map((value) => {
          const content = [];
          if (cohortFilters) {
            content.push(cohortFilters);
          }

          if (continuous) {
            if (
              customBinnedData !== null &&
              !isInterval(customBinnedData as NamedFromTo[] | CustomInterval)
            ) {
              const dataPoint = (customBinnedData as NamedFromTo[]).find(
                (bin) => bin.name === value,
              );

              if (dataPoint !== undefined) {
                content.push({
                  op: ">=",
                  content: { field, value: [dataPoint.from] },
                });

                content.push({
                  op: "<",
                  content: { field, value: [dataPoint.to] },
                });
              }
            } else {
              const [fromValue, toValue] = parseContinuousBucket(value);

              content.push({
                op: ">=",
                content: { field, value: [fromValue] },
              });

              content.push({
                op: "<",
                content: { field, value: [toValue] },
              });
            }
          } else {
            if (typeof customBinnedData?.[value] === "object") {
              content.push({
                op: "=",
                content: { field, value: Object.keys(customBinnedData[value]) },
              });
            } else {
              content.push({
                op: "=",
                content: { field, value },
              });
            }
          }

          return {
            op: "and",
            content,
          } as GqlOperation;
        });

  const { data, isError, isFetching } = useGetSurvivalPlotQuery({
    filters,
  });

  return isError ? (
    <div className="h-64">
      <Alert color="red">Something&apos;s gone wrong</Alert>
    </div>
  ) : (
    <div className="relative">
      <LoadingOverlay visible={isFetching} />
      <ExternalDownloadStateSurvivalPlot
        data={data}
        height={150}
        title={""}
        field={field}
        names={selectedSurvivalPlots}
        plotType={plotType}
        downloadFileName={`${field
          .split(".")
          .at(-1)}-survival-plot.${getFormattedTimestamp()}`}
        tableTooltip
      />
    </div>
  );
};

export default ClinicalSurvivalPlot;
