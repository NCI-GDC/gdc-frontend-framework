import React from "react";
import { partial } from "lodash";
import {
  FacetDefinition,
  GQLDocType,
  selectAnnotationFacetByField,
} from "@gff/core";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import FilterFacets from "./filters.json";
import {
  useAllFiltersCollapsed,
  useAnnotationEnumValues,
  useAnnotationsFilters,
  useClearAllAnnotationFilters,
  useClearAnnotationFilters,
  useFilterExpandedState,
  useSelectFieldFilter,
  useToggleAllAnnotationFilters,
  useToggleExpandAnnotationFilter,
  useUpdateAnnotationFacetFilter,
} from "./hooks";
import { useFieldNameToTitle } from "../cohortBuilder/queryExpressionHooks";
import FilterPanel from "../facets/FilterPanel";
import { selectFiltersAppliedCount } from "./annotationBrowserFilterSlice";
import { useAppSelector } from "./appApi";
import { useSearchEnumTerms } from "../cohortBuilder/hooks";

const useAnnotationEnumData = (docType: GQLDocType, field: string) =>
  useLocalFilters(
    field,
    docType,
    useAnnotationEnumValues,
    useAnnotationsFilters,
    selectAnnotationFacetByField,
  );

export const AnnotationFacetPanel = (): JSX.Element => {
  const facetHooks = {
    useGetEnumFacetData: partial(useAnnotationEnumData, "annotations"),
    useUpdateFacetFilters: useUpdateAnnotationFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearAnnotationFilters,
    useTotalCounts: useTotalCounts,
    useFieldNameToTitle,
    useToggleExpandFilter: useToggleExpandAnnotationFilter,
    useFilterExpanded: useFilterExpandedState,
    useSearchEnumTerms,
  };

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllAnnotationFilters();
  const clearAllFilters = useClearAllAnnotationFilters();
  const filtersAppliedCount = useAppSelector(selectFiltersAppliedCount);

  return (
    <FilterPanel
      facetDefinitions={FilterFacets as FacetDefinition[]}
      facetHooks={facetHooks}
      valueLabel="Annotations"
      app="annotation-browser"
      toggleAllFiltersExpanded={toggleAllFiltersExpanded}
      allFiltersCollapsed={allFiltersCollapsed}
      handleClearAll={clearAllFilters}
      filtersAppliedCount={filtersAppliedCount}
    />
  );
};

export default AnnotationFacetPanel;
