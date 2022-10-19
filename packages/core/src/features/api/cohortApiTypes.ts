// model for cohort endpoints

export interface DataRelease {
  id: string;
}

export interface CohortModel {
  id: string;
  name: string;
  filters: {};
  type: string;
  case_ids: string[];
  data_release: DataRelease;
}
