import React from "react";
import { fieldNameToTitle } from "@gff/core";
import EnumFacet from "@/features/facets/EnumFacet";
import NumericRangeFacet from "@/features/facets/NumericRangeFacet";
import DateRangeFacet from "@/features/facets/DateRangeFacet";
import ExactValueFacet from "@/features/facets/ExactValueFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";
import SetFacet from "./SetFacet";
import {
  EnumFacetHooks,
  FacetCardDefinition,
  FacetRequiredHooks,
  RangeFacetHooks,
  SetFacetHooks,
  ValueFacetHooks,
} from "@/features/facets/types";
import UploadFacet from "@/features/facets/UploadFacet";

/**
 * createFacetCard given a facet definition it will create a
 * facet component appropriate for the facet
 * All facets require a set of functions (e.g. hooks) which define get/set data,
 * filters, and counts. As create facets can create any facet type, all possible
 * functions must be supplied (i.e. include the EnumFacetHooks and RangeFacetHooks in dataFunctions
 * if your app can create both).
 *
 * @param facet - facet definition
 * @param valueLabel - label for counts
 * @param dataFunctions - data getter and setter hooks
 * @param idPrefix - prefix for created Facet Component key prop. This is used to ensure the ref
 *                  has a 1) unique 2) persistent id, so each call to createFacetCardsFromList must
 *                  have a unique prefix, the name of the analysis tool is a good choice
 * @param dismissCallback - callback when defined will remove facet from parent panel
 * @param hideIfEmpty - hide facets if they do not have data
 * @param showPercent - whether to show the count percent of whole
 * @param facetName - optional name of facet (if undefined it will be extracted from the full field name)
 * @param width -  override the default width
 */

interface CreateFacetCardProps {
  facet: Partial<FacetCardDefinition>;
  valueLabel: string;
  dataFunctions: FacetRequiredHooks;
  idPrefix: string;
  dismissCallback?: (field: string) => void;
  hideIfEmpty?: boolean;
  showPercent?: boolean;
  facetName?: string;
  width?: string;
}

export const createFacetCard = ({
  facet,
  valueLabel,
  dataFunctions,
  idPrefix,
  dismissCallback,
  hideIfEmpty = false,
  showPercent = true,
  facetName,
  width,
}: CreateFacetCardProps): React.ReactNode => {
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
        showPercent={showPercent}
        width={width}
        hooks={{
          ...(dataFunctions as EnumFacetHooks),
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
        hooks={{ ...(dataFunctions as ValueFacetHooks) }}
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
        showPercent={showPercent}
        hooks={{
          ...(dataFunctions as EnumFacetHooks),
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
          ...(dataFunctions as RangeFacetHooks),
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
          ...(dataFunctions as RangeFacetHooks),
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
        customFaceTitle={facet.title}
        useClearFilter={dataFunctions.useClearFilter}
        facetButtonName={facet.full}
        width={width}
        description={facet.description}
      />
    );
  } else if (facet.facet_type === "set") {
    return (
      <SetFacet
        key={`${idPrefix}-set-${facet.full}`}
        facetName={facet?.name}
        facetTitle={facet.title}
        facetBtnToolTip={facet?.toolTip}
        field={facet.full}
        valueLabel={valueLabel}
        hooks={dataFunctions as SetFacetHooks}
      />
    );
  }
  return <div> Unknown FacetType {facet.facet_type}</div>;
};

type CreateFacetCardFromListProps = Pick<
  CreateFacetCardProps,
  | "dataFunctions"
  | "idPrefix"
  | "valueLabel"
  | "dismissCallback"
  | "hideIfEmpty"
  | "showPercent"
  | "width"
> & { facets: Partial<FacetCardDefinition>[]; facetNameSections?: number };

/**
 * Creates and returns an array of Facet components defined by the facet definition array
 * @param facet - array of FacetDefinitions to create
 * @param dataFunctions - data getter and setter hooks
 * @param valueLabel - label for counts
 * @param idPrefix - prefix for created Facet Component key prop. This is used to ensure the ref
 *                  has a 1) unique 2) persistent id, so each call to createFacetCardsFromList must
 *                  have a unique prefix, the name of the analysis tool is a good choice
 * @param dismissCallback - define if facet should be removable from their parent
 * @param hideIfEmpty - hide facets if they do not have data
 * @param showPercent - whether to show the count percent of whole
 * @param facetName - optional name of facet (if undefined it will be extracted from the full field name)
 * @param width - override the default width
 */

export const createFacetCardsFromList = ({
  facets,
  dataFunctions,
  idPrefix,
  valueLabel,
  dismissCallback = undefined,
  hideIfEmpty = false,
  showPercent = true,
  facetNameSections = 1,
  width = undefined,
}: CreateFacetCardFromListProps): ReadonlyArray<React.ReactNode> => {
  return facets.map((x) =>
    createFacetCard({
      facet: x,
      valueLabel,
      dataFunctions,
      idPrefix,
      dismissCallback,
      hideIfEmpty,
      showPercent,
      facetName: fieldNameToTitle(x.full, facetNameSections),
      width,
    }),
  );
};
