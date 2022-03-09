import {
  Operation,
  ValueExtractorHandler,
  OperationValue,
  FacetBuckets,
  handleOperation,
  fetchCaseFacetByName,
  fetchFileFacetByName,
  fetchGenesFacetByName,
  fetchMutationsFacetByName,
  FilterSet,
  removeCohortFilter,
  selectCaseFacetByField,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  selectFilesFacetByField,
  selectGenesFacetByField,
  selectMutationsFacetByField, updateCohortFilter,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";
import { useEffect } from "react";


/**
 * Filter selector for all of the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
};

export const extractValue = (op: Operation): OperationValue => {
  const handler =  new ValueExtractorHandler();
  return handleOperation(handler, op);
};

/**
 * Selector for the facet values (if any)
 * @param field
 */
const useCohortFacetFilterByName = (field: string): OperationValue => {
  const enumFilters: Operation = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field)
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

interface EnumFacetResponse {
  readonly data?: Record<string, number>;
  readonly enumFilters?: string [] | number [] | undefined;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

/**
 * Case Facet Selector using GQL
 */
const useCasesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCaseFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`cases.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchCaseFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchCaseFacetByName(field));
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * File Facet Selector using GQL
 */
const useFilesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFilesFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`files.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFileFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFileFacetByName(field));
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters,
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
const useGenesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectGenesFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`genes.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchGenesFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchGenesFacetByName(field));
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters,
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
const useMutationsFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectMutationsFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`ssms.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchMutationsFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchMutationsFacetByName(field));
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * Adds a enumeration filter to cohort filters
 * @param dispatch
 * @param enumerationFilters
 * @param field
 * @param prefix
 */
export const updateEnumFilters = (dispatch, enumerationFilters, field, prefix="" ) => {
  if (enumerationFilters === undefined)
    return;
  if (enumerationFilters.length > 0) {
    dispatch(updateCohortFilter({  field: `${prefix}${field}`, operation: { operator: "includes",
                                                                                    field: `${prefix}${field}`,
                                                                                    operands: enumerationFilters }
                                        }));
  } else { // completely remove the field
    dispatch(removeCohortFilter( `${prefix}${field}`));
  }
}

export const FacetDataHooks = {
  "cases" : useCasesFacet,
  "files" : useFilesFacet,
  "genes" : useGenesFacet,
  "ssms" : useMutationsFacet,
}
