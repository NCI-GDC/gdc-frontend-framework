import React from "react";
import { FacetTabs } from "@gff/portal-components";
import facetDefintions from "./facet_dictionary.json";
import tabsConfig from "./cohort_builder.json";
import { useGetEnumFacetData } from "./hooks";

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
                .join(" "),
            useGetEnumFacetData: useGetEnumFacetData as any,
            useSearchEnumTerms: (enumData) => enumData,
          }}
          facetDefinitions={facetDefintions}
          tabsConfig={tabsConfig.config}
          getFacetLabel={() => "Cases"}
          usePopulateFacetData={() => {}}
          activeTab="general"
          setActiveTab={() => {}}
        />
      </div>
    </>
  );
};

export default CohortBuilder;
