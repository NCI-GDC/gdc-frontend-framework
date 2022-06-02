import { DataStatus } from "../../dataAccess";

export enum FacetBucketType {
  NotSet,
  Enum,
  Value,
}

export interface FacetBuckets {
  readonly status: DataStatus;
  readonly error?: string;
  readonly buckets?: Record<string, number>;
}

export type GQLDocType = "cases" | "files" | "genes" | "ssms";
export type GQLIndexType = "explore" | "repository";

export interface AllowableRange {
  readonly minimum?: string | number;
  readonly maximum?: string | number;
}

export interface FacetDefinition {
  readonly description: string;
  readonly field: string;
  readonly full: string;
  readonly type: string;
  readonly doc_type: string;
  readonly data_type?: string;
  readonly range?: AllowableRange;
}
