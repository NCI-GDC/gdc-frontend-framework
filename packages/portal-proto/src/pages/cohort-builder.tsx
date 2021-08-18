import { NextPage } from "next";
import {useState} from 'react';
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import  { CohortGroup, SummaryCharts }  from "../features/cohortBuilder/CohortGroup";
import  MetaSearch from "../features/cohortBuilder/MetaSearch";
import  CohortTabbedFacets from "../features/cohortBuilder/FacetGroup";

const COHORTS = [
  { name: 'New Cohort',
    facets : [  ],
    case_count: "84,609"
  },
  { name: 'Current Cohort',
    facets : [ { name:"Primary Site", op:"any of", value: "breast"} ],
    case_count: "9,115"
  },
  {
    name: "Baily's Cohort",
    facets: [
      { name: "Primary Site", op: "any of", value: "bronchus and lung" },
      { name: "Age of Diagnosis", op: "between", value: "65 and 89" },
    ],
    case_count: "9,234"
  },
  { name: " My Cohort",
    facets : [
      { name:"Primary Site", op:"any of ", value: "bronchus and lung"},
      { name:"Primary Diagnosis", op:"any_of", value: "squamous cell carcinoma, nos / squamous cell carcinoma, keratinizing, nos / basaloid squamous cell car…"},
      { name:"Age of Diagnosis", op:"between", value: "65 and 89"},
      { name:"Gene", op:"any of", value: "TP53,KMT2D,PIK3CA,NFE2L2,CDH8,KEAP1,PTEN,ADCY8,PTPRT,CALCR,GRM8,FBXW7,RB1,CDKN2A"}

    ],
    case_count: "179"
  }
]

const CohortBuilder: NextPage = () => {

  const [searchResults, setSearchResults] = useState([]);

  return (
    <UserFlowVariedPages headerElements={[]}>
      <CohortGroup cohorts={COHORTS}></CohortGroup>
      <MetaSearch onChange={(r) => setSearchResults(r)}></MetaSearch>
      <CohortTabbedFacets  searchResults={searchResults}></CohortTabbedFacets>
      <SummaryCharts/>
    </UserFlowVariedPages>
  );
};

export default CohortBuilder;
