import { NumericFromTo, Statistics } from "@gff/core";
import { omitBy, some } from "lodash";

export const parseFieldName = (field: string) => {
  const parsed = field.split(".");
  return { field_type: parsed.at(-2), field_name: parsed.at(-1) };
};

export const filterUsefulFacets = (
  facets: Record<string, any>,
): Record<string, any> => {
  return omitBy(facets, (aggregation) =>
    some([
      aggregation.buckets &&
        aggregation.buckets.filter(
          (bucket: { key: string; doc_count: number }) =>
            bucket.key !== "_missing",
        ).length === 0,
      aggregation.count === 0,
      aggregation.count === null,
      aggregation.stats && aggregation.stats.count === 0,
    ]),
  );
};

export const createBuckets = (stats: Statistics): NumericFromTo[] => {
  if (stats.count === 1) {
    return [{ from: stats.min, to: stats.max + 1 }];
  }
  const interval = (stats.max - stats.min) / 5;
  return Array.from({ length: 5 }, (_, i) => ({
    from: i * interval + stats.min,
    to: i + 1 === 5 ? stats.max + 1 : stats.min + (i + 1) * interval,
  }));
};
