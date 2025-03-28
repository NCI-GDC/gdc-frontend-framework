import React from "react";
import { partial } from "lodash";
import {
  fieldNameToTitle,
  GQLDocType,
  selectAnnotationFacetByField,
} from "@gff/core";
import { Group, Text } from "@mantine/core";
import { createFacetCards } from "@gff/portal-components";
import { useTotalCounts, useLocalFilters } from "@/features/facets/hooks";
import FilterFacets from "./filters.json";
import {
  useAnnotationEnumValues,
  useAnnotationsFilters,
  useClearAnnotationFilters,
  useSelectFieldFilter,
  useUpdateAnnotationFacetFilter,
} from "./hooks";
import { useFieldNameToTitle } from "../cohortBuilder/queryExpressionHooks";

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
  };

  return (
    <>
      <Group justify="space-between">
        <Text size="lg" className="text-primary-content-darker font-bold">
          Filters
        </Text>
      </Group>
      <div
        data-testid="filters-facets"
        className="flex flex-col gap-y-4 h-screen overflow-y-scroll mr-3 mb-4 border-t-1 border-b-1 rounded-md"
      >
        {FilterFacets.map((x) => {
          return createFacetCards({
            facets: [x] as any,
            valueLabel: "Annotations",
            hooks: facetHooks as any,
            idPrefix: "annotation-browser",
            facetNameFormatter: (x) => fieldNameToTitle(x),
            width: "w-full",
          });
        })}
      </div>
    </>
  );
};

export default AnnotationFacetPanel;
