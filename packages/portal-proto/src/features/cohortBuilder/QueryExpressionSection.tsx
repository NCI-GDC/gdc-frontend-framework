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
        <>
          This cohort has properties that no longer exist in the GDC. This may
          affect the cases in your cohort. Click{" "}
          <a
            href="https://docs.gdc.cancer.gov/Data_Portal/Release_Notes/Data_Portal_Release_Notes/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            here
          </a>{" "}
          for more information.
        </>
      }
    />
  );
};

export default QueryExpressionSection;
