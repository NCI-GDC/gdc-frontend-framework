import React, { useEffect, useState, useCallback } from "react";
import {
  FacetDefinition,
  GQLDocType,
  GQLIndexType,
  selectCurrentCohortFilters,
  selectFacetDefinitionsByName,
  useCoreSelector,
  useFacetDictionary,
  usePrevious,
  fieldNameToTitle,
} from "@gff/core";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/projectCenter/appApi";
import { Group, Button, LoadingOverlay, Text, Modal } from "@mantine/core";
import { useSelectFieldFilter } from "@/features/projectCenter/hooks";
import { useTotalCounts } from "@/features/facets/hooks";
import { createFacetCard } from "@/features/facets/CreateFacetCard";
import { AllHooks } from "@/features/facets/types";
import FilterFacets from "./filters.json";

const useProjectEnumData = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
) =>
  useLocalFilters(
    field,
    docType,
    indexType,
    useRepositoryEnumValues,
    useRepositoryFilters,
  );

export const ProjectFacetPanel = (): JSX.Element => {
  const ProjectFacetHooks: AllHooks = {
    useGetEnumFacetData: useProjectEnumData,
    useGetRangeFacetData: useRepositoryRangeFacet,
    useUpdateFacetFilters: useUpdateRepositoryFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearRepositoryFilters,
    useTotalCounts: useTotalCounts,
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
            "projects",
            "projects",
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
