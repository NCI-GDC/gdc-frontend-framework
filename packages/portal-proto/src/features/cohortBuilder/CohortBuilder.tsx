import {  useState } from "react";
import  { CohortGroup, CohortGroupProps }  from "./CohortGroup";
import { SummaryCharts } from "./SummaryCharts"
import  MetaSearch from "./MetaSearch";
import  CohortTabbedFacets from "./FacetGroup";
import { useTour } from '@reactour/tour';
import { useEffect } from "react";
import { Button } from "../layout/UserFlowVariedPages";


const FullCohortBuilder: React.FC<CohortGroupProps> = ( { cohorts, simpleMode = false} : CohortGroupProps ) => {

  const [searchResults, setSearchResults] = useState([]);
  const { setIsOpen } = useTour();

  const updateSummaryCharts = (op, field) => {
    if (op === "add")
      setSummaryFields([...summaryFields, field])
    if (op === "remove")
      setSummaryFields(summaryFields.filter((x) => x !== field))
  }

  const [summaryFields, setSummaryFields] = useState([
    "primary_site",
    "demographic.gender",
    "disease_type",
    "diagnoses.tissue_or_organ_of_origin"
  ]);
  return (
   <div>
      <Button onClick={() => setIsOpen(true)}>Start Tour</Button>
      <CohortGroup cohorts={cohorts} simpleMode={simpleMode}></CohortGroup>
      <MetaSearch onChange={(r) => setSearchResults(r)}></MetaSearch>
      <CohortTabbedFacets  searchResults={searchResults} onUpdateSummaryChart={updateSummaryCharts}></CohortTabbedFacets>
      <SummaryCharts fields={summaryFields} />
    </div>
  );
};

export default FullCohortBuilder;
