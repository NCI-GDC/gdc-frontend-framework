import React, { Suspense, lazy, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { CSSTransition } from "react-transition-group";
import { REGISTERED_APPS } from "@/features/user-flow/workflow/registeredApps";
import SearchInput from "@/components/SearchInput";
import AdditionalCohortSelection from "./AdditionalCohortSelection";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";

const importApplication = (app) =>
  lazy(() =>
    import(`@/features/apps/${app}`).catch(
      () => import(`@/features/apps/NullApp`),
    ),
  );

export interface AnalysisToolInfo {
  readonly appId: string;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState(undefined);
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);
  const [inTransitionState, setInTransitionState] = useState(false);
  const { scrollIntoView, targetRef } = useScrollIntoView();
  const router = useRouter();
  const appInfo = REGISTERED_APPS.find((a) => a.id === appId);

  useEffect(() => {
    if (inTransitionState) {
      return;
    }

    if (appInfo?.selectAdditionalCohort) {
      setCohortSelectionOpen(true);
    } else {
      setCohortSelectionOpen(false);
    }
    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp />;
    }

    loadApp().then(setAnalysisApp);
    //scrollIntoView();
  }, [appId, inTransitionState]);

  const handleAppSelected = (app: string) => {
    router.push({ query: { app } });
  };

  const component = (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      }
    >
      <div ref={(ref) => (targetRef.current = ref)}>
        <CSSTransition
          in={appId !== undefined}
          timeout={500}
          onEntered={() => setInTransitionState(true)}
          onExited={() => setInTransitionState(false)}
        >
          {(state) => (
            <div
              className={
                {
                  entering:
                    "transition-transform scale-y-0 origin-bottom 5000ms ease-in-out",
                  entered:
                    "transition-transform scale-y-100 origin-bottom 5000ms ease-in-out",
                  exiting:
                    "transition-transform scale-y-100 origin-bottom 5000ms ease in-out ",
                  exited: "scale-y-0 hidden",
                }[state]
              }
            >
              <AnalysisBreadcrumbs
                currentApp={appId}
                setCohortSelectionOpen={setCohortSelectionOpen}
                cohortSelectionOpen={cohortSelectionOpen}
                setActiveApp={handleAppSelected}
              />

              {cohortSelectionOpen ? (
                <AdditionalCohortSelection
                  app={appId}
                  setOpen={setCohortSelectionOpen}
                  setActiveApp={handleAppSelected}
                />
              ) : (
                <>
                  <div className="w-10/12 m-auto">
                    {appId === "CohortBuilder" ? <SearchInput /> : null}
                  </div>
                  <div className="mx-2 h-full overflow-hidden">
                    {analysisApp}
                  </div>
                </>
              )}
            </div>
          )}
        </CSSTransition>
      </div>
    </Suspense>
  );
  /*
  return ReactDOM.createPortal(
    component,
    document.getElementById("workspace-main") || document.querySelector("main"),
  );
  */
  return component;
};

export default ActiveAnalysisTool;
