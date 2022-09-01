import GDC_Dictionary from "./config/gdc_tooltips.json";
import GDC_Dictionary_Flattened from "./config/gdc_facet_dictionary_flat.json";
import MiniSearch, { SearchResult } from "minisearch";
import {
  selectCohortBuilderConfig,
  useCoreSelector,
  selectCaseFacets,
} from "@gff/core";
import { toDisplayName } from "../cDave/utils";
import { getFacetInfo } from "@/features/cohortBuilder/utils";
// TODO: Remove the above JSON config file and replace with the dictionary slice.

export const get_facet_list = (
  category: string,
): Array<Record<string, never>> | undefined => {
  return category in GDC_Dictionary.dictionary
    ? GDC_Dictionary.dictionary[category]
    : undefined;
};

export const get_facet_subcategories = (category: string): string[] => {
  return category in GDC_Dictionary.dictionary
    ? Object.keys(GDC_Dictionary.dictionary[category])
    : [];
};

export const get_facets_from_list = (
  facets: ReadonlyArray<string>,
): Array<Record<string, any>> => {
  return facets.map((x) => ({
    name: x,
    ...GDC_Dictionary_Flattened.dictionary[x],
  }));
};

export const get_facets = (
  category: string,
  subcategory: string,
  limit = 100,
): Array<Record<any, any>> => {
  const root = GDC_Dictionary.dictionary[category][subcategory];
  return Object.keys(root)
    .slice(limit)
    .map((x) => {
      return { name: x, ...root[x] };
    });
};

interface ReturnedFields {
  name: string;
  category: string;
  description: string;
  enum: string[];
}

export const miniSearch = new MiniSearch({
  fields: ["name", "description", "enum"], // fields to index for full-text search
  storeFields: ["name", "category", "categoryKey", "description", "enum", "id"], // fields to return with search results
});

export const useFacetSearch = () => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );

  const facetResults = useCoreSelector((state) => selectCaseFacets(state));

  miniSearch.removeAll();

  const searchDocuments = [];
  Object.entries(tabsConfig).forEach(([categoryKey, category]) => {
    getFacetInfo(category.facets).forEach((facet) => {
      const result = facetResults[facet.full];
      if (result?.status === "fulfilled") {
        searchDocuments.push({
          name: toDisplayName(facet.field),
          enum: Object.keys(result?.buckets),
          category: category.label,
          categoryKey,
          description: facet.description,
          id: facet.full,
        });
      }
    });
  });

  miniSearch.addAll(searchDocuments);

  return miniSearch;
};
