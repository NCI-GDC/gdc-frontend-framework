import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { isObject } from "../../ts-utils";
import { GqlOperation } from "./filters";
import "isomorphic-fetch";
import { GDC_API, GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "src/coreCreateApi";
import { caseSummaryDefaults } from "../cases/types";
import Queue from "queue";
import md5 from "blueimp-md5";

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
): Promise<GdcApiResponse<caseSummaryDefaults>> => {
  return fetchGdcEntities("cases", request);
};

export interface ProjectDefaults {
  readonly dbgap_accession_number: string;
  readonly disease_type: Array<string>;
  readonly name: string;
  readonly primary_site: Array<string>;
  readonly project_id: string;
  readonly summary?: {
    readonly case_count: number;
    readonly file_count: number;
    readonly file_size: number;
    readonly data_categories?: Array<{
      readonly case_count: number;
      readonly data_category: string;
      readonly file_count: number;
    }>;
    readonly experimental_strategies?: Array<{
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
  readonly project?: {
    readonly primary_site: Array<string>;
    readonly dbgap_accession_number: string;
    readonly project_id: string;
    readonly disease_type: Array<string>;
    readonly name: string;
    readonly releasable: boolean;
    readonly state: string;
    readonly released: boolean;
    readonly program?: {
      readonly name: string;
      readonly program_id: string;
      readonly dbgap_accession_number: string;
    };
  };
}

interface transcript {
  aa_change: string;
  aa_end: number;
  aa_start: number;
  annotation: {
    ccds: string;
    dbsnp_rs: string;
    existing_variation: string;
    hgvsc: string;
    polyphen_impact: string;
    polyphen_score: number;
    pubmed: string;
    sift_impact: string;
    sift_score: number;
    transcript_id: string;
    vep_impact: string;
  };
  is_canonical: boolean;
  transcript_id: string;
}
export interface SSMSDefaults {
  id: string;
  consequence: Array<{ transcript: transcript }>;
  clinical_annotations?: {
    civic: {
      variant_id: string;
    };
  };
  reference_allele: string;
  ncbi_build: string;
  cosmic_id: Array<string>;
  mutation_subtype: string;
  chromosome: string;
  genomic_dna_change: string;
}
export interface HistoryDefaults {
  readonly uuid: string;
  readonly version: string;
  readonly file_change: string;
  readonly release_date: string;
  readonly data_release: string;
}

export interface FileDefaults {
  readonly id?: string;
  readonly submitter_id: string;
  readonly access: string;
  readonly acl: ReadonlyArray<string>;
  readonly created_datetime: string;
  readonly updated_datetime: string;
  readonly data_category: string;
  readonly data_format: string;
  readonly data_release?: string;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly md5sum: string;
  readonly platform?: string;
  readonly state: string;
  readonly type: string;
  readonly version?: string;
  readonly experimental_strategy?: string;
  readonly annotations?: ReadonlyArray<{
    readonly annotation_id: string;
    readonly category: string;
    readonly classification: string;
    readonly created_datetime: string;
    readonly entity_id: string;
    readonly entity_submitter_id: string;
    readonly entity_type: string;
    readonly notes: string;
    readonly state: string;
    readonly status: string;
    readonly updated_datetime: string;
  }>;
  readonly cases?: ReadonlyArray<{
    readonly case_id: string;
    readonly submitter_id: string;
    readonly annotations?: ReadonlyArray<{
      readonly annotation_id: string;
    }>;
    readonly project?: {
      readonly dbgap_accession_number?: string;
      readonly disease_type: string;
      readonly name: string;
      readonly primary_site: string;
      readonly project_id: string;
      readonly releasable: boolean;
      readonly released: boolean;
      readonly state: string;
    };
    readonly samples?: ReadonlyArray<{
      readonly sample_id: string;
      readonly sample_type: string;
      readonly tissue_type: string;
      readonly submitter_id: string;
      readonly portions?: ReadonlyArray<{
        readonly submitter_id: string;
        readonly analytes?: ReadonlyArray<{
          readonly analyte_id: string;
          readonly analyte_type: string;
          readonly submitter_id: string;
          readonly aliquots?: ReadonlyArray<{
            readonly aliquot_id: string;
            readonly submitter_id: string;
          }>;
        }>;
        readonly slides?: ReadonlyArray<{
          readonly created_datetime: string | null;
          readonly number_proliferating_cells: number | null;
          readonly percent_eosinophil_infiltration: number | null;
          readonly percent_granulocyte_infiltration: number | null;
          readonly percent_inflam_infiltration: number | null;
          readonly percent_lymphocyte_infiltration: number | null;
          readonly percent_monocyte_infiltration: number | null;
          readonly percent_neutrophil_infiltration: number | null;
          readonly percent_necrosis: number | null;
          readonly percent_normal_cells: number | null;
          readonly percent_stromal_cells: number | null;
          readonly percent_tumor_cells: number | null;
          readonly percent_tumor_nuclei: number | null;
          readonly section_location: string | null;
          readonly slide_id: string | null;
          readonly state: string | null;
          readonly submitter_id: string | null;
          readonly updated_datetime: string | null;
        }>;
      }>;
    }>;
  }>;
  readonly associated_entities?: ReadonlyArray<{
    readonly entity_submitter_id: string;
    readonly entity_type: string;
    readonly case_id: string;
    readonly entity_id: string;
  }>;
  readonly analysis?: {
    readonly workflow_type: string;
    readonly updated_datetime: string;
    readonly input_files?: ReadonlyArray<{
      readonly file_name: string;
      readonly data_category: string;
      readonly data_type: string;
      readonly data_format: string;
      readonly file_size: number;
      readonly file_id: string;
      readonly state: string;
      readonly submitter_id: string;
      readonly access: string;
      readonly created_datetime: string;
      readonly updated_datetime: string;
      readonly md5sum: string;
    }>;
    readonly metadata?: {
      readonly read_groups: Array<{
        readonly read_group_id: string;
        readonly is_paired_end: boolean;
        readonly read_length: number;
        readonly library_name: string;
        readonly sequencing_center: string;
        readonly sequencing_date: string;
      }>;
    };
  };
  readonly downstream_analyses?: ReadonlyArray<{
    readonly workflow_type: string;
    readonly output_files?: ReadonlyArray<{
      readonly file_name: string;
      readonly data_category: string;
      readonly data_type: string;
      readonly data_format: string;
      readonly file_size: number;
      readonly file_id: string;
      readonly state: string;
      readonly submitter_id: string;
      readonly access: string;
      readonly created_datetime: string;
      readonly updated_datetime: string;
      readonly md5sum: string;
    }>;
  }>;
  readonly index_files?: ReadonlyArray<{
    readonly submitter_id: string;
    readonly created_datetime: string;
    readonly updated_datetime: string;
    readonly data_category: string;
    readonly data_format: string;
    readonly data_type: string;
    readonly file_id: string;
    readonly file_name: string;
    readonly file_size: number;
    readonly md5sum: string;
    readonly state: string;
  }>;
}

export interface GenesDefaults {
  readonly biotype: string;
  readonly symbol: string;
  readonly cytoband: ReadonlyArray<string>;
  readonly synonyms: ReadonlyArray<string>;
  readonly description: string;
  readonly canonical_transcript_id: string;
  readonly canonical_transcript_length: number;
  readonly canonical_transcript_length_cds: number;
  readonly canonical_transcript_length_genomic: string;
  readonly gene_chromosome: string;
  readonly gene_end: string;
  readonly gene_id: string;
  readonly gene_start: number;
  readonly gene_strand: string;
  readonly is_cancer_gene_census: boolean;
  readonly name: string;
}

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

export const endpointSlice = coreCreateApi({
  reducerPath: "entities",
  baseQuery: async ({
    request,
    endpoint,
    fetchAll = true,
  }: {
    request: GdcApiRequest;
    endpoint: gdcEndpoint;
    fetchAll?: boolean;
  }) => {
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
    getGenes: builder.query({
      query: ({
        request,
        fetchAll,
      }: {
        request: GdcApiRequest;
        fetchAll?: boolean;
      }) => ({
        request,
        endpoint: "genes",
        fetchAll,
      }),
      transformResponse: (response) => response.data.hits,
    }),
    getCases: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "cases",
      }),
      transformResponse: (response) => response.data.hits,
    }),
    getSsms: builder.query({
      query: ({
        request,
        fetchAll,
      }: {
        request: GdcApiRequest;
        fetchAll?: boolean;
      }) => ({
        request,
        endpoint: "ssms",
        fetchAll,
      }),
      transformResponse: (response) => response.data.hits,
    }),
    getCaseSsms: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "case_ssms",
      }),
      transformResponse: (response) => response.data.hits,
    }),
  }),
});

export const {
  useGetGenesQuery,
  useGetCasesQuery,
  useGetSsmsQuery,
  useGetCaseSsmsQuery,
} = endpointSlice;
export const endpointSliceMiddleware = endpointSlice.middleware as Middleware;
export const endpointSliceReducerPath: string = endpointSlice.reducerPath;
export const endpointReducer: Reducer = endpointSlice.reducer as Reducer;
