import { Cohort } from "@gff/core";

interface CohortManagerCmd {
  command: string;
  args: string;
}
export interface CohortManagerProps {
  readonly cohorts: Cohort[];
  onSelectionChanged: (string) => void;
  startingId: string;
  hide_controls?: boolean;
  cohortAction?: CohortManagerCmd;
}
