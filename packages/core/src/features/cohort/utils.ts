import { FilterSet } from "./filters";
import { isIntersectionOrUnion, Operation } from "../gdcapi/filters";

export const defaultCohortNameGenerator = (): string =>
  `Custom cohort ${new Date()
    .toLocaleString("en-CA", {
      timeZone: "America/Chicago",
      hour12: false,
    })
    .replace(",", "")}`;

/**
This function takes a FilterSet object and a prefix string as input.
It filters the root property of the FilterSet object and returns a
new FilterSet object that only contains filters with field names
that start with the specified prefix.

Example Usage

const filterSet: FilterSet = {
  root: {
    field1: Operation.Equals,
    field2: Operation.GreaterThan,
    field3: Operation.LessThan,
  },
  mode: "and",
};

const prefix = "field";

const filteredFilterSet = extractFiltersWithPrefixFromFilterSet(filterSet, prefix);

console.log(filteredFilterSet);
// Output: { root: { field1: Operation.Equals, field2: Operation.GreaterThan, field3: Operation.LessThan }, mode: "and" }

 @param {FilterSet} fs - The FilterSet object to filter
 @param {string} prefix - The prefix to filter by
 @returns {FilterSet} - A new FilterSet object that only contains filters with field names that start with the specified prefix
 */
export const extractFiltersWithPrefixFromFilterSet = (
  fs: FilterSet,
  prefix: string,
) => {
  return Object.values(fs.root).reduce(
    (acc, filter: Operation) => {
      if (isIntersectionOrUnion(filter)) return acc;

      if (filter.field.startsWith(prefix)) {
        acc.root[filter.field] = filter;
      }
      return acc;
    },
    { mode: "and", root: {} } as FilterSet,
  );
};
