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
  selectCurrentCohortFilterSet,
  selectFacetByDocTypeAndField,
  useCoreDispatch,
  usePrevious,
  joinFilters,
  removeCohortFilter,
  updateCohortFilter,
} from "@gff/core";
import { useEffect } from "react";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";
import {
  ClearFacetFunction,
  EnumFacetResponse,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit/dist/createAction";
import { extractValue } from "@/features/facets/hooks";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/repositoryApp/appApi";
import {
  selectFilters,
  selectFiltersByName,
  updateRepositoryFilter,
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

export const useClearRepositoryFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeCohortFilter(field));
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
    selectCurrentCohortFilterSet(state),
  );
  const allFilters = joinFilters(cohortFilters, localFilters);
  const prevAllFilters = usePrevious(allFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    const selectCohortAndRepositoryFilters = () => allFilters;
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
          filterSelector: selectCohortAndRepositoryFilters,
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

// Update filter hook
export const useUpdateRepositoryFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateRepositoryFilter({ field: field, operation: operation }));
  };
};
