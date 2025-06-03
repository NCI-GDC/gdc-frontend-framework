import React, { useState } from "react";
import { FacetTabs, Operation } from "@gff/portal-components";
import { useFieldNameToTitle } from "@/hooks/useFieldNameToTitle";
import facetDefintions from "./facet_dictionary.json";
import tabsConfig from "./cohort_builder.json";
import { useGetEnumFacetData } from "./hooks";

const CohortBuilder: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<
    Record<string, any | undefined>
  >({});

  return (
    <>
      <div className="flex flex-col">
        <FacetTabs
          hooks={{
            useClearFilter: () => (field: string) =>
              setActiveFilters({ ...activeFilters, [field]: undefined }),
            useUpdateFacetFilters: () => (field: string, op: Operation) =>
              setActiveFilters({ ...activeFilters, [field]: op }),
            useTotalCounts: () => 1,
            useFieldNameToTitle,
            useGetEnumFacetData: useGetEnumFacetData,
            useSearchEnumTerms: (
              enumData: [string, number][],
              searchTerm: string,
            ) => enumData.filter((e) => e[0].startsWith(searchTerm)),
            useGetFacetFilters: (field: string) => activeFilters[field],
            useGetRangeFacetData: () => () => undefined,
          }}
          usedFacets={[]}
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
