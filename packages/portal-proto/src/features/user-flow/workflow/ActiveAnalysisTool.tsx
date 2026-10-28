import React, { Suspense, lazy, useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import { DemoUtil } from "@/features/apps/DemoUtil";
import { REGISTERED_APPS } from "./registeredApps";

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
  // a tool flagged with a status is unavailable, even when reached directly by URL
  const status = REGISTERED_APPS.find((app) => app.id === appId)?.status;

  useEffect(() => {
    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp />;
    }

    loadApp().then(setAnalysisApp);
  }, [appId]);

  if (status) {
    return <DemoUtil text={status.details ?? status.label} />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-full h-96">
          <Loader size={100} />
        </div>
      }
    >
      <div>{analysisApp}</div>
    </Suspense>
  );
};

export default ActiveAnalysisTool;
