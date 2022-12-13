import {
  ClearFacetFunction,
  EnumFacetResponse,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import {
  EnumOperandValue,
  FacetBuckets,
  fetchFacetByNameGQL,
  FilterSet,
  GQLDocType,
  GQLIndexType,
  OperandValue,
  Operation,
  removeGenomicFilter,
  selectCurrentCohortFilterOrCaseSet,
  selectFacetByDocTypeAndField,
  selectGenomicAndCohortFilters,
  selectGenomicFilters,
  selectGenomicFiltersByName,
  updateGenomicFilter,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
} from "@gff/core";
import { useEffect } from "react";
import isEqual from "lodash/isEqual";
import { extractValue } from "@/features/facets/hooks";

/**
 * Update Gene Enum Facets filters. These are local updates and are not added
 * to the current (global) cohort
 */
export const useUpdateGenomicEnumFacetFilter =
  (): UpdateFacetFilterFunction => {
    const dispatch = useCoreDispatch();
    // update the filter for this facet
    return (field: string, operation: Operation) => {
      dispatch(updateGenomicFilter({ field: field, operation: operation }));
    };
  };

/**
 * clears the genomic (local filters)
 */
export const useClearGenomicFilters = (): ClearFacetFunction => {
  const dispatch = useCoreDispatch();
  return (field: string) => {
    dispatch(removeGenomicFilter(field));
  };
};

export const useGenomicFilterByName = (field: string): OperandValue => {
  const enumFilters: Operation = useCoreSelector((state) =>
    selectGenomicFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

const useCohortOrCaseSetFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilterOrCaseSet(state));
};

const useGenomicFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectGenomicFilters(state));
};

/**
 * Genes Facet Selector using GQL. it combines the Cohort with Gene Filters
 * to get data for the current cohort and genes filters
 */
export const useGenesFacet = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );

  const enumValues = useGenomicFilterByName(field);
  const cohortFilters = useCohortOrCaseSetFacetFilter();
  const genomicFilters = useGenomicFacetFilter();
  const prevCohortFilters = usePrevious(cohortFilters);
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevCohortFilters, cohortFilters) ||
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      coreDispatch(
        fetchFacetByNameGQL({
          field: field,
          docType: docType,
          index: indexType,
          filterSelector: selectGenomicAndCohortFilters,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    field,
    cohortFilters,
    docType,
    indexType,
    prevCohortFilters,
    prevEnumValues,
    enumValues,
    prevGenomicFilters,
    genomicFilters,
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
