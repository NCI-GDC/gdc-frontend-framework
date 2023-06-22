import { Cohort } from "@gff/core";

export interface CohortManagerProps {
  readonly cohorts: Cohort[];
  onSelectionChanged: (string) => void;
  startingId: string;
}
