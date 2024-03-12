import { useEffect } from "react";
import isEqual from "lodash/isEqual";
import {
  FacetBuckets,
  fetchFacetByNameGQL,
  FilterSet,
  GQLDocType,
  GQLIndexType,
  OperandValue,
  Operation,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
  EnumOperandValue,
  selectAnnotationFacetByField,
} from "@gff/core";
import { extractValue } from "@/features/facets/hooks";
import {
  ClearFacetFunction,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import { useAppSelector, useAppDispatch } from "@/features/annotations/appApi";
import {
  selectAnnotationFiltersByName,
  selectFilters,
  removeAnnotationFilter,
  updateAnnotationFilter,
} from "./annotationBrowserFilterSlice";
import { EnumFacetResponse } from "@/features/facets/types";

export const useAnnotationsFilters = (): FilterSet => {
  return useAppSelector((state) => selectFilters(state));
};

export const useClearAnnotationFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeAnnotationFilter(field));
  };
};

/**
 * Selector for the facet values (if any) from the current cohort
 * @param field - field name to find filter for
 * @returns Value of Filters or undefined
 */
export const useAnnotationEnumValues = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectAnnotationFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

export const useUpdateAnnotationFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet

  return (field: string, operation: Operation) => {
    dispatch(updateAnnotationFilter({ field: field, operation: operation }));
  };
};

//  Selector Hooks for getting project filters by name
export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectAnnotationFiltersByName(state, field));
};

export const useLocalFilters = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
  selectFieldEnumValues: (field: string) => OperandValue,
  selectLocalFilters: () => FilterSet,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();

  const facet: FacetBuckets = useCoreSelector((state) =>
    selectAnnotationFacetByField(state, field),
  ); // Facet data is always cached in the coreState

  const enumValues = selectFieldEnumValues(field);
  const localFilters = selectLocalFilters();
  const prevLocalFilters = usePrevious(localFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    if (
      !facet ||
      !isEqual(prevLocalFilters, localFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      coreDispatch(
        fetchFacetByNameGQL({
          field: field,
          docType: docType,
          index: indexType,
          localFilters,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          caseFilterSelector: (_ignored) => {
            return {
              mode: "and",
              root: {},
            };
          },
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    field,
    localFilters,
    docType,
    indexType,
    prevLocalFilters,
    prevEnumValues,
    enumValues,
  ]);

  console.log({ facet });
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
