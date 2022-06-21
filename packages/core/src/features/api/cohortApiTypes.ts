// model for cohort endpoints
export interface CohortModel {
  id: string;
  context_id: string;
  name: string;
  filters: ReadonlyArray<string>;
  frozen: boolean;
}

// model for context endpoints
export interface ContextModel {
  id: string;
  name: string;
}
