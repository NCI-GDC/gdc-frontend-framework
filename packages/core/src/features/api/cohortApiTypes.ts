// models for cohort endpoints

import { GqlIntersection, GqlUnion } from "../gdcapi/filters";

export interface CohortModel {
  id: string;
  name: string;
  filters: GqlIntersection | GqlUnion;
  type: string;
  case_ids: string[];
  data_release: {
    id: string;
  };
}

export type CohortAdd = Pick<CohortModel, "name" | "filters" | "type">;
export type CohortUpdate = Pick<
  CohortModel,
  "id" | "name" | "filters" | "type"
>;
