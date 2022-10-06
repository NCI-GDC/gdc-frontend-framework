import { Cohort } from "@gff/core";

export interface CohortBarProps {
  readonly cohorts: Cohort[];
  onSelectionChanged: (string) => void;
  startingId: string;
  hide_controls?: boolean;
}
