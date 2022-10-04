import { Cohort } from "@gff/core";

export interface CohortBarProps {
  readonly cohorts: Cohort[];
  onSelectionChanged: (string) => void;
  defaultId: string;
  hide_controls?: boolean;
}
