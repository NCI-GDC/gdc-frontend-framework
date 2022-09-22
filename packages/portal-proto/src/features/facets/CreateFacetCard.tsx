import React from "react";
import { FacetDefinition, GQLDocType, GQLIndexType } from "@gff/core";
import { EnumFacet } from "@/features/facets/EnumFacet";
import NumericRangeFacet from "@/features/facets/NumericRangeFacet";
import DateRangeFacet from "@/features/facets/DateRangeFacet";
import ExactValueFacet from "@/features/facets/ExactValueFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";

import { FacetDataFunctions } from "@/features/facets/types";

export const createFacetCard = (
  facets: ReadonlyArray<FacetDefinition>,
  docType: GQLDocType,
  indexType: GQLIndexType,
  dataFunctions: FacetDataFunctions,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
): ReadonlyArray<React.ReactNode> => {
  return facets.map((x, index) => {
    // TODO Add passed hooks/functions to other Enum and Range Facets
    if (x.facet_type === "enum")
      return (
        <EnumFacet
          key={`${x.full}-${index}`}
          docType={docType}
          indexType={indexType}
          field={x.full}
          description={x.description}
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
          dataFunctions={dataFunctions}
        />
      );
    if (x.facet_type === "datetime")
      return (
        <DateRangeFacet
          key={`${x.full}-${index}`}
          docType={docType}
          indexType={indexType}
          field={x.full}
          description={x.description}
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
          dataFunctions={dataFunctions}
        />
      );
    if (
      [
        "year",
        "years",
        "age",
        "days",
        "numeric",
        "integer",
        "percent",
        "range",
      ].includes(x.facet_type)
    ) {
      return (
        <NumericRangeFacet
          key={`${x.full}-${index}`}
          field={x.full}
          description={x.description}
          rangeDatatype={x.facet_type}
          docType={docType}
          indexType={indexType}
          minimum={x?.range?.minimum}
          maximum={x?.range?.maximum}
          hideIfEmpty={hideIfEmpty}
          dataFunctions={dataFunctions}
          dismissCallback={dismissCallback}
        />
      );
    }
  });
};
