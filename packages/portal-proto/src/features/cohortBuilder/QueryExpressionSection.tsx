import React from "react";
import { QueryExpressionSection as CommonQueryExpressionSection } from "@gff/portal-components";
import { useCohortFacetFilters } from "@/features/cohortBuilder/utils";
import queryExpressionHooks from "./queryExpressionHooks";

const QueryExpressionSection = () => {
  const filters = useCohortFacetFilters();

  return (
    <CommonQueryExpressionSection
      filters={filters}
      hooks={queryExpressionHooks}
      warningText={
        "This cohort has deprecated properties and/or properties that no longer exist in the GDC. This may affect the cases in your cohort. Click here for more information."
      }
    />
  );
};

export default QueryExpressionSection;
