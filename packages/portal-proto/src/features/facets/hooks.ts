import {
  Operation,
  EnumValueExtractorHandler,
  EnumOperandValue,
  OperandValue,
  FacetBuckets,
  handleOperation,
  FilterSet,
  removeCohortFilter,
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
  selectMultipleFacetsByDocTypeAndField,
  selectCurrentCohortFiltersByName,
  selectCurrentCohortFiltersByNames,
  GqlOperation,
  buildCohortGqlOperator,
  selectCurrentCohortGeneAndSSMCaseSet,
  useCurrentCohortWithGeneAndSsmCaseSet,
} from "@gff/core";
import { useEffect, useMemo } from "react";
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
  return useCoreSelector((state) =>
    selectCurrentCohortGeneAndSSMCaseSet(state),
  );
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

const useEnumFiltersByNames = (
  fields: ReadonlyArray<string>,
): Record<string, OperandValue> => {
  const enumFilters: Record<string, Operation> = useCoreSelector((state) =>
    selectCurrentCohortFiltersByNames(state, fields),
  );
  return Object.entries(enumFilters).reduce((obj, [key, value]) => {
    if (value) obj[key] = extractValue(value);
    return obj;
  }, {});
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
  const currentCohortFilters = useCurrentCohortWithGeneAndSsmCaseSet();
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

/**
 * Fetch multiple enum facets via a single API call. Does not return any value but initiates the
 * fetch for each field.
 * @param docType - "cases", "files", etc
 * @param indexType = "explore" | "repository"
 * @param fields - list of fields.
 */
export const useEnumFacets = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  fields: ReadonlyArray<string>,
): void => {
  const facet: ReadonlyArray<FacetBuckets> = useCoreSelector((state) =>
    selectMultipleFacetsByDocTypeAndField(state, docType, fields),
  );
  const coreDispatch = useCoreDispatch();

  const enumValues = useEnumFiltersByNames(fields);
  const currentCohortFilters = useCurrentCohortWithGeneAndSsmCaseSet();
  const cohortFilters = useCohortFacetFilter();
  const prevCohortFilters = usePrevious(currentCohortFilters);
  const prevEnumValues = usePrevious(enumValues);
  const prevFilterLength = usePrevious(facet.length);

  console.log("currentCohortFilters", currentCohortFilters);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (
      facet.length > 0 &&
      (prevFilterLength != facet.length ||
        !isEqual(prevCohortFilters, currentCohortFilters) ||
        !isEqual(prevEnumValues, enumValues))
    ) {
      coreDispatch(
        fetchFacetByNameGQL({
          field: fields,
          docType: docType,
          index: indexType,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    fields,
    cohortFilters,
    docType,
    indexType,
    prevCohortFilters,
    prevEnumValues,
    enumValues,
    currentCohortFilters,
    prevFilterLength,
  ]);
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
  overrideCohortFilters?: GqlOperation,
): FacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectRangeFacetByField(state, field),
  );

  const cohortFilters = useCohortFacetFilter();
  const prevFilters = usePrevious(cohortFilters);
  const prevRanges = usePrevious(ranges);

  const rangeCohortFilters = useMemo(
    () => overrideCohortFilters ?? buildCohortGqlOperator(cohortFilters),
    [overrideCohortFilters, cohortFilters],
  );
  const prevRangeFilters = usePrevious(rangeCohortFilters);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevRangeFilters, rangeCohortFilters) ||
      !isEqual(ranges, prevRanges)
    ) {
      coreDispatch(
        fetchFacetContinuousAggregation({
          field: field,
          ranges: ranges,
          docType: docType,
          indexType: indexType,
          overrideFilters: rangeCohortFilters,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    field,
    rangeCohortFilters,
    prevFilters,
    prevRangeFilters,
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

export const useEnumFacetValues = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
): EnumFacetResponse => {
  // facet data is store in core
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );
  const enumValues = useCohortFacetFilterByName(field);
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
