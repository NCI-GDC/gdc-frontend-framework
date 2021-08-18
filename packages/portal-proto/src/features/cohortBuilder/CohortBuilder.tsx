import {useState} from 'react';
import  { CohortGroup, SummaryCharts, CohortGroupProps }  from "./CohortGroup";
import  MetaSearch from "./MetaSearch";
import  CohortTabbedFacets from "./FacetGroup";

const FullCohortBuilder: React.FC<CohortGroupProps> = ( { cohorts, simpleMode = false} : CohortGroupProps ) => {

  const [searchResults, setSearchResults] = useState([]);

  return (
   <div>
      <CohortGroup cohorts={cohorts} simpleMode={simpleMode}></CohortGroup>
      <MetaSearch onChange={(r) => setSearchResults(r)}></MetaSearch>
      <CohortTabbedFacets  searchResults={searchResults}></CohortTabbedFacets>
      <SummaryCharts/>
    </div>
  );
};

export default FullCohortBuilder;
