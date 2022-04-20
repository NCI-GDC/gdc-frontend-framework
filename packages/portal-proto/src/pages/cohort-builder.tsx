import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import FullCohortBuilder from "../features/cohortBuilder/CohortBuilder";
import { headerElements } from "./user-flow/many-pages/navigation-utils";

const COHORTS = [
  {
    name: "New Custom Cohort",
    facets: [],
    case_count: "84,609",
    file_count: "618,198",
  },
  {
    name: "Current Cohort",
    facets: [
      { name: "Primary Site", op: "any of", value: "bronchus and lung" },
    ],
    case_count: "12,027",
    file_count: "52,234",
  },
  {
    name: "Baily's Cohort",
    facets: [
      { name: "Primary Site", op: "any of", value: "bronchus and lung" },
      { name: "Age of Diagnosis", op: "between", value: "65 and 89" },
    ],
    case_count: "2,425",
    file_count: "29,074",
  },
  {
    name: " Final Cohort",
    facets: [
      { name: "Primary Site", op: "any of ", value: "bronchus and lung" },
      {
        name: "Primary Diagnosis",
        op: "any_of",
        value:
          "squamous cell carcinoma, nos / squamous cell carcinoma, keratinizing, nos / basaloid squamous cell car…",
      },
      { name: "Age of Diagnosis", op: "between", value: "65 and 89" },
      {
        name: "Gene",
        op: "any of",
        value:
          "TP53,KMT2D,PIK3CA,NFE2L2,CDH8,KEAP1,PTEN,ADCY8,PTPRT,CALCR,GRM8,FBXW7,RB1,CDKN2A",
      },
    ],
    case_count: "179",
    file_count: "2,198",
  },
];

const Actions = () => {
  return `<div className="flex flex-row">
      <LoginIcon> Login </LoginIcon>
      <CartIcon> Cart </CartIcon>
    </div>`;
};

const CohortBuilder: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={headerElements}>
      <FullCohortBuilder cohorts={COHORTS} />
    </UserFlowVariedPages>
  );
};

export default CohortBuilder;
