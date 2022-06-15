import React, { Suspense, lazy, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import AdditionalCohortSelection from "./AdditionalCohortSelection";
import { selectComparisonCohorts, useCoreSelector } from "@gff/core";
import { REGISTERED_APPS } from "./registeredApps";

const importApplication = (app) =>
  lazy(() =>
    import(`@/features/apps/${app}`).catch(
      () => import(`@/features/apps/NullApp`),
    ),
  );

export interface AnalysisToolInfo {
  readonly appId: string;
  readonly setActiveApp: (id: string, name: string) => void;
  readonly setContextBarCollapsed: (collapsed: boolean) => void;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
  setActiveApp,
  setContextBarCollapsed,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState(undefined);
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);
  const router = useRouter();
  const currentApp = REGISTERED_APPS.find((app) => app.id === appId);

  useEffect(() => {
    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp />;
    }

    loadApp().then(setAnalysisApp);

    router.push({
      query: { app: appId },
    });

    if (currentApp?.selectAdditionalCohort) {
      setCohortSelectionOpen(true);
    }
  }, [appId]);

  const comparisonCohorts = useCoreSelector((state) =>
    selectComparisonCohorts(state),
  );

  /* Display selection screen if we get to app by page refresh */
  useEffect(() => {
    if (comparisonCohorts.length === 0 && currentApp?.selectAdditionalCohort) {
      setCohortSelectionOpen(true);
    }
  }, []);

  useEffect(() => {
    if (cohortSelectionOpen) {
      setContextBarCollapsed(true);
    }
  }, [cohortSelectionOpen]);

  return (
    <>
      {currentApp?.displayBreadcrumb === false ? null : (
        <AnalysisBreadcrumbs
          currentApp={appId}
          setCohortSelectionOpen={setCohortSelectionOpen}
          cohortSelectionOpen={cohortSelectionOpen}
        />
      )}
      <AdditionalCohortSelection
        currentApp={currentApp}
        open={cohortSelectionOpen}
        setOpen={setCohortSelectionOpen}
        setActiveApp={setActiveApp}
      />
      {!cohortSelectionOpen && (
        <Suspense
          fallback={
            <div className="flex flex-row items-center justify-center w-100 h-64">
              <Loader size={100} />
            </div>
          }
        >
          <div className="mx-2">{analysisApp}</div>
        </Suspense>
      )}
    </>
  );
};

export default ActiveAnalysisTool;
