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
    />
  );
};

export default QueryExpressionSection;
