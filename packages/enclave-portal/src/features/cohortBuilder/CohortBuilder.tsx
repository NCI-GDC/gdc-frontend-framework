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
            useTotalCounts: () => 0,
            useFieldNameToTitle: () => (field: string) =>
              field
                .split(".")
                .slice(-1)
                .map((s) => s.split("_"))
                .flat()
                .join(" "),
            useGetEnumFacetData: useGetEnumFacetData as any,
          }}
          facetDefinitions={facetDefintions}
          tabsConfig={tabsConfig.config}
          getFacetLabel={() => "Cases"}
        />
      </div>
    </>
  );
};

export default CohortBuilder;
