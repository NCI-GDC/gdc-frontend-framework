import {  useState } from "react";
import  { CohortGroup, CohortGroupProps }  from "./CohortGroup";
import { SummaryCharts } from "./SummaryCharts"
import  MetaSearch from "./MetaSearch";
import  CohortTabbedFacets from "./FacetGroup";


const FullCohortBuilder: React.FC<CohortGroupProps> = ( { cohorts, simpleMode = false} : CohortGroupProps ) => {

  const [searchResults, setSearchResults] = useState([]);


  const [summaryFields, setSummaryFields] = useState([
    "primary_site",
    "demographic.gender",
    "disease_type",
    "diagnoses.tissue_or_organ_of_origin"
  ]);
  return (
   <div  className="bg-white">
      <CohortGroup cohorts={cohorts} simpleMode={simpleMode}></CohortGroup>
      <MetaSearch onChange={(r) => setSearchResults(r)}></MetaSearch>
      <SummaryCharts fields={summaryFields} />
      <CohortTabbedFacets  searchResults={searchResults}></CohortTabbedFacets>

    </div>
  );
};

export default FullCohortBuilder;
