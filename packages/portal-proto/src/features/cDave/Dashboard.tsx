import { GqlOperation, useSurvivalPlotWithCohortFilters } from "@gff/core";
import { Grid } from "@mantine/core";
import SurvivalPlot from "../charts/SurvivalPlot";
import CDaveCard from "./CDaveCard";
import { result } from "lodash";

interface DashboardProps {
  readonly cohortFilters: GqlOperation;
  readonly activeFields: string[];
  readonly results: any;
  readonly updateFields: (field: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  cohortFilters,
  activeFields,
  results,
  updateFields,
}: DashboardProps) => {
  const { data: survivalData } = useSurvivalPlotWithCohortFilters({
    filters: cohortFilters,
  });

  console.log("dashboard", results);
  return (
    <Grid className="w-full">
      <Grid.Col span={6}>
        <SurvivalPlot data={survivalData} />
      </Grid.Col>
      {activeFields.map((field) => {
        return (
          <Grid.Col span={6} key={field}>
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
