import {
  EnumOperandValue,
  FacetBuckets,
  FilterSet,
  OperandValue,
  Operation,
  useCoreSelector,
  selectCurrentCohortFilters,
  usePrevious,
  NumericFromTo,
  FetchDataActionCreator,
  selectCurrentCohortId,
  UseAppDataHook,
  UseAppDataResponse,
  buildCohortGqlOperator,
} from "@gff/core";
import { useCallback, useEffect } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
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
import { AppDataSelector, AppState } from "@/features/repositoryApp/appApi";
import {
  fetchRepositoryFacetContinuousAggregation,
  selectRangeFacetByField,
} from "@/features/repositoryApp/repositoryRangeFacet";
import {
  fetchRepositoryFacetsGQL,
  selectRepositoryFacets,
} from "@/features/repositoryApp/repositoryFacetSlice";

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
import {
  toggleFilter,
  toggleAllFilters,
  selectFilterExpanded,
  selectAllFiltersCollapsed,
} from "./repositoryFilterExpandedSlice";

/**
 * Selector for the facet values (if any) from the current cohort
 * @param field - field name to find filter for
 * @returns Value of Filters or undefined
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

export const useClearAllRepositoryFilters = () => {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearRepositoryFilters());
  }, [dispatch]);
};

export const useToggleExpandFilter = () => {
  const dispatch = useAppDispatch();
  return (field: string, expanded: boolean) => {
    dispatch(toggleFilter({ field, expanded }));
  };
};

export const useToggleAllProjectFilters = () => {
  const dispatch = useAppDispatch();
  return (expanded: boolean) => {
    dispatch(toggleAllFilters(expanded));
  };
};

export const useFilterExpandedState = (field: string) => {
  return useAppSelector((state) => selectFilterExpanded(state, field));
};

export const useAllFiltersCollapsed = () => {
  return useAppSelector((state) => selectAllFiltersCollapsed(state));
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
 * @param dispatch - CoreDispatch instance
 * @param enumerationFilters - values to update
 * @param field - field to update
 * @param updateFilter - action to update a filter's operands
 * @param removeFilter - action to remove a filter
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

export const useLocalFilters = (
  field: string,
  selectFieldEnumValues: (field: string) => OperandValue,
  selectLocalFilters: () => FilterSet,
): EnumFacetResponse => {
  const appDispatch = useAppDispatch();

  const facet: FacetBuckets = useAppSelector((state: AppState) =>
    selectRepositoryFacets(state, field),
  ); // Facet data is always cached in the coreState

  const enumValues = selectFieldEnumValues(field);
  const localFilters = selectLocalFilters();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const prevCohortFilters = usePrevious(cohortFilters);
  const prevLocalFilters = usePrevious(localFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevCohortFilters, cohortFilters) ||
      !isEqual(prevLocalFilters, localFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      appDispatch(
        // pass selectCohortAndRepositoryFilters to fetchFacetByNameGQL to
        // include both the cohort and local Repository filters.
        // This is an example of cohort centric + local filters
        fetchRepositoryFacetsGQL({
          field: field,
          caseFilters: cohortFilters,
          localFilters: localFilters,
        }),
      );
    }
  }, [
    appDispatch,
    facet,
    field,
    cohortFilters,
    prevCohortFilters,
    prevEnumValues,
    enumValues,
    localFilters,
    prevLocalFilters,
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
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
): FacetResponse => {
  const appDispatch = useAppDispatch();
  const facet: FacetBuckets = useAppSelector((state) =>
    selectRangeFacetByField(state, field),
  );
  const localFilters = useRepositoryFilters();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  useDeepCompareEffect(() => {
    if (!facet) {
      appDispatch(
        fetchRepositoryFacetContinuousAggregation({
          field: field,
          ranges: ranges,
          caseFilters: buildCohortGqlOperator(cohortFilters),
          localFilters: buildCohortGqlOperator(localFilters),
        }),
      );
    }
  }, [appDispatch, facet, field, cohortFilters, ranges, localFilters]);

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
  return useCallback(
    (field: string, operation: Operation) => {
      dispatch(updateRepositoryFilter({ field: field, operation: operation }));
    },
    [dispatch],
  );
};

export const useRemoveRepositoryFacetFilter = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return useCallback(
    (field: string) => {
      dispatch(removeRepositoryFilter(field));
    },
    [dispatch],
  );
};

//  Selector Hooks for getting repository filters by name
export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectFiltersByName(state, field));
};

export const useClearLocalFilterWhenCohortChanges = (): void => {
  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));

  const appDispatch = useAppDispatch();
  const prevId = usePrevious(cohortId);

  useEffect(() => {
    if (prevId && !isEqual(prevId, cohortId)) {
      appDispatch(clearRepositoryFilters());
    }
  }, [prevId, cohortId, appDispatch]);
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
