import {
  EnumOperandValue,
  FacetBuckets,
  FilterSet,
  GQLDocType,
  GQLIndexType,
  OperandValue,
  Operation,
  useCoreSelector,
  fetchFacetByNameGQL,
  selectCurrentCohortFilters,
  selectFacetByDocTypeAndField,
  useCoreDispatch,
  usePrevious,
  joinFilters,
  NumericFromTo,
  selectRangeFacetByField,
  fetchFacetContinuousAggregation,
  selectCurrentCohortId,
  FetchDataActionCreator,
  UseAppDataHook,
  UseAppDataResponse,
} from "@gff/core";
import { useEffect } from "react";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";
import {
  ClearFacetFunction,
  EnumFacetResponse,
  FacetResponse,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit/dist/createAction";
import { extractValue } from "@/features/facets/hooks";
import { AppDataSelector } from "@/features/repositoryApp/appApi";

import {
  useAppSelector,
  useAppDispatch,
} from "@/features/repositoryApp/appApi";
import {
  selectFilters,
  selectFiltersByName,
  updateRepositoryFilter,
  removeRepositoryFilter,
  clearRepositoryFilters,
} from "@/features/repositoryApp/repositoryFiltersSlice";

/**
 * Selector for the facet values (if any) from the current cohort
 * @param field - field name to find filter for
 * @return Value of Filters or undefined
 */
export const useRepositoryEnumValues = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

export const useRepositoryFilters = (): FilterSet => {
  return useAppSelector((state) => selectFilters(state));
};

/**
 * removes the filter from the repository current/active filters
 */
export const useClearRepositoryFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeRepositoryFilter(field));
  };
};

type updateEnumFiltersFunc = (
  enumerationFilters: EnumOperandValue,
  field: string,
  dispatch: ThunkDispatch<any, undefined, AnyAction>,
  updateFilter: ActionCreatorWithPayload<
    { field: string; operation: Operation },
    string
  >,
  removeFilter: ActionCreatorWithPayload<string, string>,
) => void;
/**
 * Adds an enumeration filter to cohort filters
 * @param dispatch CoreDispatch instance
 * @param enumerationFilters values to update
 * @param field field to update
 * @param updateFilter action to update a filter's operands
 * @param removeFilter action to remove a filter
 */
// TODO: this is can be used for all Enum Facets and needs be moved to facets/hooks
export const updateEnumerationFilters: updateEnumFiltersFunc = (
  enumerationFilters: EnumOperandValue,
  field: string,
  dispatch: ThunkDispatch<any, undefined, AnyAction>,
  updateFilter: ActionCreatorWithPayload<
    { field: string; operation: Operation },
    string
  >,
  removeFilter: ActionCreatorWithPayload<string, string>,
) => {
  // undefined just return
  if (enumerationFilters === undefined) return;
  if (enumerationFilters.length > 0) {
    dispatch(
      updateFilter({
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
    dispatch(removeFilter(field));
  }
};

/**
 *  Facet Selector which will refresh when filters/enum values changes.
 */
// TODO: this is can be used for all Enum Filters as its data hook and needs be moved to facets/hooks
export const useLocalFilters = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
  selectFieldEnumValues: (field: string) => OperandValue,
  selectLocalFilters: () => FilterSet,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();

  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  ); // Facet data is always cached in the coreState

  const enumValues = selectFieldEnumValues(field);
  const localFilters = selectLocalFilters();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const allFilters = joinFilters(cohortFilters, localFilters);
  const prevAllFilters = usePrevious(allFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    const selectCohortAndRepositoryFilters = () => cohortFilters;
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
          caseFilterSelector: selectCohortAndRepositoryFilters,
          localFilters: localFilters,
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
    cohortFilters,
    localFilters,
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

export const useRepositoryRangeFacet = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
): FacetResponse => {
  const appDispatch = useAppDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectRangeFacetByField(state, field),
  );
  const localFilters = useRepositoryFilters();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const allFilters = joinFilters(cohortFilters, localFilters);
  const prevAllFilters = usePrevious(allFilters);
  const prevRanges = usePrevious(ranges);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevAllFilters, allFilters) ||
      !isEqual(ranges, prevRanges)
    ) {
      appDispatch(
        fetchFacetContinuousAggregation({
          field: field,
          ranges: ranges,
          docType: docType,
          indexType: indexType,
        }),
      );
    }
  }, [
    appDispatch,
    facet,
    field,
    cohortFilters,
    prevAllFilters,
    ranges,
    prevRanges,
    docType,
    indexType,
    allFilters,
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

export const useUpdateRepositoryFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateRepositoryFilter({ field: field, operation: operation }));
  };
};

export const useRemoveRepositoryFacetFilter = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string) => {
    dispatch(removeRepositoryFilter(field));
  };
};

//  Selector Hooks for getting repository filters by name
export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectFiltersByName(state, field));
};

export const useClearLocalFilterWhenCohortChanges = (): void => {
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));

  const appDispatch = useAppDispatch();
  const prevCohortFilters = usePrevious(cohortFilters);
  const prevId = usePrevious(cohortId);

  useEffect(() => {
    if (
      (prevCohortFilters && !isEqual(prevCohortFilters, cohortFilters)) ||
      (prevId && !isEqual(prevId, cohortId))
    ) {
      appDispatch(clearRepositoryFilters());
    }
  }, [prevId, prevCohortFilters, cohortFilters, cohortId, appDispatch]);
};

export const createUseAppDataHook = <P, A, T>(
  fetchDataActionCreator: FetchDataActionCreator<P, A>,
  dataSelector: AppDataSelector<T>,
): UseAppDataHook<P, T> => {
  return (...params: P[]): UseAppDataResponse<T> => {
    const appDispatch = useAppDispatch();
    const { data, status, error } = useAppSelector(dataSelector);
    const action = fetchDataActionCreator(...params);
    const prevParams = usePrevious<P[]>(params);

    useEffect(() => {
      if (status === "uninitialized" || !isEqual(prevParams, params)) {
        // createDispatchHook types forces the input to AnyAction, which is
        // not compatible with thunk actions. hence, the `as any` cast. ;(
        appDispatch(action as any); // eslint-disable-line
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, appDispatch, action, params, prevParams]);
    return {
      data,
      error,
      isUninitialized: status === "uninitialized",
      isFetching: status === "pending",
      isSuccess: status === "fulfilled",
      isError: status === "rejected",
    };
  };
};
