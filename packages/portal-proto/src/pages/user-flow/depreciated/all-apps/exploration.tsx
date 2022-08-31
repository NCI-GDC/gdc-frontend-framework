import { NextPage } from "next";
import { BaseExplorationPage } from "@/features/user-flow/all-apps/baseExploration";

const AllAppsExploration: NextPage = () => {
  return (
    <BaseExplorationPage
      {...{
        headerElements: ["Exploration"],
        indexPath: "/user-flow/all-apps",
        isCohortAppDisplayed: true,
      }}
    />
  );
};

export default AllAppsExploration;
