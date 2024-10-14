import { useEffect, useRef } from "react";
import { Grid, Alert, Loader } from "@mantine/core";
import {
  GqlOperation,
  Buckets,
  Stats,
  usePrevious,
  useFacetDictionary,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { convertDateToString } from "@/utils/date";
import SurvivalPlot from "../charts/SurvivalPlot/SurvivalPlot";
import CDaveCard from "./CDaveCard/CDaveCard";
import { useDeepCompareMemo } from "use-deep-compare";
import { SurvivalPlotTypes } from "../charts/SurvivalPlot/types";

interface DashboardProps {
  readonly cohortFilters: GqlOperation;
  readonly activeFields: string[];
  readonly results: Record<string, Buckets | Stats>;
  readonly updateFields: (field: string) => void;
  readonly controlsExpanded: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  cohortFilters,
  activeFields,
  results,
  updateFields,
  controlsExpanded,
}: DashboardProps) => {
  const initialDashboardRender = useRef(true);
  const lastDashboardRender = usePrevious(initialDashboardRender);
  const filters = useDeepCompareMemo(
    () => cohortFilters && [cohortFilters],
    [cohortFilters],
  );
  const {
    data: survivalData,
    isError,
    isFetching,
    isUninitialized,
  } = useGetSurvivalPlotQuery({
    filters,
  });
  useFacetDictionary();

  useEffect(() => {
    if (lastDashboardRender) {
      initialDashboardRender.current = false;
    }
  });

  const [colCountInLastRow, colSpanInLastRow] = useDeepCompareMemo(() => {
    const colCount = activeFields.length + 1;
    const colCountInRow = controlsExpanded ? 2 : 3;
    const colCountInLastRow = colCount % colCountInRow;
    const colSpanInLastRow = colCountInLastRow
      ? 12 / colCountInLastRow
      : 12 / colCountInRow;
    return [colCountInLastRow, colSpanInLastRow];
  }, [activeFields, controlsExpanded]);

  return (
    <Grid className="w-full m-0">
      <Grid.Col span={controlsExpanded ? 6 : 4}>
        <div
          data-testid="overall-survival-plot"
          className="h-full shadow-md rounded-lg p-2"
        >
          <h2 className="font-heading font-medium">Overall Survival</h2>
          {isError ? (
            <Alert>{"Something's gone wrong"}</Alert>
          ) : isFetching || isUninitialized ? (
            <Loader />
          ) : (
            <SurvivalPlot
              data={survivalData}
              title=""
              plotType={SurvivalPlotTypes.overall}
              downloadFileName={`overall-survival-plot.${convertDateToString(
                new Date(),
              )}`}
            />
          )}
        </div>
      </Grid.Col>
      {activeFields.map((field, index) => {
        const isLastRow = index >= activeFields.length - colCountInLastRow;
        const colSpan = isLastRow ? colSpanInLastRow : controlsExpanded ? 6 : 4;
        return (
          <Grid.Col span={colSpan} key={field}>
            <CDaveCard
              field={field}
              data={results[field]}
              updateFields={updateFields}
              initialDashboardRender={initialDashboardRender.current}
              cohortFilters={cohortFilters}
            />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
