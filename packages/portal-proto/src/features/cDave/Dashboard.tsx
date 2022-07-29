import { useEffect, useRef } from "react";
import {
  GqlOperation,
  useSurvivalPlotWithCohortFilters,
  Buckets,
  Stats,
  usePrevious,
  useFacetDictionary,
} from "@gff/core";
import { Card, Grid } from "@mantine/core";
import SurvivalPlot from "../charts/SurvivalPlot";
import CDaveCard from "./CDaveCard";

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
  const { data: survivalData } = useSurvivalPlotWithCohortFilters({
    filters: cohortFilters && [cohortFilters],
  });
  useFacetDictionary();

  useEffect(() => {
    if (lastDashboardRender) {
      initialDashboardRender.current = false;
    }
  });
  return (
    <Grid className="w-full p-4" grow>
      <Grid.Col span={controlsExpanded ? 6 : 4}>
        <Card className="h-[580px]">
          <h2>Overall Survival</h2>
          <SurvivalPlot data={survivalData} title="" />
        </Card>
      </Grid.Col>
      {activeFields.map((field) => {
        return (
          <Grid.Col span={controlsExpanded ? 6 : 4} key={field}>
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
