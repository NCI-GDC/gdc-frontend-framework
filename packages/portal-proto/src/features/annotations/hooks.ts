import { FilterSet, OperandValue, Operation } from "@gff/core";
import { extractValue } from "@/features/facets/hooks";
import { useAppSelector, useAppDispatch } from "@/features/annotations/appApi";
import {
  selectAnnotationFiltersByName,
  selectFilters,
  removeAnnotationFilter,
  updateAnnotationFilter,
  clearAnnotationFilters,
} from "./annotationBrowserFilterSlice";
import {
  selectAllFiltersCollapsed,
  selectFilterExpanded,
  toggleAllFilters,
  toggleFilter,
} from "./annotationBrowserExpandSlice";
import { useCallback } from "react";

export const useAnnotationsFilters = (): FilterSet => {
  return useAppSelector((state) => selectFilters(state));
};

export const useClearAnnotationFilters = () => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeAnnotationFilter(field));
  };
};

export const useClearAllAnnotationFilters = () => {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearAnnotationFilters());
  }, [dispatch]);
};

export const useAnnotationEnumValues = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectAnnotationFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

export const useUpdateAnnotationFacetFilter = () => {
  const dispatch = useAppDispatch();

  return (field: string, operation: Operation) => {
    dispatch(updateAnnotationFilter({ field: field, operation: operation }));
  };
};

export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectAnnotationFiltersByName(state, field));
};

export const useToggleExpandAnnotationFilter = () => {
  const dispatch = useAppDispatch();
  return (field: string, expanded: boolean) => {
    dispatch(toggleFilter({ field, expanded }));
  };
};

export const useToggleAllAnnotationFilters = () => {
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
