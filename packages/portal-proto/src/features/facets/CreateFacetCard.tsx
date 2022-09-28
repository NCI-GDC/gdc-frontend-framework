import React from "react";
import { FacetDefinition, GQLDocType, GQLIndexType } from "@gff/core";
import EnumFacet from "@/features/facets/EnumFacet";
import NumericRangeFacet from "@/features/facets/NumericRangeFacet";
import DateRangeFacet from "@/features/facets/DateRangeFacet";
import ExactValueFacet from "@/features/facets/ExactValueFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";

import { AllHooks } from "@/features/facets/types";

/**
 * createFacetCard given a facet definition it will create a
 * facet component appropriate for the facet
 * @param facet - facet definition
 * @param docType - docType for this facet
 * @param indexType - ES index
 * @param dataFunctions - data getter and settion hooks
 * @param idPrefix - prefix for generated id; this must be unique for the app
 * @param dismissCallback - callback when defined will remove facet from parent panel
 * @param hideIfEmpty - if there is no date, hide this facet
 * @param facetName - option name of facet
 * @param width - override width of facet
 */
export const createFacetCard = (
  facet: FacetDefinition,
  docType: GQLDocType,
  indexType: GQLIndexType,
  dataFunctions: AllHooks,
  idPrefix: string,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
  facetName?: string,
  width?: string,
): React.ReactNode => {
  if (facet.facet_type === "enum")
    return (
      <EnumFacet
        key={`${idPrefix}-enum-${facet.full}`}
        docType={docType}
        indexType={indexType}
        field={facet.full}
        facetName={facetName}
        description={facet.description}
        dismissCallback={dismissCallback}
        hideIfEmpty={hideIfEmpty}
        width={width}
        hooks={{
          useGetFacetData: dataFunctions.useGetEnumFacetData,
          ...dataFunctions,
        }}
      />
    );
  if (facet.facet_type == "exact") {
    return (
      <ExactValueFacet
        key={`${idPrefix}-exact-${facet.full}`}
        field={facet.full}
        dismissCallback={dismissCallback}
        hideIfEmpty={hideIfEmpty}
        hooks={{ ...dataFunctions }}
        facetName={facetName}
        width={width}
      />
    );
  }
  if (facet.facet_type == "toggle") {
    return (
      <ToggleFacet
        key={`${idPrefix}-toggle-${facet.full}`}
        field={facet.full}
        dismissCallback={dismissCallback}
        hideIfEmpty={hideIfEmpty}
        hooks={{
          useGetFacetData: dataFunctions.useGetEnumFacetData,
          ...dataFunctions,
        }}
        facetName={facetName}
        width={width}
      />
    );
  }
  if (facet.facet_type === "datetime")
    return (
      <DateRangeFacet
        key={`${idPrefix}-date-range-${facet.full}`}
        docType={docType}
        indexType={indexType}
        field={facet.full}
        description={facet.description}
        dismissCallback={dismissCallback}
        hideIfEmpty={hideIfEmpty}
        hooks={{
          ...dataFunctions,
        }}
        facetName={facetName}
        width={width}
      />
    );
  if (
    ["year", "years", "age", "days", "percent", "range"].includes(
      facet.facet_type,
    )
  ) {
    return (
      <NumericRangeFacet
        key={`${idPrefix}-range-${facet.full}`}
        field={facet.full}
        description={facet.description}
        rangeDatatype={facet.facet_type}
        docType={docType}
        indexType={indexType}
        minimum={facet?.range?.minimum}
        maximum={facet?.range?.maximum}
        hideIfEmpty={hideIfEmpty}
        hooks={{
          useGetFacetData: dataFunctions.useGetRangeFacetData,
          ...dataFunctions,
        }}
        dismissCallback={dismissCallback}
        facetName={facetName}
        width={width}
      />
    );
  }
};

export const createFacetCardsFromList = (
  facets: ReadonlyArray<FacetDefinition>,
  docType: GQLDocType,
  indexType: GQLIndexType,
  dataFunctions: AllHooks,
  idPrefix: string,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
  width?: string,
): ReadonlyArray<React.ReactNode> => {
  return facets.map((x) =>
    createFacetCard(
      x,
      docType,
      indexType,
      dataFunctions,
      idPrefix,
      dismissCallback,
      hideIfEmpty,
      width,
    ),
  );
};
