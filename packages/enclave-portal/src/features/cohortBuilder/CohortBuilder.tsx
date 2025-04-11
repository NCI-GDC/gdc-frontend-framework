import React, { useState } from "react";
import { FacetTabs } from "@gff/portal-components";
import facetDefintions from "./facet_dictionary.json";
import tabsConfig from "./cohort_builder.json";
import { useGetEnumFacetData, useGetRangeFacetData } from "./hooks";
import { useFieldNameToTitle } from "@/hooks/useFieldNameToTitle";

const CohortBuilder: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<
    Record<string, any | undefined>
  >({});
  console.log({ activeFilters });

  return (
    <>
      <div className="flex flex-col">
        <FacetTabs
          hooks={{
            useClearFilter: () => (field: string) =>
              setActiveFilters({ ...activeFilters, [field]: undefined }),
            useUpdateFacetFilters: () => (field: string, op: any) =>
              setActiveFilters({ ...activeFilters, [field]: op }),
            useTotalCounts: () => 1,
            useFieldNameToTitle,
            useGetEnumFacetData: useGetEnumFacetData as any,
            useSearchEnumTerms: (enumData: [string, number][]) => enumData,
            useGetFacetFilters: (field: string) => activeFilters[field],
            useGetRangeFacetData: useGetRangeFacetData,
          }}
          facetDefinitions={facetDefintions}
          tabsConfig={tabsConfig.config}
          activeTab="general"
          setActiveTab={() => {}}
        />
      </div>
    </>
  );
};

export default CohortBuilder;
