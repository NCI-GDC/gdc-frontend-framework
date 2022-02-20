import {
  EnumFilter,
  FacetBuckets,
  fetchCaseFacetByName,
  fetchFileFacetByName,
  fetchGenesFacetByName, fetchMutationsFacetByName,
  FilterSet, removeCohortFilter,
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

/**
 * Selector for the facet values (if any)
 * @param field
 */
const useCohortFacetFilterByName = (field: string): string[] | undefined => {
  const enumFilters: EnumFilter = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field) as EnumFilter,
  );
  return enumFilters ? enumFilters.values : undefined;
};

interface EnumFacetResponse {
  readonly data?: FacetBuckets;
  readonly enumFilters: string [] | undefined;
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
  const enumFilters = useCohortFacetFilterByName(field);
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
  const enumFilters = useCohortFacetFilterByName(field);
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
  const enumFilters = useCohortFacetFilterByName(field);
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
  const enumFilters = useCohortFacetFilterByName(field);
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

export const updateEnumFilters = (dispatch, enumerationFilters, field ) => {
  if (enumerationFilters === undefined)
    return;
  if (enumerationFilters.length > 0) {
    dispatch(updateCohortFilter({ type: "enum", op: "in", field: `${field}`, values: enumerationFilters }));
  } else { // completely remove the field
    dispatch(removeCohortFilter(field));
  }
}

export const FacetDataHooks = {
  "cases" : useCasesFacet,
  "files" : useFilesFacet,
  "genes" : useGenesFacet,
  "mutation" : useMutationsFacet,
}
