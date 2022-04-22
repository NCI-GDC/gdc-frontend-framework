import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import FullCohortBuilder from "../features/cohortBuilder/CohortBuilder";
import { headerElements } from "@/features/user-flow/many-pages/navigation-utils";

export const COHORTS = [
  { name: "New Custom Cohort", facets: [] },
  {
    name: "Baily's Cohort",
    facets: [
      { field: "cases.primary_site", value: ["breast", "bronchus and lung"] },
    ],
  },
];

const CohortBuilder: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={headerElements}>
      <FullCohortBuilder cohorts={COHORTS} />
    </UserFlowVariedPages>
  );
};

export default CohortBuilder;
