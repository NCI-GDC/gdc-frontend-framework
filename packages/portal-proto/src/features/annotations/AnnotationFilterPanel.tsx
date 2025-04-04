import React from "react";
import { partial } from "lodash";
import {
  FacetDefinition,
  GQLDocType,
  selectAnnotationFacetByField,
} from "@gff/core";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import { FacetRequiredHooks } from "@/features/facets/types";
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
import FilterPanel from "../facets/FilterPanel";
import { selectFiltersAppliedCount } from "./annotationBrowserFilterSlice";
import { useAppSelector } from "./appApi";

const useAnnotationEnumData = (docType: GQLDocType, field: string) =>
  useLocalFilters(
    field,
    docType,
    useAnnotationEnumValues,
    useAnnotationsFilters,
    selectAnnotationFacetByField,
  );

export const AnnotationFacetPanel = (): JSX.Element => {
  const facetHooks: FacetRequiredHooks = {
    useGetEnumFacetData: partial(useAnnotationEnumData, "annotations"),
    useUpdateFacetFilters: useUpdateAnnotationFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearAnnotationFilters,
    useTotalCounts: partial(useTotalCounts, "annotationCounts"),
    useToggleExpandFilter: useToggleExpandAnnotationFilter,
    useFilterExpanded: useFilterExpandedState,
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
