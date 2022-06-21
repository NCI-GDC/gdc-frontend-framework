import React, { Suspense, lazy, useEffect, useState } from "react";
import Router from "next/router";
import { Loader } from "@mantine/core";

const importApplication = (app) =>
  lazy(() =>
    import(`@/features/apps/${app}`).catch(
      () => import(`@/features/apps/NullApp`),
    ),
  );

export interface AnalysisToolInfo {
  readonly appId: string;
  readonly setActiveApp?: (id: string, name: string) => void;
  readonly setContextBarCollapsed?: (collapsed: boolean) => void;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState(undefined);

  useEffect(() => {
    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp />;
    }

    loadApp().then(setAnalysisApp);

    Router.push({
      query: { app: appId },
    });
  }, [appId]);

  return (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-100 h-64">
          <Loader size={100} />
        </div>
      }
    >
      <div className="mx-2">{analysisApp}</div>
    </Suspense>
  );
};

export default ActiveAnalysisTool;
