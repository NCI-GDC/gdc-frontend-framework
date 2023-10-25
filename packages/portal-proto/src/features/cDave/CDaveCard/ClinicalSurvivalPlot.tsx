import { useState, useEffect } from "react";
import { Loader, Alert } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  GqlOperation,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import SurvivalPlot, {
  SurvivalPlotTypes,
} from "@/features/charts/SurvivalPlot";
import { convertDateToString } from "@/utils/date";
import { isInterval } from "../utils";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";
import { DEMO_COHORT_FILTERS } from "../constants";

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
              const [fromValue, toValue] = value.split("-");

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

  const { data, isLoading, isError } = useGetSurvivalPlotQuery({ filters });

  return (
    <>
      <div className="h-64">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Alert color={"red"}>{"Something's gone wrong"}</Alert>
        ) : (
          <SurvivalPlot
            data={data}
            height={150}
            title={""}
            field={field}
            names={selectedSurvivalPlots}
            plotType={plotType}
            downloadFileName={`${field
              .split(".")
              .at(-1)}-survival-plot.${convertDateToString(new Date())}`}
          />
        )}
      </div>
    </>
  );
};

export default ClinicalSurvivalPlot;
