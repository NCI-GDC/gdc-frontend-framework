import {
  ClearFacetFunction,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/features/projectsCenter/appApi";
import { FilterSet, OperandValue, Operation } from "@gff/core";
import {
  removeProjectFilter,
  selectProjectFiltersByName,
  selectFilters,
  updateProjectFilter,
  clearProjectFilters,
} from "@/features/projectsCenter/projectCenterFiltersSlice";
import {
  toggleProjectFilter,
  toggleAllFilters,
  selectFilterExpanded,
  selectAllFiltersCollapsed,
} from "@/features/projectsCenter/projectCenterFilterExpandSlice";
import { useCallback } from "react";
import { extractValue } from "@/features/facets/hooks";

export const useUpdateProjectsFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet

  return (field: string, operation: Operation) => {
    dispatch(updateProjectFilter({ field: field, operation: operation }));
  };
};

//  Selector Hooks for getting project filters by name
export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectProjectFiltersByName(state, field));
};

export const useProjectsFilters = (): FilterSet => {
  return useAppSelector((state) => selectFilters(state));
};

/**
 * removes the filter from the project current/active filters
 */
export const useClearProjectsFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeProjectFilter(field));
  };
};

export const useClearAllProjectFilters = () => {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearProjectFilters());
  }, [dispatch]);
};

export const useToggleExpandProjectFilter = () => {
  const dispatch = useAppDispatch();
  return (field: string, expanded: boolean) => {
    dispatch(toggleProjectFilter({ field, expanded }));
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

/**
 * Selector for the facet values (if any) from the current cohort
 * @param field - field name to find filter for
 * @returns Value of Filters or undefined
 */
export const useProjectEnumValues = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectProjectFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};
