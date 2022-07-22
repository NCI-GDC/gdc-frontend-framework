import { NumericFromTo, Statistics, Buckets, Stats } from "@gff/core";
import { omitBy, some, capitalize } from "lodash";
import { CAPILIZED_TERMS } from "./constants";

export const parseFieldName = (
  field: string,
): { field_type: string; field_name: string } => {
  const parsed = field.split(".");
  return { field_type: parsed.at(-2), field_name: parsed.at(-1) };
};

export const filterUsefulFacets = (
  facets: Record<string, Buckets | Stats>,
): Record<string, Buckets | Stats> => {
  return omitBy(facets, (aggregation) =>
    some([
      (aggregation as Buckets).buckets &&
        (aggregation as Buckets).buckets.filter(
          (bucket: { key: string; doc_count: number }) =>
            bucket.key !== "_missing",
        ).length === 0,
      (aggregation as Stats).stats && (aggregation as Stats).stats.count === 0,
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

export const toDisplayName = (field: string): string => {
  return field
    .split("_")
    .map((w) => (CAPILIZED_TERMS.includes(w) ? w.toUpperCase() : capitalize(w)))
    .join(" ");
};
