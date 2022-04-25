import GDC_Dictionary from "./gdc_tooltips.json";
import MiniSearch, { SearchResult } from "minisearch";

export const get_facet_list = (
  category: string,
): Array<Record<string, never>> | null => {
  return category in GDC_Dictionary.dictionary
    ? GDC_Dictionary.dictionary[category]
    : null;
};

export const get_facet_subcategories = (category: string): string[] => {
  return category in GDC_Dictionary.dictionary
    ? Object.keys(GDC_Dictionary.dictionary[category])
    : [];
};

export const get_facets = (
  category: string,
  subcategory: string,
  limit = 100,
): Array<Record<any, any>> => {
  const root = GDC_Dictionary.dictionary[category][subcategory];
  return Object.keys(root)
    .filter(
      (x, index) =>
        (root[x].facet_type === "enum" || x === "Program" || x === "Project") &&
        index < limit,
    )
    .map((x) => {
      return { name: x, ...root[x] };
    });
};

const get_facets_as_documents = (category: string): Array<Record<any, any>> => {
  const root = GDC_Dictionary.dictionary[category];
  const subcategory = Object.keys(root)
    .filter((subcategory) => subcategory != "All")
    .map((subcategory) => {
      return {
        subcategory: subcategory,
        category: category,
        facets: Object.keys(root[subcategory])
          .filter((x) => root[subcategory][x].facet_type === "enum")
          .map((x) => {
            return { name: x, facet: root[subcategory][x] };
          }),
      };
    });
  return subcategory
    .map((x) =>
      x.facets.map((y) => {
        return {
          name: y.name,
          enum: y.facet.enum,
          subcategory: x.subcategory,
          category: x.category,
          id: y.facet.facet_filter,
          description: y.facet.description,
        };
      }),
    )
    .flat();
};

const get_facets_enums_as_documents = (
  category: string,
): Array<Record<any, any>> => {
  const root = GDC_Dictionary.dictionary[category];
  const subcategory = Object.keys(root)
    .filter((subcategory) => subcategory === "All")
    .map((subcategory) => {
      return {
        subcategory: subcategory,
        category: category,
        facets: Object.keys(root[subcategory])
          .filter((x) => root[subcategory][x].facet_type === "enum")
          .map((x) => {
            return { name: x, facet: root[subcategory][x] };
          }),
      };
    });
  return subcategory
    .map((x) =>
      x.facets
        .filter((x) => x.name === "Primary Site" || x.name === "Disease Type")
        .map((y) => {
          return {
            name: y.name,
            enum: y.facet.enum,
            subcategory: x.subcategory,
            category: x.category,
            id: `all_${y.facet.facet_filter}`,
            description: y.facet.description,
          };
        }),
    )
    .flat();
};

export const miniSearch = new MiniSearch({
  fields: ["name", "description", "enum"], // fields to index for full-text search
  storeFields: ["name", "category", "subcategory", "description"], // fields to return with search results
});

export const init_search_index: () => MiniSearch<any> = () => {
  miniSearch.addAll(get_facets_as_documents("Clinical"));
  miniSearch.addAll(get_facets_enums_as_documents("Clinical"));
  miniSearch.addAll(get_facets_as_documents("Biospecimen"));

  return miniSearch;
};

export const search_facets: (s: string) => SearchResult[] = (s: string) => {
  return miniSearch.search(s, { prefix: true, combineWith: "AND" });
};

init_search_index();
