import {
  Operation,
  EnumValueExtractorHandler,
  EnumOperandValue,
  OperandValue,
  CoreDispatch,
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
} from "@gff/core";
import { useEffect } from "react";
import isEqual from "lodash/isEqual";

/**
 * Filter selector for all the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
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

interface FacetResponse {
  readonly data?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

interface EnumFacetResponse extends FacetResponse {
  readonly enumFilters?: ReadonlyArray<string>;
}

/**
 *  Facet Selector using GQL which will refresh when filters/enum values changes.
 */
export const useCasesFacet = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
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
 * Genes Facet Selector using GQL
 */
const useGenesFacet = (
  field: string,
  docType = "genes" as GQLDocType,
  indexType = "explore" as GQLIndexType,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );

  const enumValues = useGenomicFilterByName(field);
  const cohortFilters = useCohortFacetFilter();
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
  const cohortFilters = useCohortFacetFilter();
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

type updateEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
  prefix?: string,
) => void;
/**
 * Adds an enumeration filter to cohort filters
 * @param dispatch CoreDispatch instance
 * @param enumerationFilters values to update
 * @param field field to update
 */
export const updateEnumFilters: updateEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
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

type updateGenomicEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
  prefix?: string,
) => void;

export const updateGenomicEnumFilters: updateGenomicEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
) => {
  if (enumerationFilters === undefined) return;
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

export const UpdateEnums = {
  cases: updateEnumFilters,
  files: updateEnumFilters,
  genes: updateGenomicEnumFilters,
  ssms: updateGenomicEnumFilters,
};

export const FacetEnumHooks = {
  cases: useCasesFacet,
  files: useCasesFacet,
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
