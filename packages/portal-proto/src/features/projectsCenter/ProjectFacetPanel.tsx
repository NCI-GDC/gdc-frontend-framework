import React from "react";
import {
  FacetDefinition,
  GQLDocType,
  selectProjectsFacetByField,
} from "@gff/core";
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
} from "@/features/projectsCenter/hooks";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import FilterFacets from "./filters.json";
import partial from "lodash/partial";
import FilterPanel from "@/features/facets/FilterPanel";

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
    useTotalCounts: partial(useTotalCounts, "projectsCounts"),
    useToggleExpandFilter: useToggleExpandProjectFilter,
    useFilterExpanded: useFilterExpandedState,
  };

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllProjectFilters();

  return (
    <FilterPanel
      facetDefinitions={FilterFacets.project as FacetDefinition[]}
      facetHooks={ProjectFacetHooks}
      valueLabel="Projects"
      app="projects-center"
      toggleAllFiltersExpanded={toggleAllFiltersExpanded}
      allFiltersCollapsed={allFiltersCollapsed}
    />
  );
};

export default ProjectFacetPanel;
