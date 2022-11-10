// models for cohort endpoints
export interface CohortModel {
  id: string;
  name: string;
  filters: any; // TODO Fix this
  type: string;
  case_ids: string[];
  data_release: {
    id: string;
  };
  created_datetime: string;
  modified_datetime: string;
}

export type CohortAdd = Pick<CohortModel, "name" | "filters" | "type">;
export type CohortUpdate = Pick<
  CohortModel,
  "id" | "name" | "filters" | "type"
>;
