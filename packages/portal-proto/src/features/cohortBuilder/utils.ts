import { FacetDefinition } from "@gff/core";

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
  return Object.entries(facets)
    .filter(([key, facet]) => fields.includes(key) && facet !== null)
    .map((f) => f[1]);
};
