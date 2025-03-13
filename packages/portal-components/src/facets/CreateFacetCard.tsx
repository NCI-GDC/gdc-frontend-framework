import React from "react";
import EnumFacet from "./EnumFacet";
import {
  EnumFacetHooks,
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
        />
      );
    }

    return <div> Unknown FacetType {facet.facet_type}</div>;
  });
};

export default createFacetCards;
