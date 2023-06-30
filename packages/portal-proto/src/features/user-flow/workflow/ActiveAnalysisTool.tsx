import React, { Suspense, lazy, useEffect, useState } from "react";
import { Loader } from "@mantine/core";

const importApplication = (app) =>
  lazy(() =>
    import(`@/features/apps/${app}`).catch(
      () => import(`@/features/apps/NullApp`),
    ),
  );

export interface AnalysisToolInfo {
  readonly appId: string;
  readonly onLoaded: () => void;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
  onLoaded,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState(undefined);

  useEffect(() => {
    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp onLoaded={onLoaded} />;
    }

    loadApp().then(setAnalysisApp);
  }, [appId, onLoaded]);

  return (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      }
    >
      <div>{analysisApp}</div>
    </Suspense>
  );
};

export default ActiveAnalysisTool;
