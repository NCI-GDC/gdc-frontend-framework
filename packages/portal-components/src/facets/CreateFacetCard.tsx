import React from "react";
import EnumFacet from "./facetTypes/EnumFacet";
import NumericRangeFacet from "./facetTypes/NumericRangeFacet";
import UploadFacet from "./facetTypes/UploadFacet";
import DateRangeFacet from "./facetTypes/DateRangeFacet";
import ExactValueFacet from "./facetTypes/ExactValueFacet";
import ToggleFacet from "./facetTypes/ToggleFacet";
import {
  EnumFacetHooks,
  RangeFacetHooks,
  UploadFacetHooks,
  FacetCardDefinition,
  FacetRequiredHooks,
  ValueFacetHooks,
} from "./types";
import { QueryExpressionHooks } from "@/cohort/QueryExpression/types";

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
 * @param facetNameFormatter - function that takes the full field and returns a human readable name
 * @param width -  override the default width
 */

interface CreateFacetCardProps {
  facets: FacetCardDefinition[];
  valueLabel: string;
  hooks: FacetRequiredHooks;
  facetNameFormatter: (field: string) => string;
  queryExpressionHooks?: QueryExpressionHooks;
  idPrefix: string;
  dismissCallback?: (field: string) => void;
  hideIfEmpty?: boolean;
  showPercent?: boolean;
  queryOptions?: Record<string, string>;
  cardScrollMargin?: number;
  Chart?: React.FC;
}

const createFacetCards = ({
  facets,
  valueLabel,
  hooks,
  facetNameFormatter,
  queryExpressionHooks,
  idPrefix,
  dismissCallback,
  hideIfEmpty = false,
  showPercent = true,
  queryOptions,
  cardScrollMargin,
  Chart,
}: CreateFacetCardProps): React.ReactNode => {
  return facets.map((facet) => {
    if (facet.facet_type === "enum") {
      return (
        <EnumFacet
          key={`${idPrefix}-enum-${facet.field}`}
          valueLabel={valueLabel}
          field={facet.field}
          facetName={facetNameFormatter(facet.field)}
          description={facet.description}
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
          showPercent={showPercent}
          hooks={{
            ...(hooks as EnumFacetHooks),
          }}
          queryOptions={queryOptions}
          cardScrollMargin={cardScrollMargin}
          Chart={Chart}
        />
      );
    }

    if (facet.facet_type == "exact") {
      return (
        <ExactValueFacet
          key={`${idPrefix}-exact-${facet.field}`}
          field={facet.field}
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
          hooks={{ ...(hooks as ValueFacetHooks) }}
          facetName={facetNameFormatter(facet.field)}
        />
      );
    }
    if (facet.facet_type == "toggle") {
      return (
        <ToggleFacet
          key={`${idPrefix}-toggle-${facet.field}`}
          field={facet.field}
          valueLabel={valueLabel}
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
          showPercent={showPercent}
          hooks={{
            ...(hooks as EnumFacetHooks),
          }}
          facetName={facetNameFormatter(facet.field)}
        />
      );
    }

    if (facet.facet_type === "datetime")
      return (
        <DateRangeFacet
          key={`${idPrefix}-date-range-${facet.field}`}
          field={facet.field}
          description={facet.description}
          dismissCallback={dismissCallback}
          hideIfEmpty={hideIfEmpty}
          hooks={{
            ...(hooks as RangeFacetHooks),
          }}
          facetName={facetNameFormatter(facet.field)}
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
          key={`${idPrefix}-range-${facet.field}`}
          field={facet.field}
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
          facetName={facetNameFormatter(facet.field)}
          queryOptions={queryOptions}
          cardScrollMargin={cardScrollMargin}
          Chart={Chart}
        />
      );
    }
    if (facet.facet_type === "upload" && queryExpressionHooks) {
      return (
        <UploadFacet
          key={`${idPrefix}-exact-${facet.field}`}
          field={facet.field}
          facetName={facet.name ?? facetNameFormatter(facet.field)}
          uploadLabel={facet.uploadLabel}
          facetBtnToolTip={facet.toolTip}
          hooks={{ ...(hooks as UploadFacetHooks) }}
          queryExpressionHooks={queryExpressionHooks}
        />
      );
    }

    return (
      <div key={`${idPrefix}-unknown-${facet.field}`}>
        {" "}
        Unknown FacetType {facet.facet_type}
      </div>
    );
  });
};

export default createFacetCards;
