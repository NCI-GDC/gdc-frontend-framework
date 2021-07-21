export interface GdcApiResponse<H = EsDocument> {
  readonly data: GdcApiData<H>;
  readonly warnings: Record<string, string>;
}

export type EsDocument = Record<string, unknown>;

export interface Bucket {
  readonly doc_count: number;
  readonly key: string;
}

export interface Buckets {
  readonly buckets: ReadonlyArray<Bucket>;
}

export interface Pagination {
  readonly count: number;
  readonly total: number;
  readonly size: number;
  readonly from: number;
  readonly sort: number;
  readonly page: number;
  readonly pages: number;
}

export interface GdcApiData<H> {
  readonly hits: ReadonlyArray<H>;
  readonly aggregations?: Record<string, Buckets>;
  readonly pagination: Pagination;
}
