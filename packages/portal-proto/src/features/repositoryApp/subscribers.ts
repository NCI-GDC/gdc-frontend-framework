import { coreStore } from "@gff/core";
import { AppStore } from "./appApi";
import { removeFilter } from "./repositoryConfigSlice";

/**
 * Remove fields that aren't in the facet dictionary from user's saved custom facets
 */
coreStore.subscribe(() => {
  const dictionary = coreStore.getState().facetsGQL.dictionary;
  if (dictionary.status === "fulfilled") {
    const validFields = Object.keys(dictionary.entries);
    const customFacets = AppStore.getState().facets.customFacets;
    const invalidFacets = customFacets.filter(
      (customFacet) => !validFields.includes(customFacet),
    );
    invalidFacets.forEach((invalidFacet) =>
      AppStore.dispatch(removeFilter({ facetName: invalidFacet })),
    );
  }
});
