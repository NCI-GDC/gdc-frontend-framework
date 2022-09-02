import {
  FacetDefinition,
  selectFacetDefinitionByName,
  selectFacetDefinition,
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
): ReadonlyArray<FacetDefinition> => {
  const facets = useCoreSelector((state) => selectFacetDefinition(state));
  return Object.entries(facets?.data)
    .filter(([key, facet]) => fields.includes(key) && facet !== null)
    .map((f) => f[1]);
  /*
  return fields
    .map(
      (x) =>
        useCoreSelector((state) => selectFacetDefinitionByName(state, x)) ??
        null,
    )
    .filter((x) => x !== null);
    */
};
