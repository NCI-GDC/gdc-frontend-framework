import React, { Suspense, lazy, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";
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
  readonly onLoaded: () => void;
  readonly inTransitionState: boolean;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
  onLoaded,
  inTransitionState,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState(undefined);
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);
  const [showCohortSelection, setShowCohortSelection] = useState(false);
  const router = useRouter();
  const appInfo = REGISTERED_APPS.find((a) => a.id === appId);

  useEffect(() => {
    if (!inTransitionState) {
      setShowCohortSelection(cohortSelectionOpen);
    }
  }, [cohortSelectionOpen, inTransitionState]);

  useEffect(() => {
    if (appInfo?.selectAdditionalCohort) {
      setCohortSelectionOpen(true);
    } else {
      setCohortSelectionOpen(false);
    }

    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp onLoaded={onLoaded} />;
    }

    loadApp().then(setAnalysisApp);
  }, [appId, onLoaded, inTransitionState]);

  const handleAppSelected = (app: string) => {
    router.push({ query: { app } });
  };

  return (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      }
    >
      <div>
        <AnalysisBreadcrumbs
          currentApp={appId}
          setCohortSelectionOpen={setCohortSelectionOpen}
          cohortSelectionOpen={cohortSelectionOpen}
          setActiveApp={handleAppSelected}
          rightComponent={appId === "CohortBuilder" ? <SearchInput /> : null}
        />
        {showCohortSelection ? (
          <AdditionalCohortSelection
            app={appId}
            setOpen={setCohortSelectionOpen}
            setActiveApp={handleAppSelected}
          />
        ) : (
          <div className="mx-2">{analysisApp}</div>
        )}
      </div>
    </Suspense>
  );
};

export default ActiveAnalysisTool;
