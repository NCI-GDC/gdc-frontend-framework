import React from "react";
import { FacetDefinition } from "@gff/core";
import EnumFacet from "@/features/facets/EnumFacet";
import NumericRangeFacet from "@/features/facets/NumericRangeFacet";
import DateRangeFacet from "@/features/facets/DateRangeFacet";
import ExactValueFacet from "@/features/facets/ExactValueFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";
import { FacetRequiredHooks } from "@/features/facets/types";
import UploadFacet from "@/features/facets/UploadFacet";

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
export const createFacetCard = (
  facet: Partial<FacetDefinition>,
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
    [
      "year",
      "years",
      "age",
      "age_in_years",
      "days",
      "percent",
      "range",
    ].includes(facet.facet_type)
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
  if (facet.facet_type === "upload") {
    const field = facet.field.replace("upload.", "");
    return (
      <UploadFacet
        key={`${idPrefix}-exact-${field}`}
        field={field}
        customFaceTitle={field === "genes.gene_id" ? "gene" : undefined}
        useClearFilter={dataFunctions.useClearFilter}
        facetButtonName={facet.full}
        width={width}
        description={facet.description}
      />
    );
  }
  return <div> Unknown FacetType {facet.facet_type}</div>;
};

/**
 * Creates and returns an array of Facet components defined by the facet definition array
 * @param facets - array of FacetDefinitions to create
 * @param dataFunctions - get/set hooks
 * @param valueLabel - string used to label counts
 * @param idPrefix - prefix for created Facet Component key prop. This is used to ensure the ref
 *                  has a 1) unique 2) persistent id, so each call to createFacetCardsFromList must
 *                  have a unique prefix, the name of the analysis tool is a good choice
 * @param dismissCallback - define if facet should be removable from their parent
 * @param hideIfEmpty - hide facets if they do not have data
 * @param facetName - optional name of facet (if undefined it will be extracted from the full field name)
 * @param width - override the default width.
 */
export const createFacetCardsFromList = (
  facets: ReadonlyArray<FacetDefinition>,
  dataFunctions: FacetRequiredHooks,
  idPrefix: string,
  valueLabel: string,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
  facetName?: string,
  width?: string,
): ReadonlyArray<React.ReactNode> => {
  return facets.map((x) =>
    createFacetCard(
      x,
      valueLabel,
      dataFunctions,
      idPrefix,
      dismissCallback,
      hideIfEmpty,
      facetName,
      width,
    ),
  );
};
