// model for cohort endpoints

import { FilterSet } from "../cohort";

export interface DataRelease {
  id: string;
}

export interface CohortModel {
  id: string;
  name: string;
  filters: FilterSet;
  type: string;
  case_ids: string[];
  data_release: DataRelease;
}
