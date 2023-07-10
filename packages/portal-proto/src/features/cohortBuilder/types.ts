import { Cohort } from "@gff/core";

export interface CohortManagerProps {
  readonly cohorts: Cohort[];
  onSelectionChanged: (id: string) => void;
  startingId: string;
}
