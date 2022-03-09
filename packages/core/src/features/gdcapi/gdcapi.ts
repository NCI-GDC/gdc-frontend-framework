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
  // readonly pretty?: boolean;  // omitting this for now. machines don't need it
  readonly size?: number;
  readonly from?: number;
  readonly sortBy?: ReadonlyArray<SortBy>;
  readonly facets?: ReadonlyArray<string>;
}

export interface SortBy {
  readonly field: string;
  readonly direction: "asc" | "desc";
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

export interface FetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly gdcApiReq?: GdcApiRequest;
}

export const buildFetchError = async (
  res: Response,
  gdcApiReq?: GdcApiRequest,
): Promise<FetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    gdcApiReq,
  };
};

export const fetchGdcCasesMapping = async (): Promise<GdcApiMapping> => {
  const res = await fetch("https://api.gdc.cancer.gov/cases/_mapping");

  if (res.ok) {
    return res.json();
  }

  throw await buildFetchError(res);
};

export interface CaseDefaults {
  readonly case_id: string;
  readonly submitter_id: string;

  readonly consent_type?: string;
  readonly days_to_consent?: number;
  readonly days_to_lost_to_followup?: number;
  readonly disease_type?: string;
  readonly index_date?: string;
  readonly lost_to_followup?: string;
  readonly primary_site?: string;

  readonly aliquot_ids?: ReadonlyArray<string>;
  readonly analyte_ids?: ReadonlyArray<string>;
  readonly diagnosis_ids?: ReadonlyArray<string>;
  readonly portion_ids?: ReadonlyArray<string>;
  readonly sample_ids?: ReadonlyArray<string>;
  readonly slide_ids?: ReadonlyArray<string>;
  readonly submitter_aliquot_ids?: ReadonlyArray<string>;
  readonly submitter_analyte_ids?: ReadonlyArray<string>;
  readonly submitter_diagnosis_ids?: ReadonlyArray<string>;
  readonly submitter_portion_ids?: ReadonlyArray<string>;
  readonly submitter_sample_ids?: ReadonlyArray<string>;
  readonly submitter_slide_ids?: ReadonlyArray<string>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const fetchGdcCases = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<CaseDefaults>> => {
  return fetchGdcEntities("cases", request);
};

export interface ProjectDefaults {
  readonly dbgap_accession_number: string;
  readonly disease_type: ReadonlyArray<string>;
  readonly name: string;
  readonly primary_site: ReadonlyArray<string>;
  readonly project_id: string;
  readonly summary?: {
    readonly case_count: number;
    readonly file_count: number;
    readonly file_size: number;
    readonly data_categories?: ReadonlyArray<{
      readonly case_count: number;
      readonly data_category: string;
      readonly file_count: number;
    }>;
    readonly experimental_strategies?: ReadonlyArray<{
      readonly case_count: number;
      readonly experimental_strategy: string;
      readonly file_count: number;
    }>;
  };
  readonly program?: {
    readonly dbgap_accession_number: string;
    readonly name: string;
    readonly program_id: string;
  };
}

export interface AnnotationDefaults {
  readonly id: string;
  readonly entity_submitter_id: string;
  readonly notes: string;
  readonly submitter_id: string;
  readonly classification: string;
  readonly entity_id: string;
  readonly created_datetime: string;
  readonly annotation_id: string;
  readonly entity_type: string;
  readonly updated_datetime: string;
  readonly case_id: string;
  readonly state: string;
  readonly category: string;
  readonly case_submitter_id: string;
  readonly status: string;
}

export const fetchGdcProjects = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<ProjectDefaults>> => {
  return fetchGdcEntities("projects", request);
};

export const fetchGdcAnnotations = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<AnnotationDefaults>> => {
  return fetchGdcEntities("annotations", request);
};

export const fetchGdcEntities = async <T>(
  endpoint: string,
  request?: GdcApiRequest,
  paginate = false,
  previousHits : Record<string, any>[] = [],
): Promise<GdcApiResponse<T>> => {
  const res = await fetch(`https://api.gdc.cancer.gov/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
      fields: request?.fields?.join(","),
      expand: request?.expand?.join(","),
      sort: request?.sortBy
        ?.map((by) => `${by.field}:${by.direction}`)
        .join(","),
      facets: request?.facets?.join(","),
    }),
  });

  if (res.ok) {
    const resPromise = res.json();

    if (paginate) {
      let fullResponse = {} as GdcApiResponse<T>;

      const updatedPromise = await resPromise.then((responseData) => {
        fullResponse = {
          ...responseData,
          data: {
            hits: [
              ...previousHits,
              ...responseData?.data?.hits,
            ],
            pagination: responseData?.data?.pagination,
          },
        };
        return fullResponse;
      });

      if (
        fullResponse?.data?.pagination?.page != fullResponse?.data?.pagination?.pages
      ) {
        return fetchGdcEntities(
          endpoint,
          { ...request, from: (request?.from || 0) + (request?.size || 0) },
          true,
          [...fullResponse.data.hits],
        );
      }

      return updatedPromise;
    }

    return resPromise;
  }

  throw await buildFetchError(res, request);
};

/**
 * TODO
 * - use requested fields to define response shape.
 *   - use _mapping default as the default fields for a request
 *   - convert mapping field to nested structure
 * - add auth header
 */
