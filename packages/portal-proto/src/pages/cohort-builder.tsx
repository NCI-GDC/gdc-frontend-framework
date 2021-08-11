import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import  { CohortGroup, SummaryCharts }  from "../features/cohortBuilder/CohortGroup";
import  MetaSearch from "../features/cohortBuilder/MetaSearch";
import  CohortTabbedFacets from "../features/cohortBuilder/FacetGroup";

const filters = [
  { name:"Primary Site", op:"any_of", value: "lung"},
]

const CohortBuilder: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={[]}>
      <CohortGroup facet_filters={filters}></CohortGroup>
      <MetaSearch></MetaSearch>
      <CohortTabbedFacets></CohortTabbedFacets>
      <SummaryCharts/>
    </UserFlowVariedPages>
  );
};

export default CohortBuilder;
