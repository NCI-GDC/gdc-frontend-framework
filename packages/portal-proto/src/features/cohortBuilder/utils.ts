import {
  FacetDefinition,
  FilterSet,
  selectCurrentCohortFilterSet,
  useCoreSelector,
} from "@gff/core";

/**
 * getFacetInfo: returns information from the GDC API: description, full field, type, etc.
 * It returns information ONLY for defined fields
 * @param fields - array of fields to return data for
 * @returns array of FacetDefinitions
 */
export const getFacetInfo = (
  fields: ReadonlyArray<string>,
  facets: Record<string, FacetDefinition>,
): ReadonlyArray<FacetDefinition> => {
  return fields.map((field) => facets[field]).filter((facet) => facet);
};

export const useCohortFacetFilters = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilterSet(state));
};
