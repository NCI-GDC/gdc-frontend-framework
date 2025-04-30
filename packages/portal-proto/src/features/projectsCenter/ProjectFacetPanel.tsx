import React from "react";
import { GQLDocType, selectProjectsFacetByField } from "@gff/core";
import {
  useClearProjectsFilters,
  useSelectFieldFilter,
  useUpdateProjectsFacetFilter,
  useProjectEnumValues,
  useProjectsFilters,
  useToggleAllProjectFilters,
  useFilterExpandedState,
  useToggleExpandProjectFilter,
  useAllFiltersCollapsed,
  useClearAllProjectFilters,
} from "@/features/projectsCenter/hooks";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import FilterFacets from "./filters.json";
import partial from "lodash/partial";
import FilterPanel from "@/features/facets/FilterPanel";
import { useAppSelector } from "./appApi";
import { selectFiltersAppliedCount } from "./projectCenterFiltersSlice";
import { useFieldNameToTitle } from "../cohortBuilder/queryExpressionHooks";
import { useSearchEnumTerms } from "../cohortBuilder/hooks";

const useProjectEnumData = (docType: GQLDocType, field: string) =>
  useLocalFilters(
    field,
    docType,
    useProjectEnumValues,
    useProjectsFilters,
    selectProjectsFacetByField,
  );

export const ProjectFacetPanel = (): JSX.Element => {
  const ProjectFacetHooks = {
    useGetEnumFacetData: partial(useProjectEnumData, "projects"),
    useUpdateFacetFilters: useUpdateProjectsFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearProjectsFilters,
    useTotalCounts: useTotalCounts,
    useToggleExpandFilter: useToggleExpandProjectFilter,
    useFilterExpanded: useFilterExpandedState,
    useFieldNameToTitle,
    useSearchEnumTerms,
  };

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllProjectFilters();
  const clearAllFilters = useClearAllProjectFilters();
  const filtersAppliedCount = useAppSelector(selectFiltersAppliedCount);

  return (
    <FilterPanel
      facetDefinitions={FilterFacets.project}
      facetHooks={ProjectFacetHooks}
      valueLabel="Projects"
      app="projects-center"
      toggleAllFiltersExpanded={toggleAllFiltersExpanded}
      allFiltersCollapsed={allFiltersCollapsed}
      handleClearAll={clearAllFilters}
      filtersAppliedCount={filtersAppliedCount}
    />
  );
};

export default ProjectFacetPanel;
