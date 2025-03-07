import type { Middleware, Reducer } from "@reduxjs/toolkit";
import "isomorphic-fetch";
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
  GdcApiResponse,
  GdcApiData,
  GdcApiMapping,
  GdcApiRequest,
  EndpointRequestProps,
} from "./types";
import serializeQueryArgsWithDataRelease from "src/serializeQueryArgs";
import { buildFetchError, DEFAULT_CHUNK_SIZE } from "./utils";
import { GDC_API, GDC_APP_API_AUTH } from "src/constants";

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
  useLazyGetCasesQuery,
  useGetSsmsQuery,
  useGetCaseSsmsQuery,
  useGetAnnotationsQuery,
} = endpointSlice;
export const endpointSliceMiddleware = endpointSlice.middleware as Middleware;
export const endpointSliceReducerPath: string = endpointSlice.reducerPath;
export const endpointReducer: Reducer = endpointSlice.reducer as Reducer;
