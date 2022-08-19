import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import ContextBar from "../../../features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace, {
  AnalysisGrid,
} from "@/features/user-flow/workflow/AnalysisWorkspace";
import { COHORTS } from "@/features/user-flow/workflow/registeredApps";
import { CSSTransition } from "react-transition-group";
const ActiveAnalysisToolNoSSR = dynamic(
  () => import("@/features/user-flow/workflow/ActiveAnalysisTool"),
  {
    ssr: false,
  },
);
import dynamic from "next/dynamic";

const SingleAppsPage: NextPage = () => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);

  const router = useRouter();
  const {
    query: { app },
  } = router;

  const handleAppSelected = (app: string) => {
    router.push({ query: { app } });
  };

  const appId = app && app.length > 0 ? app.toString() : undefined;

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench", headerElements }}
    >
      <ContextBar
        cohorts={COHORTS}
        isGroupCollapsed={isGroupCollapsed}
        setIsGroupCollapsed={setIsGroupCollapsed}
      />
      <div className="relative h-full">
        <CSSTransition in={appId !== undefined} timeout={500}>
          {(state) => (
            <div
              className={
                {
                  entering:
                    "transition-transform scale-y-100 origin-top 5000ms ease ",

                  entered:
                    "transition-transform scale-y-0 origin-top 5000ms ease h-0",
                  exiting:
                    "transition-transform scale-y-100 origin-top 5000ms ease ",
                  exited: "h-full",
                }[state]
              }
            >
              <AnalysisGrid onAppSelected={handleAppSelected} />
            </div>
          )}
        </CSSTransition>
        <ActiveAnalysisToolNoSSR appId={appId} />
      </div>
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
