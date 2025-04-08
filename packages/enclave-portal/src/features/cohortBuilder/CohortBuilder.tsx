import React from "react";
import { FacetTabs } from "@gff/portal-components";
import facetDefintions from "./facet_dictionary.json";
import tabsConfig from "./cohort_builder.json";
import { useGetEnumFacetData, useGetRangeFacetData } from "./hooks";

const CohortBuilder: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        <FacetTabs
          hooks={{
            useClearFilter: () => () => {},
            useUpdateFacetFilters: () => () => {},
            useTotalCounts: () => 1,
            useFieldNameToTitle: () => (field: string) =>
              field
                .split(".")
                .slice(-1)
                .map((s) => s.split("_"))
                .flat()
                .map((s) =>
                  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "",
                )
                .join(" "),
            useGetEnumFacetData: useGetEnumFacetData as any,
            useSearchEnumTerms: (enumData) => enumData,
            useGetFacetFilters: () => {},
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
