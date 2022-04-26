import { NextPage } from "next";
import Link from "next/link";
import { BaseExplorationPage } from "../../../features/user-flow/all-apps/baseExploration";

const AllAppsExplorationVariant: NextPage = () => {
  return (
    <BaseExplorationPage
      {...{
        headerElements: [
          <Link key="cohorts" href="/user-flow/all-apps-v2/cohorts">
            Cohorts
          </Link>,
          "Exploration",
        ],
        indexPath: "/user-flow/all-apps-v2",
        isCohortAppDisplayed: false,
      }}
    />
  );
};

export default AllAppsExplorationVariant;
