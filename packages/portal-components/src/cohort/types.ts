export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: Record<string, any>;
  readonly modified?: boolean;
  readonly modified_datetime: string;
  readonly saved?: boolean;
}
