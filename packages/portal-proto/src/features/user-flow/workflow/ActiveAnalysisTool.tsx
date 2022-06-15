import React, { Suspense, lazy, useEffect, useState } from "react";
import { Loader } from "@mantine/core";

const importApplication = (app) => {
  return lazy(() =>
    import(`../../../features/apps/${app}`).catch((e) => {
      console.log("importApplication error: ", e);
      return import(`@/features/apps/NullApp`);
    }),
  ); // TODO These longs paths are not the best. Will need to restructure this code.
};

export interface AnalysisToolInfo {
  readonly appId: string;
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
  }, [appId]);

  return (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-100 h-64">
          <Loader size={100} />
        </div>
      }
    >
      {analysisApp}
    </Suspense>
  );
};

export default ActiveAnalysisTool;
