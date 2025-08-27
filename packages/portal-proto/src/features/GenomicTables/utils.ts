import {
  FilterSet,
  Union,
  convertFilterToGqlFilter,
  appendFilterToOperation,
  filterSetToOperation,
  UnionOrIntersection,
  buildGqlOperationToFilterSet,
  GqlUnion,
  GqlIntersection,
} from "@gff/core";

export const appendSearchTermFilters = (
  filters: FilterSet,
  searchFilters: Union,
): FilterSet => {
  const baseFilters = filterSetToOperation(filters) as
    | UnionOrIntersection
    | undefined;

  return buildGqlOperationToFilterSet(
    convertFilterToGqlFilter(
      appendFilterToOperation(baseFilters, searchFilters),
    ) as GqlUnion | GqlIntersection | undefined,
  );
};
