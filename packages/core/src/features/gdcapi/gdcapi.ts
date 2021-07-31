import { isObject } from "../../ts-utils";
import { GqlOperation } from "./filters";
import "isomorphic-fetch";

export type UnknownJson = Record<string, unknown>;
export interface GdcApiResponse<H = UnknownJson> {
  readonly data: GdcApiData<H>;
  readonly warnings: Record<string, string>;
}

export interface GdcApiData<H> {
  readonly hits: ReadonlyArray<H>;
  readonly aggregations?: Record<string, Buckets | Stats>;
  readonly pagination: Pagination;
}

export interface Buckets {
  readonly buckets: ReadonlyArray<Bucket>;
}

export interface Bucket {
  readonly doc_count: number;
  readonly key: string;
}

export interface Stats {
  readonly stats: Statistics;
}

export interface Statistics {
  readonly count: number;
  readonly min?: number;
  readonly max?: number;
  readonly avg?: number;
  readonly sum: number;
}

export interface Pagination {
  readonly count: number;
  readonly total: number;
  readonly size: number;
  readonly from: number;
  readonly sort: string;
  readonly page: number;
  readonly pages: number;
}

export const isBucketsAggregation = (
  aggregation: unknown,
): aggregation is Buckets => {
  return isObject(aggregation) && "buckets" in aggregation;
};

export const isStatsAggregation = (
  aggregation: unknown,
): aggregation is Stats => {
  return isObject(aggregation) && "stats" in aggregation;
};

export type gdcEndpoint =
  | "annotations"
  | "case_ssms"
  | "cases"
  | "cnv_occurrences"
  | "cnvs"
  | "files"
  | "genes"
  | "projects"
  | "ssm_occurrences"
  | "ssms";

export interface GdcApiRequest {
  readonly filters?: GqlOperation;
  readonly fields?: ReadonlyArray<string>;
  readonly expand?: ReadonlyArray<string>;
  readonly format?: "JSON" | "TSV" | "XML";
  readonly pretty?: boolean;
  readonly size?: number;
  readonly from?: number;
  readonly sort?: string;
  readonly facets?: ReadonlyArray<string>;
}

export interface GdcApiMapping {
  readonly _mapping: Record<string, FieldDetails>;
  readonly defaults: ReadonlyArray<string>;
  readonly expand: ReadonlyArray<string>;
  readonly fields: ReadonlyArray<string>;
  readonly multi: ReadonlyArray<string>;
  readonly nested: ReadonlyArray<string>;
}

export const FieldTypes = [
  "boolean",
  "double",
  "float",
  "id",
  "keyword",
  "long",
  "text",
] as const;
export type FieldType = typeof FieldTypes[number];

export interface FieldDetails {
  readonly description: string;
  readonly doc_type:
    | "annotations"
    | "case_centrics"
    | "cases"
    | "cnv_centrics"
    | "cnv_occurrence_centrics"
    | "files"
    | "gene_centric"
    | "projects"
    | "ssm_centrics"
    | "ssm_occurrence_centrics";
  readonly field: string;
  readonly full: string;
  readonly type: FieldType;
}

export const fetchGdcCasesMapping = async (): Promise<GdcApiMapping> => {
  const res = await fetch("https://api.gdc.cancer.gov/cases/_mapping");

  if (res.ok) {
    return res.json();
  }

  // TODO make a better error with request info
  throw Error(await res.text());
};

export const fetchGdcCases = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<unknown>> => {
  const res = await fetch("https://api.gdc.cancer.gov/cases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (res.ok) {
    return res.json();
  }

  // TODO make a better error with request info
  throw Error(await res.text());
};

/**
 * TODO
 * - use requested fields to define response shape.
 *   - use _mapping default as the default fields for a request
 *   - convert mapping field to nested structure
 */
