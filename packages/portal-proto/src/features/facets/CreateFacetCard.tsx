import React from "react";
import { FacetDefinition, GQLDocType, GQLIndexType } from "@gff/core";
import EnumFacet from "@/features/facets/EnumFacet";
import NumericRangeFacet from "@/features/facets/NumericRangeFacet";
import DateRangeFacet from "@/features/facets/DateRangeFacet";
import ExactValueFacet from "@/features/facets/ExactValueFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";
import {
  FacetRequiredHooks,
  FacetRequiredHooksGQL,
} from "@/features/facets/types";
import {
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
} from "@/features/facets/hooks";
import partial from "lodash/partial";

/**
 * createFacetCard given a facet definition it will create a
 * facet component appropriate for the facet
 * All facets require a set of functions (e.g. hooks) which define get/set data,
 * filters, and counts. As create facets can create any facet all possible
 * function must be supplied:
 * The AllHooks type defines all possible hooks
 *
 * @param facet - facet definition
 * @param valueLabel - label for Counts (if present)
 * @param dataFunctions - data getter and setter hooks
 * @param idPrefix - prefix for generated id; this must be unique for the app
 * @param dismissCallback - callback when defined will remove facet from parent panel
 * @param hideIfEmpty - if there is no date, hide this facet
 * @param facetName - option name of facet
 * @param width - override width of facet
 */
export const createFacetCardGQL = (
  facet: FacetDefinition,
  valueLabel: string,
  dataFunctions: FacetRequiredHooks,
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
        valueLabel={valueLabel}
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
        valueLabel={valueLabel}
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
        valueLabel={valueLabel}
        description={facet.description}
        rangeDatatype={facet.facet_type}
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

/**
 * Creates and returns an array of Facet components defined by the facet definition array
 * @param facets - array of FacetDefinitions to create
 * @param docType - docType: cases, files, genes, ssms, and projects
 * @param indexType - which index to use explore or repository
 * @param dataFunctions - get/set hooks
 * @param idPrefix - prefix for created Facet Component key prop. This is used to ensure the ref
 *                  has a 1) unique 2) persistent id, so each call to createFacetCardsFromList must
 *                  have a unique prefix, the name of the analysis tool is a good choice
 * @param dismissCallback - define if facet should be removable from their parent
 * @param hideIfEmpty - hide facets if they do not have data
 * @param width - override the default width.
 */
export const createFacetCardsFromListGQL = (
  facets: ReadonlyArray<FacetDefinition>,
  docType: GQLDocType,
  indexType: GQLIndexType,
  dataFunctions: FacetRequiredHooksGQL,
  idPrefix: string,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
  facetName?: string,
  width?: string,
): ReadonlyArray<React.ReactNode> => {
  const hooks: FacetRequiredHooks = {
    useGetRangeFacetData: partial(
      dataFunctions.useGetRangeFacetData,
      docType,
      indexType,
    ),
    useGetEnumFacetData: partial(
      dataFunctions.useGetEnumFacetData,
      docType,
      indexType,
    ),
    useTotalCounts: partial(
      dataFunctions.useTotalCounts,
      FacetDocTypeToCountsIndexMap[docType],
    ),
    useClearFilter: dataFunctions.useClearFilter,
    useUpdateFacetFilters: dataFunctions.useUpdateFacetFilters,
    useGetFacetFilters: dataFunctions.useGetFacetFilters,
  };

  return facets.map((x) =>
    createFacetCardGQL(
      x,
      FacetDocTypeToLabelsMap[docType],
      hooks,
      idPrefix,
      dismissCallback,
      hideIfEmpty,
      facetName,
      width,
    ),
  );
};
