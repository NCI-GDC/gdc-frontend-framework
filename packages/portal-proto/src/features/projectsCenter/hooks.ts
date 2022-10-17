import {
  ClearFacetFunction,
  EnumFacetResponse,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/features/projectsCenter/appApi";
import {
  EnumOperandValue,
  FacetBuckets,
  fetchFacetByNameGQL,
  FilterSet,
  GQLDocType,
  GQLIndexType,
  OperandValue,
  Operation,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
  selectProjectsFacetByField,
} from "@gff/core";
import {
  removeProjectFilter,
  selectFiltersByName,
  selectFilters,
  updateProjectFilter,
} from "@/features/projectsCenter/projectCenterFiltersSlice";
import { useEffect } from "react";
import isEqual from "lodash/isEqual";
import { extractValue } from "@/features/facets/hooks";

export const useLocalFilters = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
  selectFieldEnumValues: (field: string) => OperandValue,
  selectLocalFilters: () => FilterSet,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();

  const facet: FacetBuckets = useCoreSelector((state) =>
    selectProjectsFacetByField(state, field),
  ); // Facet data is always cached in the coreState

  const enumValues = selectFieldEnumValues(field);
  const allFilters = selectLocalFilters();
  const prevAllFilters = usePrevious(allFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    const selectFilters = () => allFilters;
    if (
      !facet ||
      !isEqual(prevAllFilters, allFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      coreDispatch(
        // pass selectCohortAndRepositoryFilters to fetchFacetByNameGQL to
        // include both the cohort and local Repository filters.
        // This is an example of cohort centric + local filters
        fetchFacetByNameGQL({
          field: field,
          docType: docType,
          index: indexType,
          filterSelector: selectFilters,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    field,
    allFilters,
    docType,
    indexType,
    prevAllFilters,
    prevEnumValues,
    enumValues,
  ]);

  return {
    data: facet?.buckets,
    enumFilters: (enumValues as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

export const useUpdateProjectsFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateProjectFilter({ field: field, operation: operation }));
  };
};

//  Selector Hooks for getting repository filters by name
export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectFiltersByName(state, field));
};

export const useProjectsFilters = (): FilterSet => {
  return useAppSelector((state) => selectFilters(state));
};

/**
 * removes the filter from the repository current/active filters
 */
export const useClearProjectsFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeProjectFilter(field));
  };
};

/**
 * Selector for the facet values (if any) from the current cohort
 * @param field - field name to find filter for
 * @return Value of Filters or undefined
 */
export const useProjectEnumValues = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};
