import { useState } from "react";
import MetaSearch from "../cohortBuilder/MetaSearch";
import CohortTabbedFacets from "../cohortBuilder/FacetGroup";


const CohortBuilder = () => {
  const [searchResults, setSearchResults] = useState([]);
  return (
  <div className="flex flex-col">
    <MetaSearch onChange={(r) => setSearchResults(r)}></MetaSearch>
    <CohortTabbedFacets />
  </div>
  )
}


export default CohortBuilder;
