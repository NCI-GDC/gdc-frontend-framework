import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import { COHORTS } from "@/features/user-flow/workflow/registeredApps";

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench", headerElements }}
    >
      <ContextBar cohorts={COHORTS} />
      <AnalysisWorkspace
        app={app && app.length > 0 ? app.toString() : undefined}
      />
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
