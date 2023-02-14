import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
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

/**
 * Depreciated
 * @constructor
 */
const CohortBuilder: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={headerElements}></UserFlowVariedPages>
  );
};

export default CohortBuilder;
