import { FilterSet } from "./filters";
import { isIntersectionOrUnion, Operation } from "../gdcapi/filters";
import { CoreState } from "../../reducers";

export const defaultCohortNameGenerator = (): string =>
  `Custom cohort ${new Date()
    .toLocaleString("en-CA", {
      timeZone: "America/Chicago",
      hour12: false,
    })
    .replace(",", "")}`;

/**
 * This function takes a FilterSet object and a prefix string as input.
 * It filters the root property of the FilterSet object and returns a
 * new FilterSet object that only contains filters with field names
 * that start with the specified prefix.
 *
 *  @param fs - The FilterSet object to filter
 *  @param prefix - The prefix to filter by
 *  @returns - A new FilterSet object that only contains filters with field names that start with the specified prefix
 *  @category Filters
 */
export const extractFiltersWithPrefixFromFilterSet = (
  fs: FilterSet | undefined,
  prefix: string,
): FilterSet => {
  if (fs === undefined || fs.root === undefined) {
    return { mode: "and", root: {} } as FilterSet;
  }
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

/**
 * Local selector to get cohort filters to prevent circular dependency.
 * @param state - CoreState to get value from
 * @param cohortId - id of cohort to get filters from
 */
export const selectCohortFilterSetById = (
  state: CoreState,
  cohortId: string,
): FilterSet | undefined => {
  const cohort = state.cohort.availableCohorts.entities[cohortId];
  return cohort?.filters;
};
