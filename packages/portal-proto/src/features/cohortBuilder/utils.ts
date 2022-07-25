import {
  FacetDefinition,
  selectFacetDefinitionByName,
  useCoreSelector,
} from "@gff/core";

/**
 * getFacetInfo: returns information from the GDC API: description, full field
 * It returns information ONLY for defined fields
 * @param fields - array of fields to return data from
 * @returns array of FacetDefinitions
 */
export const getFacetInfo = (
  fields: ReadonlyArray<string>,
): ReadonlyArray<FacetDefinition> => {
  return fields
    .map(
      (x) =>
        useCoreSelector((state) => selectFacetDefinitionByName(state, x)) ??
        null,
    )
    .filter((x) => x !== null);
};
