import GDC_Dictionary from "./gdc_tooltips.json";
import MiniSearch from 'minisearch';

export const get_facet_list = (category: string) : Array <Record<string, never> > | null => {
  return (category in GDC_Dictionary.dictionary) ? GDC_Dictionary.dictionary[category] : null ;
}

export const get_facet_subcategories = (category: string) : string[]  => {
  return (category in GDC_Dictionary.dictionary) ?
    Object.keys(GDC_Dictionary.dictionary[category]) : [];
}

export const get_facets = (category: string, subcategory:string) : Array< Record<any, any> >  => {
    const root = GDC_Dictionary.dictionary[category][subcategory];
    return Object.keys(root)
      .filter(x => root[x].facet_type === 'enum') .map(x => { return { name: x, ...root[x] }});

}

const get_facets_as_documents = (category: string) : Array< Record<any, any> >  => {
  const root = GDC_Dictionary.dictionary[category];
  const subcategory = Object.keys(root).map(subcategory => { return { subcategory: subcategory, category: category, facets: Object.keys(root[subcategory]).filter(x => root[subcategory][x].facet_type === 'enum').map(x =>  { return { name:x, facet: root[subcategory][x]} })}});
  const next3 =  subcategory.map(x => x.facets.map(y => { return { facet_name: y.name, subcategory: x.subcategory, category: x.category, id:y.facet.facet_filter, description:y.facet.description } })).flat();
  return next3;
}


export const miniSearch = new MiniSearch({
  fields: ['facet_name', 'category','description'], // fields to index for full-text search
  storeFields: ['facet_filter', 'category', "subcategory"] // fields to return with search results
})

export const init_search_index = () => {
  miniSearch.addAll(get_facets_as_documents('Clinical'));
  miniSearch.addAll(get_facets_as_documents('Biospecimen'));

  return miniSearch;
}

export const search_facets = (s:string) => {
  return miniSearch.search(s, { prefix: true});
}

init_search_index();
