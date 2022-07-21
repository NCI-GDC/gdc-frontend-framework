import {
  GqlOperation,
  useSurvivalPlotWithCohortFilters,
  Buckets,
  Stats,
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
  const { data: survivalData } = useSurvivalPlotWithCohortFilters({
    filters: cohortFilters && [cohortFilters],
  });

  return (
    <Grid className="w-full p-4" grow>
      <Grid.Col span={controlsExpanded ? 6 : 4}>
        <Card className="h-[580px]">
          <SurvivalPlot data={survivalData} />
        </Card>
      </Grid.Col>
      {activeFields.map((field) => {
        return (
          <Grid.Col span={controlsExpanded ? 6 : 4} key={field}>
            <CDaveCard
              field={field}
              data={results}
              updateFields={updateFields}
            />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
