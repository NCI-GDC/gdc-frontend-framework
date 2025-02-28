import { isObject } from "src/ts-utils";
import { Buckets, FetchError, GdcApiRequest, Stats } from "./types";

export const DEFAULT_CHUNK_SIZE = 10;

export const isBucketsAggregation = (
  aggregation: unknown,
): aggregation is Buckets => {
  return !!aggregation && isObject(aggregation) && "buckets" in aggregation;
};

export const isStatsAggregation = (
  aggregation: unknown,
): aggregation is Stats => {
  return !!aggregation && isObject(aggregation) && "stats" in aggregation;
};

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
