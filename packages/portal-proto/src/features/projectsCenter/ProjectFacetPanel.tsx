import React from "react";
import {
  FacetDefinition,
  GQLDocType,
  GQLIndexType,
  fieldNameToTitle,
} from "@gff/core";
import { Group, Text } from "@mantine/core";
import {
  useClearProjectsFilters,
  useSelectFieldFilter,
  useUpdateProjectsFacetFilter,
  useLocalFilters,
  useProjectEnumValues,
  useProjectsFilters,
} from "@/features/projectsCenter/hooks";
import { useTotalCounts } from "@/features/facets/hooks";
import { createFacetCard } from "@/features/facets/CreateFacetCard";
import { FacetRequiredHooks } from "@/features/facets/types";
import FilterFacets from "./filters.json";
import partial from "lodash/partial";

const useProjectEnumData = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
) =>
  useLocalFilters(
    field,
    docType,
    indexType,
    useProjectEnumValues,
    useProjectsFilters,
  );

export const ProjectFacetPanel = (): JSX.Element => {
  const ProjectFacetHooks: FacetRequiredHooks = {
    useGetEnumFacetData: partial(useProjectEnumData, "projects", "explore"),
    useUpdateFacetFilters: useUpdateProjectsFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearProjectsFilters,
    useTotalCounts: partial(useTotalCounts, "projectsCounts"),
  };

  return (
    <div className="flex flex-col gap-y-4 mr-3 w-1/5  ">
      <Group position="apart">
        <Text size="lg" weight={700} className="text-primary-content-darker">
          Filters
        </Text>
      </Group>
      <div className="flex flex-col gap-y-4 mr-3 h-screen/1.5 overflow-y-scroll">
        {FilterFacets.project.map((x) => {
          const facetName = fieldNameToTitle(x.full);
          return createFacetCard(
            x as FacetDefinition,
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
