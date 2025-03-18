import React from "react";
import {
  selectCohortBuilderConfig,
  useCoreSelector,
  selectFacetDefinition,
} from "@gff/core";
import { FacetTabs } from "@gff/portal-components";
import {
  FacetDocTypeToLabelsMap,
  useEnumFacetValues,
  useClearFilters,
  //useRangeFacet,
  useSelectFieldFilter,
  useTotalCounts,
  useUpdateFacetFilter,
  FacetDocTypeToCountsIndexMap,
  //useEnumFacets,
} from "@/features/facets/hooks";
import { useFieldNameToTitle } from "./queryExpressionHooks";

const CohortBuilder = () => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  const facets =
    useCoreSelector((state) => selectFacetDefinition(state)).data || {};

  console.log({ facets });

  return (
    <FacetTabs
      facetDefinitions={facets}
      tabsConfig={tabsConfig}
      FacetDocTypeToLabelsMap={FacetDocTypeToLabelsMap}
      hooks={{
        useGetEnumFacetData: useEnumFacetValues,
        //useGetRangeFacetData: useRangeFacet,
        //useGetFacetFilters: useSelectFieldFilter,
        useUpdateFacetFilters: useUpdateFacetFilter,
        useClearFilter: useClearFilters,
        useTotalCounts,
        useFieldNameToTitle: useFieldNameToTitle,
      }}
      usePopulateFacetSearchData={(() => () => {}) as any}
    />
  );
};

export default CohortBuilder;
