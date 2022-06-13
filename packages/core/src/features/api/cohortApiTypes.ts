// model for cohort endpoints
export interface CohortModel {
  id: string;
  context_id: string;
  name: string;
  filters: ReadonlyArray<string>;
  frozen: boolean;
  counts: number;
}

// model for context endpoints
export interface ContextModel {
  id: string;
  name: string;
}
