import { FilterSet, OperandValue, Operation } from "@gff/core";
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
  clearAnnotationFilters,
} from "./annotationBrowserFilterSlice";

export const useAnnotationsFilters = (): FilterSet => {
  return useAppSelector((state) => selectFilters(state));
};

export const useClearAnnotationFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeAnnotationFilter(field));
  };
};

export const useClearAllAnnotationFilters = () => {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(clearAnnotationFilters());
  };
};

export const useAnnotationEnumValues = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectAnnotationFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

export const useUpdateAnnotationFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();

  return (field: string, operation: Operation) => {
    dispatch(updateAnnotationFilter({ field: field, operation: operation }));
  };
};

export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectAnnotationFiltersByName(state, field));
};
