// models for cohort endpoints

import { GqlEquals } from "../gdcapi/filters";

export interface CohortModel {
  id: string;
  name: string;
  filters: GqlEquals;
  type: string;
  case_ids: string[];
  data_release: {
    id: string;
  };
}

export interface CohortAdd {
  name: string;
  filters: GqlEquals;
  type: string;
}

export interface CohortUpdate {
  id: string;
  name: string;
  filters: GqlEquals;
  type: string;
}
