import React from "react";
import EnumFacet from "./facetTypes/EnumFacet";
import NumericRangeFacet from "./facetTypes/NumericRangeFacet";
import UploadFacet from "./facetTypes/UploadFacet";
import DateRangeFacet from "./facetTypes/DateRangeFacet";
import {
  EnumFacetHooks,
  RangeFacetHooks,
  UploadFacetHooks,
  FacetCardDefinition,
  FacetRequiredHooks,
} from "./types";

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
  facets: FacetCardDefinition[];
  valueLabel: string;
  hooks: FacetRequiredHooks;
  idPrefix: string;
  dismissCallback?: (field: string) => void;
  hideIfEmpty?: boolean;
  showPercent?: boolean;
  facetName?: string;
  facetNameSections?: number;
  width?: string;
  queryOptions?: Record<string, string>;
  cardScrollMargin?: number;
  Chart?: React.FC;
}

const createFacetCards = ({
  facets,
  valueLabel,
  hooks,
  idPrefix,
  dismissCallback,
  hideIfEmpty = false,
  showPercent = true,
  facetName,
  width,
  queryOptions,
  cardScrollMargin,
  Chart,
}: CreateFacetCardProps): React.ReactNode => {
  return facets.map((facet) => {
    if (facet.facet_type === "enum") {
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
            ...(hooks as EnumFacetHooks),
          }}
          queryOptions={queryOptions}
          cardScrollMargin={cardScrollMargin}
          Chart={Chart}
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
            ...(hooks as RangeFacetHooks),
          }}
          facetName={facetName}
          width={width}
        />
      );

    if (
      facet.facet_type &&
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
            ...(hooks as RangeFacetHooks),
          }}
          dismissCallback={dismissCallback}
          facetName={facetName}
          width={width}
          queryOptions={queryOptions}
          cardScrollMargin={cardScrollMargin}
          Chart={Chart}
        />
      );
    }
    if (facet.facet_type === "upload") {
      return (
        <UploadFacet
          key={`${idPrefix}-exact-${facet.field}`}
          field={facet.field}
          fullField={facet.full}
          facetTitle={facet.title}
          uploadLabel={facet.uploadLabel}
          width={width}
          facetBtnToolTip={facet.toolTip}
          hooks={{ ...(hooks as UploadFacetHooks) }}
        />
      );
    }

    return (
      <div key={`${idPrefix}-unknown-${facet.full}`}>
        {" "}
        Unknown FacetType {facet.facet_type}
      </div>
    );
  });
};

export default createFacetCards;
