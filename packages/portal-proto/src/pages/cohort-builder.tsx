import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import  { CohortGroup, SummaryCharts }  from "../features/cohortBuilder/CohortGroup";
import  MetaSearch from "../features/cohortBuilder/MetaSearch";
import  CohortTabbedFacets from "../features/cohortBuilder/FacetGroup";

const COHORTS = [
  { name: 'Current Cohort',
    facets : [ { name:"Primary Site", op:"any_of", value: "breast"} ]
  },
  {
    name: "Bailys Cohort",
    facets: [
      { name: "Primary Site", op: "any_of", value: "bronchus and lung" },
      { name: "Age of  Diagnosis", op: "between", value: "65 and 89" },
    ]
  },
  { name: "Bailys Cohort 2",
    facets : [
      { name:"Primary Site", op:"any_of", value: "bronchus and lung"},
      { name:"Primary Diagnosis", op:"any_of", value: "squamous cell carcinoma, nos / squamous cell carcinoma, keratinizing, nos / basaloid squamous cell car…"},
      { name:"Age of  Diagnosis", op:"between", value: "65 and 89"},
      { name:"Gene", op:"any_of", value: "TP53  KMT2D  PIK3CA  NFE2L2  CDH8  KEAP1. PTEN. ADCY8  PTPRT. CALCR GRM8 FBXW7 RB1  CDKN2A"}

    ]
  }
]

const CohortBuilder: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={[]}>
      <CohortGroup cohorts={COHORTS}></CohortGroup>
      <MetaSearch></MetaSearch>
      <CohortTabbedFacets></CohortTabbedFacets>
      <SummaryCharts/>
    </UserFlowVariedPages>
  );
};

export default CohortBuilder;
