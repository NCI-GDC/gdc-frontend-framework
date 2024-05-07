import React from "react";
import {
  FacetDefinition,
  GQLDocType,
  fieldNameToTitle,
  selectProjectsFacetByField,
} from "@gff/core";
import { Group, Text } from "@mantine/core";
import {
  useClearProjectsFilters,
  useSelectFieldFilter,
  useUpdateProjectsFacetFilter,
  useProjectEnumValues,
  useProjectsFilters,
} from "@/features/projectsCenter/hooks";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import { createFacetCard } from "@/features/facets/CreateFacetCard";
import { FacetRequiredHooks } from "@/features/facets/types";
import FilterFacets from "./filters.json";
import partial from "lodash/partial";

const useProjectEnumData = (docType: GQLDocType, field: string) =>
  useLocalFilters(
    field,
    docType,
    useProjectEnumValues,
    useProjectsFilters,
    selectProjectsFacetByField,
  );

export const ProjectFacetPanel = (): JSX.Element => {
  const ProjectFacetHooks: FacetRequiredHooks = {
    useGetEnumFacetData: partial(useProjectEnumData, "projects"),
    useUpdateFacetFilters: useUpdateProjectsFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearProjectsFilters,
    useTotalCounts: partial(useTotalCounts, "projectsCounts"),
  };

  return (
    <div className="flex flex-col gap-y-2 mt-1 w-1/4">
      <Group>
        <Text size="lg" className="text-primary-content-darker font-bold">
          Filters
        </Text>
      </Group>
      <div
        data-testid="filters-facets"
        className="flex flex-col gap-y-4 h-screen overflow-y-scroll mr-3 mb-4 border-t-1 border-b-1 rounded-md"
      >
        {FilterFacets.project.map((x) => {
          const facetName = x.title || fieldNameToTitle(x.full);
          return createFacetCard(
            x as Partial<FacetDefinition>,
            "Projects",
            ProjectFacetHooks,
            "projects-center",
            undefined,
            false,
            facetName,
            "w-full",
          );
        })}
      </div>
    </div>
  );
};

export default ProjectFacetPanel;
