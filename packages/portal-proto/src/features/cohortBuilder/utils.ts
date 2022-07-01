import {
  FacetDefinition,
  selectFacetDefinitionByName,
  useCoreSelector,
} from "@gff/core";

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
