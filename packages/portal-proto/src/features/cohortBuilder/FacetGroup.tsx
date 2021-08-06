import { Facet } from "../facets/Facet";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

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

export const CohortTabbedFacets: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col items-center justify-left bg-white border-none px-4 w-100">
    <Tabs>
      <TabList>
        <Tab>Clinical</Tab>
        <Tab>Biospecimen</Tab>
        <Tab>Molecular</Tab>
    </TabList>
      <TabPanel><FacetGroup facetNames={clinicalFacets}/></TabPanel>
      <TabPanel>[insert Biospecimen facets here]</TabPanel>
      <TabPanel>[insert Molecular facets here]</TabPanel>
    </Tabs>
    </div>
  )
}


export default CohortTabbedFacets;
