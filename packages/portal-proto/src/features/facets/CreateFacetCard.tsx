import { FacetDefinition, GQLDocType, GQLIndexType } from "@gff/core";
import { EnumFacet } from "@/features/facets/EnumFacet";
import NumericRangeFacet from "@/features/facets/NumericRangeFacet";
import React from "react";

export const createFacetCard = (
  facets: ReadonlyArray<FacetDefinition>,
  docType: GQLDocType,
  indexType: GQLIndexType,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
): ReadonlyArray<React.ReactNode> => {
  return facets.map((x, index) => {
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
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
        />
      );
    }
  });
};
