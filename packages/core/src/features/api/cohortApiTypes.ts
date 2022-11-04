// models for cohort endpoints

// import { FilterSet } from "../cohort/filters";

export interface CohortModel {
  id: string;
  name: string;
  filters: any;
  type: string;
  case_ids: string[];
  data_release: {
    id: string;
  };
  modified: boolean; // flag which is set to true if modified and unsaved
  modifiedDate: string;
}

export type CohortAdd = Pick<CohortModel, "name" | "filters" | "type">;
export type CohortUpdate = Pick<
  CohortModel,
  "id" | "name" | "filters" | "type"
>;
