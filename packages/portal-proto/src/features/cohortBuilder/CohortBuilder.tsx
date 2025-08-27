import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  selectCohortBuilderConfig,
  useCoreSelector,
  selectFacetDefinition,
  usePrevious,
  selectCohortBuilderConfigFilters,
} from "@gff/core";
import { FacetTabs } from "@gff/portal-components";
import {
  FacetDocTypeToLabelsMap,
  useEnumFacetValues,
  useClearFilters,
  useTotalCounts,
  useUpdateFacetFilter,
  useRangeFacet,
  useSelectFieldFilter,
} from "@/features/facets/hooks";
import { EnumFacetChart } from "@/features/charts/EnumFacetChart";
import {
  usePopulateFacetData,
  useCustomFacets,
  useAvailableCustomFacets,
  useAddCustomFilter,
  useRemoveCustomFilter,
  useSearchEnumTerms,
  useOpenUploadModal,
  useUploadFilterItems,
} from "./hooks";
import queryExpressionHooks, {
  useFieldNameToTitle,
} from "./queryExpressionHooks";
import { calculateStickyHeaderHeight } from "src/utils";
import { upload_facets } from "./utils";

const getFacetLabel = (queryOptions) => {
  return FacetDocTypeToLabelsMap[queryOptions.docType];
};

const CohortBuilder = () => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  const facets = useCoreSelector((state) => selectFacetDefinition(state));

  const router = useRouter();
  const routerTab = router?.query?.tab;
  const prevRouterTab = usePrevious(routerTab);
  const [activeTab, setActiveTab] = useState<string | null>(
    routerTab ? (routerTab as string) : Object.keys(tabsConfig)[0],
  );
  const cohortBuilderFilters = useCoreSelector((state) =>
    selectCohortBuilderConfigFilters(state),
  );

  useEffect(() => {
    // Check if the change was initiated by the router
    if (routerTab !== prevRouterTab) {
      setActiveTab(routerTab as string);
    } else {
      // Change initiated by user interaction
      if (activeTab !== routerTab) {
        router.push({ query: { ...router.query, tab: activeTab } }, undefined, {
          scroll: false,
        });
      }
    }
    // https://github.com/vercel/next.js/discussions/29403#discussioncomment-1908563
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, routerTab, prevRouterTab]);

  const facetDefinitions = useDeepCompareMemo(
    () => ({
      ...Object.fromEntries(
        Object.entries(facets?.data || {}).map(([key, f]) => [
          key,
          { ...f, field: f.full },
        ]),
      ),
      ...upload_facets,
    }),
    [facets],
  );

  return (
    <FacetTabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      facetDefinitions={facetDefinitions}
      tabsConfig={tabsConfig}
      usedFacets={cohortBuilderFilters}
      hooks={{
        useGetEnumFacetData: useEnumFacetValues,
        useSearchEnumTerms,
        useGetRangeFacetData: useRangeFacet,
        useGetFacetFilters: useSelectFieldFilter,
        useUpdateFacetFilters: useUpdateFacetFilter,
        useClearFilter: useClearFilters,
        useTotalCounts,
        useFieldNameToTitle: useFieldNameToTitle,
        useOpenUploadModal,
        useFilterItems: useUploadFilterItems,
        usePopulateFacetData,
        ...queryExpressionHooks,
      }}
      customFacetHooks={{
        useCustomFacets,
        useAvailableCustomFacets,
        useAddCustomFilter,
        useRemoveCustomFilter,
      }}
      getFacetLabel={getFacetLabel}
      cardScrollMargin={calculateStickyHeaderHeight()}
      Chart={EnumFacetChart}
    />
  );
};

export default CohortBuilder;
