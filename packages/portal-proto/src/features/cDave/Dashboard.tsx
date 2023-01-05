import { useEffect, useMemo, useRef } from "react";
import {
  GqlOperation,
  Buckets,
  Stats,
  usePrevious,
  useFacetDictionary,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { Card, Grid, Alert, Loader } from "@mantine/core";
import SurvivalPlot, { SurvivalPlotTypes } from "../charts/SurvivalPlot";
import CDaveCard from "./CDaveCard/CDaveCard";

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
  const {
    data: survivalData,
    isError,
    isFetching,
    isUninitialized,
  } = useGetSurvivalPlotQuery({
    filters: cohortFilters && [cohortFilters],
  });
  useFacetDictionary();

  useEffect(() => {
    if (lastDashboardRender) {
      initialDashboardRender.current = false;
    }
  });

  const [colCountInLastRow, colSpanInLastRow] = useMemo(() => {
    const colCount = activeFields.length + 1;
    const colCountInRow = controlsExpanded ? 2 : 3;
    const colCountInLastRow = colCount % colCountInRow;
    const colSpanInLastRow = colCountInLastRow
      ? 12 / colCountInLastRow
      : 12 / colCountInRow;
    return [colCountInLastRow, colSpanInLastRow];
  }, [activeFields, controlsExpanded]);

  return (
    <Grid className="w-full p-4">
      <Grid.Col span={controlsExpanded ? 6 : 4}>
        <Card className="h-full">
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
            />
          )}
        </Card>
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
            />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
