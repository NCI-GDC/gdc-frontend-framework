import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import  { CohortGroup, SummaryCharts }  from "../features/cohortBuilder/CohortGroup";
import  MetaSearch from "../features/cohortBuilder/MetaSearch";
import  CohortTabbedFacets from "../features/cohortBuilder/FacetGroup";

const CohortBuilder: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={[]}>
      <CohortGroup></CohortGroup>
      <MetaSearch></MetaSearch>
      <CohortTabbedFacets></CohortTabbedFacets>
      <SummaryCharts/>
    </UserFlowVariedPages>
  );
};

export default CohortBuilder;
