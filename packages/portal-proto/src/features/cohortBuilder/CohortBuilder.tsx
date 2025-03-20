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
  useTotalCounts,
  useUpdateFacetFilter,
} from "@/features/facets/hooks";
import {
  usePopulateFacetData,
  useCustomFacets,
  useAvailableCustomFacets,
  useAddCustomFilter,
  useRemoveCustomFilter,
} from "./hooks";
import { useFieldNameToTitle } from "./queryExpressionHooks";

const getFacetLabel = (queryOptions) => {
  return FacetDocTypeToLabelsMap[queryOptions.docType];
};

const CohortBuilder = () => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  const facets =
    useCoreSelector((state) => selectFacetDefinition(state)).data || {};

  // TODO
  /*
  const router = useRouter();
  let routerTab = router?.query?.tab;
  const prevRouterTab = usePrevious(routerTab);

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
    */

  return (
    <FacetTabs
      facetDefinitions={facets}
      tabsConfig={tabsConfig}
      hooks={{
        useGetEnumFacetData: useEnumFacetValues,
        //useGetRangeFacetData: useRangeFacet,
        //useGetFacetFilters: useSelectFieldFilter,
        useUpdateFacetFilters: useUpdateFacetFilter,
        useClearFilter: useClearFilters,
        useTotalCounts,
        useFieldNameToTitle: useFieldNameToTitle,
      }}
      customFacetHooks={{
        useCustomFacets,
        useAvailableCustomFacets,
        useAddCustomFilter,
        useRemoveCustomFilter,
      }}
      usePopulateFacetData={usePopulateFacetData}
      getFacetLabel={getFacetLabel}
    />
  );
};

export default CohortBuilder;
