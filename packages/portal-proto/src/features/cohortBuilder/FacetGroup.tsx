import { Facet } from "../facets/Facet";
import NumericRangeFacet  from "../facets/NumericRangeFacet";
import { Tab, TabProps, TabList, TabPanel, Tabs } from "react-tabs";
import { useState } from "react";
import Select from "react-select";
import { get_facet_subcategories, get_facets } from "./dictionary";
import { GeneTable, MutationTable} from "../genomic/Genomic";
import MutationFacet from "./MutationFacet";
import {BIOTYPE, VARIANT_CALLER, VEP_IMPACT, CONSEQUENCE_TYPE, SIFT_IMPACT} from "./gene_mutation_facets"

interface FacetGroupProps {
  readonly facetNames: Array<Record<string, any>>;
  onUpdateSummaryChart: (op:string, field:string) => void;

}

export const FacetGroup: React.FC<FacetGroupProps> = ({ facetNames, onUpdateSummaryChart }: FacetGroupProps) => {

  console.log(facetNames);
  return ( <div className="flex flex-col border-2 h-screen/1.5 overflow-y-scroll">
    <div className="grid grid-cols-4 gap-4">

    {facetNames.map((x, index) => {
      if (x.facet_type === "enum")
        return (<Facet key={`${x.facet_filter}-${index}`} field={x.facet_filter} facetName={x.name} description={x.description}
                       onUpdateSummaryChart={onUpdateSummaryChart}
        />);
      if (["year", "age", 'numeric', 'integer'].includes(x.facet_type)) {
        return (<NumericRangeFacet key={`${x.facet_filter}-${index}`}
                                   field={x.facet_filter}
                                   facetName={x.name} description={x.description}
                       facet_type={x.facet_type} minimum={x.minimum} maximum={x.minimum}
        />);
      }
    })
    }
    </div>
  </div>
  );
};


const molecularFmolecularFacets = [];

const molecularSubcategories = [
  "Somatic Mutations"
];

const downloadableFacets = [];
const downloadableSubcategories = [
  "All"
];
const visualizableFacets = [];
const visualizableSubcategories = [
  "Somatic Mutations",
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

  const [subCategory, setSubCategory] = useState({...menu_items[0]});

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
          className="px-2 w-48 bg-opacity-0 border-opacity-0"
        />
        </div>
    </Tab>
  )

};
FacetTabWithSubmenu.tabsRole = 'Tab';

interface CohortTabbedFacetsProps {
  readonly searchResults: [ Record<string, unknown> ];
  onUpdateSummaryChart: (op:string, field:string) => void;
}

export const CohortTabbedFacets: React.FC<CohortTabbedFacetsProps> = ( {  searchResults, onUpdateSummaryChart } : CohortTabbedFacetsProps) => {
   const [subcategories, setSubcategories] = useState({ 'Clinical': 'All' ,'Biospecimen': 'All', "Downloadable": "All" });
   const handleSubcategoryChanged = (category:string, subcategory:string) => {
     const state = { ...subcategories };
     state[category] = subcategory;
     setSubcategories(state);
  }

  return (
    <div className="w-100 px-10">
    <Tabs>
      <TabList>
        <FacetTabWithSubmenu category="Clinical"
                             subCategories={get_facet_subcategories('Clinical')}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
        <FacetTabWithSubmenu category="Biospecimen"
                             subCategories={get_facet_subcategories('Biospecimen')}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
        <FacetTabWithSubmenu category="Downloadable Data"
                             subCategories={downloadableSubcategories}
                             onSubcategoryChange={handleSubcategoryChanged}></FacetTabWithSubmenu>
    </TabList>
      <TabPanel ><FacetGroup onUpdateSummaryChart={onUpdateSummaryChart}
        facetNames={get_facets('Clinical',subcategories['Clinical']) }/></TabPanel>
      <TabPanel><FacetGroup
        onUpdateSummaryChart={onUpdateSummaryChart}
        facetNames={get_facets('Biospecimen',subcategories['Biospecimen'])}/></TabPanel>
      <TabPanel><FacetGroup onUpdateSummaryChart={onUpdateSummaryChart}
                            facetNames={get_facets('Downloadable',subcategories['Downloadable'])}/></TabPanel>
    </Tabs>
    </div>
  )
}

export default CohortTabbedFacets;
