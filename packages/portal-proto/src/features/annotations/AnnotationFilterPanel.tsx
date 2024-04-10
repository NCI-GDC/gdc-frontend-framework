import React from "react";
import { partial } from "lodash";
import {
  FacetDefinition,
  fieldNameToTitle,
  GQLDocType,
  selectAnnotationFacetByField,
} from "@gff/core";
import { Group, Text } from "@mantine/core";
import { createFacetCard } from "@/features/facets/CreateFacetCard";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import { FacetRequiredHooks } from "@/features/facets/types";
import FilterFacets from "./filters.json";
import {
  useAnnotationEnumValues,
  useAnnotationsFilters,
  useClearAnnotationFilters,
  useSelectFieldFilter,
  useUpdateAnnotationFacetFilter,
} from "./hooks";

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
  };

  return (
    <>
      <Group position="apart">
        <Text size="lg" weight={700} className="text-primary-content-darker">
          Filters
        </Text>
      </Group>
      <div
        data-testid="filters-facets"
        className="flex flex-col gap-y-4 h-screen overflow-y-scroll mr-3 mb-4 border-t-1 border-b-1 rounded-md"
      >
        {FilterFacets.map((x) => {
          const facetName = x.title || fieldNameToTitle(x.full);
          return createFacetCard(
            x as Partial<FacetDefinition>,
            "Annotations",
            facetHooks,
            "annotation-browser",
            undefined,
            false,
            facetName,
            "w-full",
          );
        })}
      </div>
    </>
  );
};

export default AnnotationFacetPanel;
