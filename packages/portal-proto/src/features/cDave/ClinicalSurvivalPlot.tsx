import { useState, useEffect } from "react";
import { Loader, Alert } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  GqlOperation,
  useGetSurvivalPlotQuery,
} from "@gff/core";

import SurvivalPlot, { SurvivalPlotTypes } from "../charts/SurvivalPlot";
import { isInterval } from "./utils";
import { CategoricalBins, CustomInterval, NamedFromTo } from "./types";

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
  const [plotType, setPlotType] = useState(undefined);
  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(selectCurrentCohortFilters(state)),
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

              content.push({
                op: ">=",
                content: { field, value: [dataPoint.from] },
              });

              content.push({
                op: "<",
                content: { field, value: [dataPoint.to] },
              });
            } else {
              const [fromValue, toValue] = value.split(" to <");

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
          />
        )}
      </div>
    </>
  );
};

export default ClinicalSurvivalPlot;
