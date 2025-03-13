import React from "react";
import {
  selectCohortBuilderConfig,
  useCoreSelector,
  selectFacetDefinition,
} from "@gff/core";
import { FacetTabs } from "@gff/portal-components";
import { FacetDocTypeToLabelsMap } from "@/features/facets/hooks";

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
      hooks={{}}
      usePopulateFacetData={() => () => {}}
    />
  );
};

export default CohortBuilder;
