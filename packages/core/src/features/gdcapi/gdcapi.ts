import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { isObject } from "../../ts-utils";
import { GqlOperation } from "./filters";
import "isomorphic-fetch";
import { GDC_API, GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "src/coreCreateApi";
import Queue from "queue";
import md5 from "blueimp-md5";
import {
  CaseDefaults,
  ProjectDefaults,
  AnnotationDefaults,
  SSMSDefaults,
  FileDefaults,
  HistoryDefaults,
  GenesDefaults,
} from "./types";
import serializeQueryArgsWithDataRelease from "src/serializeQueryArgs";

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
  | "history"
  | "case_ssms"
  | "cases"
  | "cnv_occurrences"
  | "cnvs"
  | "files"
  | "genes"
  | "projects"
  | "ssm_occurrences"
  | "ssms";

/**
 * The request for requesting data from the GDC API
 * @property filters - A FilterSet object
 * @property fields - An array of fields to return
 * @property size - The number of cases to return
 * @property from - The offset from which to return cases
 * @property sortBy - An array of fields to sort by
 * @property facets - An array of fields to facet by
 * @property expand - An array of fields to expand
 * @property format - The format of the response
 * @property pretty - Whether to pretty print the response
 * @category GDC API
 */
export interface GdcApiRequest {
  readonly filters?: GqlOperation;
  readonly case_filters?: GqlOperation;
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
    | "history"
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
  const res = await fetch(`${GDC_API}/cases/_mapping`);

  if (res.ok) {
    return res.json();
  }

  throw await buildFetchError(res);
};

export const fetchGdcCases = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<CaseDefaults>> => {
  return fetchGdcEntities("cases", request);
};

/**
 * Fetches GDC projects from the GDC REST API
 * @param request - GDC API request
 * @returns GDC API response
 * @category GDC API
 */
export const fetchGdcProjects = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<ProjectDefaults>> => {
  return fetchGdcEntities("projects", request);
};

/**
 * Fetches Annotations from the GDC REST API
 * @param request - GDC API request
 * @returns GDC API response
 * @category GDC API
 */
export const fetchGdcAnnotations = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<AnnotationDefaults>> => {
  return fetchGdcEntities("annotations", request);
};

/**
 * Fetches SSM data from the GDC REST API
 * @param request - GDC API request
 * @returns GDC API response
 * @category GDC API
 */
export const fetchGdcSsms = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<SSMSDefaults>> => {
  return fetchGdcEntities("ssms", request);
};

/**
 * Fetches Files data from the GDC REST API
 * @param request - GDC API request
 * @returns GDC API response
 * @category GDC API
 */
export const fetchGdcFiles = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<FileDefaults>> => {
  return fetchGdcEntities("files", request);
};

const DEFAULT_CHUNK_SIZE = 10;

/**
 * Fetches GDC entities from the GDC REST API
 * @param endpoint - GDC API endpoint
 * @param request - GDC API request
 * @param fetchAll - fetch all results in batches of DEFAULT_CHUNK_SIZE
 * @returns GDC API response
 * @category GDC API
 */
export const fetchGdcEntities = async <T extends Record<string, any>>(
  endpoint: string,
  request?: GdcApiRequest,
  fetchAll = false,
): Promise<GdcApiResponse<T>> => {
  const chunkSize = request?.size ?? DEFAULT_CHUNK_SIZE;

  const res = await fetch(`${GDC_APP_API_AUTH}/${endpoint}`, {
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
      from: request?.from || 0,
      size: chunkSize,
    }),
  });

  if (res.ok) {
    const resData: GdcApiResponse<T> = await res.json();
    const queue = Queue({ concurrency: 6 });
    let { hits } = resData.data;

    if (fetchAll) {
      for (
        let count = chunkSize;
        count < (resData?.data?.pagination?.total || 0);
        count += chunkSize
      ) {
        queue.push((callback) => {
          const newHash = md5(JSON.stringify(request));
          fetch(`${GDC_APP_API_AUTH}/${endpoint}?hash=${newHash}`, {
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
              from: count,
              size: chunkSize,
            }),
          }).then(async (res) => {
            const data: GdcApiResponse<T> = await res.json();
            hits = [...hits, ...data.data.hits];
            if (callback) {
              callback();
            }
          });
        });
      }
    }

    return new Promise((resolve, reject) => {
      queue.start((err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            ...resData,
            data: { ...resData.data, hits },
          });
        }
      });
    });
  }

  throw await buildFetchError(res, request);
};

/**
 * Fetches the history of a GDC entity from the GDC REST API
 * @param uuid - GDC API request
 * @returns GDC API response
 * @category GDC API
 */
export const getGdcHistory = async (
  uuid: string,
): Promise<ReadonlyArray<HistoryDefaults>> => {
  return getGdcInstance("history", uuid);
};

export const getGdcInstance = async <T>(
  endpoint: string,
  uuid: string,
): Promise<ReadonlyArray<T>> => {
  // TODO: make sure if we need AUTH API here or not
  const res = await fetch(`${GDC_API}/${endpoint}/${uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json();
  }

  throw await buildFetchError(res);
};

/**
 * TODO
 * - use requested fields to define response shape.
 *   - use _mapping default as the default fields for a request
 *   - convert mapping field to nested structure
 * - add auth header
 */

export interface EndpointRequestProps {
  readonly request: GdcApiRequest;
  readonly fetchAll?: boolean;
}

export const endpointSlice = coreCreateApi({
  reducerPath: "entities",
  serializeQueryArgs: serializeQueryArgsWithDataRelease,
  baseQuery: async ({
    request,
    endpoint,
    fetchAll,
  }: EndpointRequestProps & { endpoint: string }) => {
    let results;

    try {
      results = await fetchGdcEntities(endpoint, request, fetchAll);
    } catch (e) {
      return { error: e };
    }

    return { data: results };
  },
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getGenes: builder.query<GdcApiData<GenesDefaults>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
        request,
        endpoint: "genes",
        fetchAll,
      }),
      transformResponse: (response: GdcApiResponse<GenesDefaults>) =>
        response.data,
    }),
    getCases: builder.query<GdcApiData<CaseDefaults>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
        request,
        endpoint: "cases",
        fetchAll,
      }),
      transformResponse: (response: GdcApiResponse<CaseDefaults>) =>
        response.data,
    }),
    getSsms: builder.query<GdcApiData<SSMSDefaults>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
        request,
        endpoint: "ssms",
        fetchAll,
      }),
      transformResponse: (response: GdcApiResponse<SSMSDefaults>) =>
        response.data,
    }),
    getCaseSsms: builder.query({
      query: ({ request, fetchAll = false }) => ({
        request,
        endpoint: "case_ssms",
        fetchAll,
      }),
      transformResponse: (response) => response.data,
    }),
    getAnnotations: builder.query<
      GdcApiData<AnnotationDefaults>,
      EndpointRequestProps
    >({
      query: ({ request, fetchAll = false }) => ({
        request,
        endpoint: "annotations",
        fetchAll,
      }),
      transformResponse: (response: GdcApiResponse<AnnotationDefaults>) =>
        response.data,
    }),
  }),
});

export const {
  useGetGenesQuery,
  useGetCasesQuery,
  useGetSsmsQuery,
  useGetCaseSsmsQuery,
  useGetAnnotationsQuery,
} = endpointSlice;
export const endpointSliceMiddleware = endpointSlice.middleware as Middleware;
export const endpointSliceReducerPath: string = endpointSlice.reducerPath;
export const endpointReducer: Reducer = endpointSlice.reducer as Reducer;
