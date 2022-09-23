import {
  CoreState,
  CoreDispatch,
  Operation,
  EnumValueExtractorHandler,
  EnumOperandValue,
  OperandValue,
  FacetBuckets,
  handleOperation,
  FilterSet,
  removeCohortFilter,
  removeGenomicFilter,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  fetchFacetByNameGQL,
  updateCohortFilter,
  updateGenomicFilter,
  useCoreDispatch,
  useCoreSelector,
  selectGenomicFilters,
  selectGenomicFiltersByName,
  GQLDocType,
  GQLIndexType,
  NumericFromTo,
  selectRangeFacetByField,
  fetchFacetContinuousAggregation,
  selectFacetByDocTypeAndField,
  usePrevious,
  selectGenomicAndCohortFilters,
  selectCurrentCohortFilterOrCaseSet,
  selectTotalCountsByName,
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
import { TypedUseSelectorHook } from "react-redux";
import { partial } from "lodash";

/**
 * Filter selector for all the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

const useCohortOrCaseSetFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilterOrCaseSet(state));
};

const useGenomicFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectGenomicFilters(state));
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

const useGenomicFilterByName = (field: string): OperandValue => {
  const enumFilters: Operation = useCoreSelector((state) =>
    selectGenomicFiltersByName(state, field),
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
  const cohortFilters = useCohortFacetFilter();
  const prevCohortFilters = usePrevious(cohortFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevCohortFilters, cohortFilters) ||
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

/**
 * Genes Facet Selector using GQL. it combines the Cohort with Gene Filters
 * to get data for the current cohort and genes filters
 */
export const useGenesFacet = (
  field: string,
  docType = "genes" as GQLDocType,
  indexType = "explore" as GQLIndexType,
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

/**
 * Mutations Facet Selector using GQL
 */
const useMutationsFacet = (
  field: string,
  docType = "ssms" as GQLDocType,
  indexType = "explore" as GQLIndexType,
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

// Hook version of updateEnumFilters

export const useUpdateEnumFilters = () => {
  const dispatch = useCoreDispatch();
  return (field: string, enumerationFilters: EnumOperandValue) =>
    partial(updateEnumFilters, dispatch, field, enumerationFilters);
};

export const useUpdateGenomicEnumFilters: UpdateEnumFiltersFunc = (
  dispatch: ThunkDispatch<any, undefined, AnyAction>,
  field: string,
  enumerationFilters: EnumOperandValue,
) => {
  if (enumerationFilters === undefined) dispatch(removeGenomicFilter(field));
  if (enumerationFilters.length > 0) {
    dispatch(
      updateGenomicFilter({
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
    dispatch(removeGenomicFilter(field));
  }
};

export const useRangeFacet = (
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
  docType: GQLDocType,
  indexType: GQLIndexType,
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

// Global Selector for Facet Values
export const selectFieldFilter = (
  selector: TypedUseSelectorHook<CoreState>,
  field: string,
): Operation => {
  // get the current filter for this facet
  return selector((state) => selectCurrentCohortFiltersByName(state, field));
};

// Update Core Filter
export const updateFacetFilter = (
  dispatch: CoreDispatch,
  field: string,
  operation: Operation,
): void => {
  // update the filter for this facet
  dispatch(updateCohortFilter({ field: field, operation: operation }));
};

// Update filter hook
export const useUpdateFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useCoreDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateCohortFilter({ field: field, operation: operation }));
  };
};

// Global Clear
export const clearFilters = (dispatch: CoreDispatch, field: string): void => {
  dispatch(removeCohortFilter(field));
};

// Core ClearFilters hook
export const useClearFilters = (): ClearFacetFunction => {
  const dispatch = useCoreDispatch();
  return (field: string) => {
    dispatch(removeCohortFilter(field));
  };
};

export const useTotalCounts = (name: string): number =>
  useCoreSelector((state) => selectTotalCountsByName(state, name));

export const UpdateEnums = {
  cases: updateEnumFilters,
  files: updateEnumFilters,
  genes: useUpdateGenomicEnumFilters,
  ssms: useUpdateGenomicEnumFilters,
};

export const FacetEnumHooks = {
  cases: useEnumFacet,
  files: useEnumFacet,
  genes: useGenesFacet,
  ssms: useMutationsFacet,
};

export const FacetDocTypeToCountsIndexMap = {
  cases: "caseCounts",
  files: "fileCounts",
  genes: "genesCounts",
  ssms: "mutationCounts",
};

export const FacetDocTypeToLabelsMap = {
  cases: "Cases",
  files: "Files",
  genes: "Genes",
  ssms: "Mutations",
};
