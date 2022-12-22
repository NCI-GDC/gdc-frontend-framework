import {
  Operation,
  EnumValueExtractorHandler,
  EnumOperandValue,
  OperandValue,
  FacetBuckets,
  handleOperation,
  FilterSet,
  removeCohortFilter,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  fetchFacetByNameGQL,
  updateCohortFilter,
  useCoreDispatch,
  useCoreSelector,
  GQLDocType,
  GQLIndexType,
  NumericFromTo,
  selectRangeFacetByField,
  fetchFacetContinuousAggregation,
  selectFacetByDocTypeAndField,
  usePrevious,
  selectTotalCountsByName,
  useCurrentCohortFilters,
} from "@gff/core";
import { useEffect } from "react";
import isEqual from "lodash/isEqual";
import {
  ClearFacetFunction,
  EnumFacetResponse,
  FacetResponse,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

/**
 * Filter selector for all the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const extractValue = (op: Operation): EnumOperandValue => {
  const handler = new EnumValueExtractorHandler();
  return handleOperation<EnumOperandValue>(handler, op);
};

/**
 * Selector for the facet values (if any) from the current cohort
 * @param field - field name to find filter for
 * @return Value of Filters or undefined
 */
const useCohortFacetFilterByName = (field: string): OperandValue => {
  const enumFilters: Operation = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

/**
 *  Facet Selector using GQL which will refresh when filters/enum values changes.
 */
export const useEnumFacet = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();

  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );

  const enumValues = useCohortFacetFilterByName(field);
  const currentCohortFilters = useCurrentCohortFilters();
  const cohortFilters = useCohortFacetFilter();
  const prevCohortFilters = usePrevious(currentCohortFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevCohortFilters, currentCohortFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      coreDispatch(
        fetchFacetByNameGQL({
          field: field,
          docType: docType,
          index: indexType,
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
    currentCohortFilters,
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

type UpdateEnumFiltersFunc = (
  dispatch: ThunkDispatch<any, undefined, AnyAction>,
  field: string,
  enumerationFilters: EnumOperandValue,
) => void;

/**
 * Adds an enumeration filter to cohort filters
 * @param dispatch CoreDispatch instance
 * @param enumerationFilters values to update
 * @param field field to update
 */
export const updateEnumFilters: UpdateEnumFiltersFunc = (
  dispatch: ThunkDispatch<any, undefined, AnyAction>,
  field: string,
  enumerationFilters: EnumOperandValue,
) => {
  // undefined just return
  if (enumerationFilters === undefined) return;
  if (enumerationFilters.length > 0) {
    dispatch(
      updateCohortFilter({
        field: field,
        operation: {
          operator: "includes",
          field: field,
          operands: enumerationFilters,
        },
      }),
    );
  } else {
    // completely remove the field
    dispatch(removeCohortFilter(field));
  }
};

export const useRangeFacet = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
): FacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectRangeFacetByField(state, field),
  );

  const cohortFilters = useCohortFacetFilter();
  const prevFilters = usePrevious(cohortFilters);
  const prevRanges = usePrevious(ranges);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevFilters, cohortFilters) ||
      !isEqual(ranges, prevRanges)
    ) {
      coreDispatch(
        fetchFacetContinuousAggregation({
          field: field,
          ranges: ranges,
          docType: docType,
          indexType: indexType,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    field,
    cohortFilters,
    prevFilters,
    ranges,
    prevRanges,
    docType,
    indexType,
  ]);

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

// Global Selector for Facet Values
export const useSelectFieldFilter = (field: string): Operation => {
  // get the current filter for this facet
  return useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field),
  );
};

// Update filter hook
export const useUpdateFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useCoreDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateCohortFilter({ field: field, operation: operation }));
  };
};

// Core ClearFilters hook
export const useClearFilters = (): ClearFacetFunction => {
  const dispatch = useCoreDispatch();
  return (field: string) => {
    dispatch(removeCohortFilter(field));
  };
};

export const useTotalCounts = (name: string): number => {
  return useCoreSelector((state) => selectTotalCountsByName(state, name));
};

export const FacetDocTypeToCountsIndexMap = {
  cases: "caseCounts",
  files: "fileCounts",
  genes: "genesCounts",
  ssms: "mutationCounts",
  projects: "projectCounts",
};

export const FacetDocTypeToLabelsMap = {
  cases: "Cases",
  files: "Files",
  genes: "Genes",
  ssms: "Mutations",
  projects: "Projects",
};
