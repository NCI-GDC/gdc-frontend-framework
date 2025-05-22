import { useDeepCompareEffect } from "use-deep-compare";
// TODO: Remove the JSON config file and replace with the dictionary slice.
import GDC_Dictionary from "./config/gdc_tooltips.json";
import GDC_Dictionary_Flattened from "./config/gdc_facet_dictionary_flat.json";
import MiniSearch from "minisearch";
import {
  selectCohortBuilderConfig,
  useCoreSelector,
  selectCaseFacets,
  selectFacetDefinition,
  fieldNameToTitle,
} from "@gff/core";
import { getFacetInfo, upload_facets } from "@/features/cohortBuilder/utils";
import { useAllEnumFacets } from "../facets/hooks";

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

export const STOP_WORDS = new Set(["of", "or"]);
export const TOKENIZE_STRING = /[\n\r\s,\-_]+/u;

export interface FacetSearchDocument {
  name: string;
  category: string;
  categoryKey: string;
  description: string;
  enum: string[];
}

export const miniSearch = new MiniSearch<FacetSearchDocument>({
  fields: ["name", "description", "enum"], // fields to index for full-text search
  storeFields: ["name", "category", "categoryKey", "description", "enum", "id"], // fields to return with search results
  tokenize: (string) => string.split(TOKENIZE_STRING), // indexing tokenizer
  processTerm: (term) => (STOP_WORDS.has(term) ? null : term.toLowerCase()), // index term processing
  searchOptions: {
    boost: {
      name: 1.5,
    },
  },
});

export const useFacetSearch = (): MiniSearch<FacetSearchDocument> => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  const facets = useCoreSelector((state) => selectFacetDefinition(state));

  useAllEnumFacets();

  const facetResults = useCoreSelector((state) => selectCaseFacets(state));

  useDeepCompareEffect(() => {
    miniSearch.removeAll();

    const searchDocuments = [];

    Object.entries(tabsConfig).forEach(([categoryKey, category]) => {
      getFacetInfo(category.facets, {
        ...(facets.data || {}),
        ...upload_facets,
      }).forEach((facet) => {
        const result = facetResults[facet.field];
        searchDocuments.push({
          name: facet.name ?? fieldNameToTitle(facet.field),
          enum: Object.keys(result?.buckets || {}),
          category: category.label,
          categoryKey,
          description: facet.description,
          id: facet.field,
        });
      });
    });

    miniSearch.addAll(searchDocuments);
  }, [tabsConfig, facetResults, facets]);

  return miniSearch;
};

export const useFacetTabLoaded = (tab: string) => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  const facets =
    useCoreSelector((state) => selectFacetDefinition(state)).data || {};
  const facetResults = useCoreSelector((state) => selectCaseFacets(state));
  const facetTab = tabsConfig[tab];

  if (tab === "custom" || tab === "genomic_filters") {
    return true;
  }

  if (facetTab?.facets === undefined) {
    return false;
  }

  const facetList = getFacetInfo(facetTab.facets, {
    ...facets,
  });

  const facetNames = facetList
    .filter((x) => x.facet_type === "enum")
    .map((x) => x.field);

  const filteredFacets = Object.entries(facetResults).filter(([facetName]) =>
    facetNames.includes(facetName),
  );

  const facetTabLoaded =
    filteredFacets.length > 0 &&
    filteredFacets.every(([_, facetInfo]) => facetInfo.status === "fulfilled");

  return facetTabLoaded;
};
