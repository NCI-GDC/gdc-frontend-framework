import { NextPage } from "next";
import { useRouter } from "next/router"
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import ContextBar from "../../../features/cohortBuilder/ContextBar";
import { headerElements } from "./navigation-utils";
import AnalysisWorkspace from "./AnalysisWorkspace";
import { COHORTS } from "./registeredApps";

const SingleAppsPage: NextPage = () => {
  const router = useRouter()
  const {
    query: { app  },
  } = router

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench", headerElements }}
    >
    <ContextBar  id="context_bar_all" cohorts={COHORTS} />
      <AnalysisWorkspace app={app && app.length > 0 ? app.toString() : undefined} />
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;

