export interface GdcApiResponse {
  readonly data: GdcApiData;
  readonly warnings: Record<string, string>;
}

export type EsDocument = Record<string, any>;

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

export interface GdcApiData {
  readonly hits: ReadonlyArray<EsDocument>;
  readonly aggregations?: Record<string, Buckets>;
  readonly pagination: Pagination;
}

export const fetchFacetByName = async (name: string): Promise<GdcApiResponse> => {
  const response = await fetch(`https://api.gdc.cancer.gov/cases?size=0&facets=${name}`);
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
}