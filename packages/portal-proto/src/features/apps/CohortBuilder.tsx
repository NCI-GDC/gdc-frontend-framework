import { useState } from "react";
import MetaSearch from "../cohortBuilder/MetaSearch";
import CohortTabbedFacets from "../cohortBuilder/FacetGroup";


const CohortBuilder = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [summaryFields, setSummaryFields] = useState([
    "primary_site",
    "demographic.gender",
    "disease_type",
    "diagnoses.tissue_or_organ_of_origin"
  ]);
  return (
  <div className="flex flex-col">
    <MetaSearch onChange={(r) => setSearchResults(r)}></MetaSearch>
    <CohortTabbedFacets />
  </div>
  )
}


export default CohortBuilder;
