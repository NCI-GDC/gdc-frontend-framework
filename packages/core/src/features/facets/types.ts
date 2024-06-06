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
  readonly requestId?: string;
}

export type GQLDocType =
  | "cases"
  | "files"
  | "genes"
  | "ssms"
  | "projects"
  | "annotations";
export type GQLIndexType = "explore" | "repository";

export interface AllowableRange {
  readonly minimum?: number;
  readonly maximum?: number;
}

export interface FacetDefinition {
  readonly description: string; //description from _mapping
  readonly field: string; // name of field minus "case", "file"
  readonly full: string; //  full name of filter (e.g. prepended with case.)
  readonly type: string; // type from mapping
  readonly doc_type: GQLDocType;
  readonly facet_type?: string; // classified type based on type + name: e.g. age, year, enumeration, etc
  readonly range?: AllowableRange; // range of value types
  readonly hasData?: boolean;
}

export type FacetTypes =
  | "enum"
  | "exact"
  | "range"
  | "age"
  | "age_in_years"
  | "year"
  | "years"
  | "days"
  | "percent"
  | "datetime"
  | "toggle";
