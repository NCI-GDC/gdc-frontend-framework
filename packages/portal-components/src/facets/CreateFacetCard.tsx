import React from "react";
import { MantineProvider } from "@mantine/core";
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
  EnumChartProps,
  QueryOptions,
  ToggleFacetHooks,
} from "./types";

interface CreateFacetCardProps {
  facets: FacetCardDefinition[];
  hooks: FacetRequiredHooks;
  facetNameFormatter: (field: string) => string;
  idPrefix: string;
  valueLabel?: string | ((queryOptions?: QueryOptions) => string);
  dismissCallback?: (field: string) => void;
  hideIfEmpty?: boolean;
  showPercent?: boolean;
  queryOptions?: QueryOptions;
  cardScrollMargin?: number;
  Chart?: React.FC<EnumChartProps>;
}

/**
 * createFacetCards - given a list of facet definitions it will create
 * facet card components appropriate for the facets
 * All facets require a set of functions (e.g. hooks) which define get/set data,
 * filters, and counts. As create facets can create any facet type, all possible
 * functions must be supplied (i.e. include the EnumFacetHooks and RangeFacetHooks in dataFunctions
 * if your app can create both).
 *
 * @param facets - facet definition
 * @param valueLabel - label for counts or function that returns a label
 * @param hooks - data getter and setter hooks
 * @param facetNameFormatter - function that takes the field and returns a human readable name
 * @param idPrefix - prefix for created Facet Component key prop. This is used to ensure the ref
 *                  has a 1) unique 2) persistent id, so each call to createFacetCardsFromList must
 *                  have a unique prefix, the name of the analysis tool is a good choice
 * @param dismissCallback - callback when defined will remove facet from parent panel
 * @param hideIfEmpty - hide facets if they do not have data
 * @param showPercent - whether to show the count percent of whole
 * @param queryOptions - info to pass back to data fetching hooks about this facet
 * @param cardScrollMargin - Scroll margin for cards, used for positioning cards on the page when scrolled to
 * @param Chart - Component for rendering a Chart view of the data
 */

const createFacetCards = ({
  facets,
  valueLabel,
  hooks,
  facetNameFormatter,
  idPrefix,
  dismissCallback,
  hideIfEmpty = false,
  showPercent = true,
  queryOptions,
  cardScrollMargin,
  Chart,
}: CreateFacetCardProps): React.ReactNode => {
  return (
    <MantineProvider>
      {facets.map((facet) => {
        if (facet.facet_type === "enum") {
          return (
            <EnumFacet
              key={`${idPrefix}-enum-${facet.field}`}
              valueLabel={
                valueLabel === undefined || typeof valueLabel === "string"
                  ? valueLabel
                  : valueLabel(facet?.queryOptions ?? queryOptions)
              }
              field={facet.field}
              facetName={facet.name ?? facetNameFormatter(facet.field)}
              description={facet.description}
              dismissCallback={dismissCallback}
              hideIfEmpty={hideIfEmpty}
              showPercent={showPercent}
              hooks={{
                ...(hooks as EnumFacetHooks),
              }}
              queryOptions={facet?.queryOptions ?? queryOptions}
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
              facetName={facet.name ?? facetNameFormatter(facet.field)}
            />
          );
        }
        if (facet.facet_type == "toggle") {
          return (
            <ToggleFacet
              key={`${idPrefix}-toggle-${facet.field}`}
              field={facet.field}
              valueLabel={
                valueLabel === undefined || typeof valueLabel === "string"
                  ? valueLabel
                  : valueLabel(facet?.queryOptions ?? queryOptions)
              }
              dismissCallback={dismissCallback}
              hideIfEmpty={hideIfEmpty}
              showPercent={showPercent}
              hooks={{
                ...(hooks as ToggleFacetHooks),
              }}
              facetName={facet.name ?? facetNameFormatter(facet.field)}
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
              facetName={facet.name ?? facetNameFormatter(facet.field)}
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
              valueLabel={
                valueLabel === undefined || typeof valueLabel === "string"
                  ? valueLabel
                  : valueLabel(facet?.queryOptions ?? queryOptions)
              }
              description={facet.description}
              rangeDatatype={facet.facet_type}
              minimum={facet?.range?.minimum}
              maximum={facet?.range?.maximum}
              hideIfEmpty={hideIfEmpty}
              hooks={{
                ...(hooks as RangeFacetHooks),
              }}
              dismissCallback={dismissCallback}
              facetName={facet.name ?? facetNameFormatter(facet.field)}
              queryOptions={facet?.queryOptions ?? queryOptions}
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
              facetName={facet.name ?? facetNameFormatter(facet.field)}
              uploadLabel={facet.uploadLabel}
              facetBtnToolTip={facet.toolTip}
              hooks={{ ...(hooks as UploadFacetHooks) }}
            />
          );
        }

        return (
          <div key={`${idPrefix}-unknown-${facet.field}`}>
            {" "}
            Unknown FacetType {facet.facet_type}
          </div>
        );
      })}
    </MantineProvider>
  );
};

export default createFacetCards;
