import { DataStatus } from "../../dataAcess";

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
