import { Facet } from "../facets/Facet";
import { Tab, TabProps, TabList, TabPanel, Tabs } from "react-tabs";
import { useState } from "react";
import Select from "react-select";
import { get_facet_subcategories, get_facets } from "./dictionary";
import { GeneTable, MutationTable} from "../genomic/Genomic";

interface FacetGroupProps {
  readonly facetNames: Array<Record<string, any>>;
}

const FacetGroup: React.FC<FacetGroupProps> = ({ facetNames }: FacetGroupProps) => {

  return ( <div className="flex flex-col border-2 h-screen/1.5 overflow-y-scroll">
    <div className="grid grid-cols-4 gap-4">

    {facetNames.map((x, index) => {
      return (<Facet key={`${x.facet_filter}-${index}`} field={x.facet_filter} description={x.description} />);
    })
    }
    </div>
  </div>
  );
};


const molecularFmolecularFacets = [];

const molecularSubcategories = [
  " ",
  "Gene Expression",
  "Simple Mutation"
];

const downloadableFacets = [];
const downloadableSubcategories = [
];
const visualizableFacets = [];
const visualizableSubcategories = [
  "Gene Expression",
  "Simple Mutation"
];

interface FacetTabWithSubmenuProps extends TabProps {
   category: string;
   subCategories: Array<string>;
   onSubcategoryChange: (c:string, sc:string) => void;
}

const FacetTabWithSubmenu : React.FC<FacetTabWithSubmenuProps> = ({ category, subCategories, onSubcategoryChange,...otherProps } : FacetTabWithSubmenuProps) => {

  const menu_items = subCategories.map((n, index) => {
    return {label: n, value:index}
  });

  const [subCategory, setSubCategory] = useState(menu_items[0]);

  const handleChange = (x) => {
    onSubcategoryChange(category, x.label)
  };

  return (
    <Tab {...otherProps}>
      <div className="flex flex-row items-center justify-center">
        {category}
        <Select
          components={{
            IndicatorSeparator: () => null
          }}
          options={menu_items}
          defaultValue={subCategory}
          onChange={handleChange}
          className="px-2 w-40 bg-opacity-0 border-opacity-0"
        />
        </div>
    </Tab>
  )

};
FacetTabWithSubmenu.tabsRole = 'Tab';

interface CohortTabbedFacetsProps {
  readonly searchTerm: string;
}

export const CohortTabbedFacets: React.FC<CohortTabbedFacetsProps> = ( {  searchTerm } : CohortTabbedFacetsProps) => {
   const [searchResults, setSearchResults ] = useState({ });
   const [subcategories, setSubcategories] = useState({ 'Clinical': 'All' ,'Biospecimen': 'All', 'Visualizable Data': 'Gene Expression' });
   const handleSubcategoryChanged = (category:string, subcategory:string) => {
     const state = { ...subcategories };
     state[category] = subcategory;
     setSubcategories(state);
  }

   if (searchTerm.length > 0) {
     // have search results select only those facets within the results
     console.log(searchTerm);
   }

  return (
    <div className="w-100">
    <Tabs>
      <TabList>
        <FacetTabWithSubmenu category="Clinical"
                             subCategories={get_facet_subcategories('Clinical')}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
        <FacetTabWithSubmenu category="Biospecimen"
                             subCategories={get_facet_subcategories('Biospecimen')}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
        <FacetTabWithSubmenu category="Visualizable Data"
                             subCategories={molecularSubcategories}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
        <FacetTabWithSubmenu category="Downloadable Data"
                             subCategories={downloadableSubcategories}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
    </TabList>
      <TabPanel><FacetGroup facetNames={get_facets('Clinical',subcategories['Clinical'])}/></TabPanel>
      <TabPanel><FacetGroup facetNames={get_facets('Biospecimen',subcategories['Biospecimen'])}/></TabPanel>
      <TabPanel><div className="flex flex-col" > {(subcategories['Visualizable Data'] === 'Gene Expression')  ? <GeneTable/> : <MutationTable/> }</div></TabPanel>
      <TabPanel><FacetGroup facetNames={downloadableFacets}/></TabPanel>
    </Tabs>
    </div>
  )
}

export default CohortTabbedFacets;
