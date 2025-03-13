import React from "react";
import { FacetTabs } from "@gff/portal-components";
import tabsConfig from "./cohort_builder.json";

const CohortBuilder: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        <FacetTabs
          hooks={{
            useClearFilter: () => () => {},
            useUpdateFacetFilters: () => () => {},
            useTotalCounts: () => 0,
            useFieldNameToTitle: () => (field) => field,
            useGetEnumFacetData: () => () => ({ data: {} }),
          }}
          facetDefinitions={{}}
          tabsConfig={tabsConfig.config}
          usePopulateFacetData={() => () => {}}
          FacetDocTypeToLabelsMap={{}}
        />
      </div>
    </>
  );
};

export default CohortBuilder;
