import {
  FacetBuckets,
  NumericRange,
  fetchFacetByName,
  selectCasesFacetByField,
  selectRangeFacetByField,
  fetchFacetContinuousAggregation,
  useCoreDispatch,
  useCoreSelector,
  FilterSet,
  selectCurrentCohortFilters,
} from "@gff/core";

import { useEffect, useRef } from "react";
import isEqual from "lodash/isEqual";

interface UseCaseFacetResponse {
  readonly data?: FacetBuckets;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export const useCaseFacet = (field: string): UseCaseFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCasesFacetByField(state, field),
  );

  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * Filter selector for all of the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const useRangeFacet = (
  field: string,
  ranges: ReadonlyArray<NumericRange>,
): UseCaseFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectRangeFacetByField(state, field),
  );

  const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const cohortFilters = useCohortFacetFilter();
  const prevFilters = usePrevious(cohortFilters);

  useEffect(() => {
    if (!facet || !isEqual(prevFilters, cohortFilters)) {
      coreDispatch(
        fetchFacetContinuousAggregation({ field: field, ranges: ranges }),
      );
    }
  }, [coreDispatch, facet, field, cohortFilters, prevFilters, ranges]);

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

export interface FacetProps {
  readonly field: string;
  readonly description?: string;
  readonly facetName?: string;
}
