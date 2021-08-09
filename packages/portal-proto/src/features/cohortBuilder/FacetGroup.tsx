import { Facet } from "../facets/Facet";
import { Tab, TabProps, TabList, TabPanel, Tabs } from "react-tabs";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { PropsWithChildren, useState } from "react";

interface FacetGroupProps {
  readonly facetNames: Array<string>;
}

const FacetGroup: React.FC<FacetGroupProps> = ({ facetNames }: FacetGroupProps) => {

  return ( <div className="flex flex-col border-2 ">
    <div className="grid grid-cols-3 gap-4">

    {facetNames.map((n, index) => {
      return (<Facet key={`${n}-${index}`} field={n} />);
    })
    }
    </div>
  </div>
  );
};

const clinicalFacets = [
  "primary_site",
  "diagnoses.tissue_or_organ_of_origin",
  "disease_type",
  "demographic.ethnicity",
  "demographic.gender",
  "demographic.race"
];

const clinicalSubcategories = [ "All", "Demographic"];

interface FacetTabWithSubmenuProps extends TabProps {
   subtypes: Array<string>;
}

const FacetTabWithSubmenu : React.FC<FacetTabWithSubmenuProps> = ({ subtypes, children, ...otherProps } : PropsWithChildren<FacetTabWithSubmenuProps>) => {
  const [subtype, setSubtype] = useState(subtypes[0]);

  const handleChange = (event) => {
    setSubtype(event.target.value);
  };

  return (
    <Tab {...otherProps}>
      <div className="flex flex-row items-center justify-center">
        {children}
        <div >
          <FormControl className="bg-white w-36 min-w-full">
            <Select
              disableUnderline
              value={subtype}
              onChange={handleChange}
              className="px-2"
            >
              {subtypes.map((n) => {
                return (<MenuItem key={n} value={n}>{n}</MenuItem>);
              })
              }
            </Select>
          </FormControl>
        </div>
        </div>
    </Tab>
  )

};
FacetTabWithSubmenu.tabsRole = 'Tab';

export const CohortTabbedFacets: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col items-center justify-left bg-white border-black px-2 w-100">
    <Tabs>
      <TabList>
        <FacetTabWithSubmenu subtypes={clinicalSubcategories}>Clinical</FacetTabWithSubmenu>
        <FacetTabWithSubmenu subtypes={clinicalSubcategories}>Biospecimen</FacetTabWithSubmenu>
        <FacetTabWithSubmenu subtypes={clinicalSubcategories}>Molecular</FacetTabWithSubmenu>
    </TabList>
      <div className="w-100 h-12 bg-blue-600"></div>
      <TabPanel><FacetGroup facetNames={clinicalFacets}/></TabPanel>
      <TabPanel>[insert Biospecimen facets here]</TabPanel>
      <TabPanel>[insert Molecular facets here]</TabPanel>
    </Tabs>
    </div>
  )
}


export default CohortTabbedFacets;
