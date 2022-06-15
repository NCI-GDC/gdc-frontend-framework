import React, { Suspense, lazy, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";
import { REGISTERED_APPS } from "./registeredApps";
import { clearComparisonCohorts } from "@gff/core";

const importApplication = (app) =>
  lazy(() =>
    import(`../../../features/apps/${app}`).catch(
      () => import(`@/features/apps/NullApp`),
    ),
  ); // TODO These longs paths are not the best. Will need to restructure this code.

export interface AnalysisToolInfo {
  readonly appId: string;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState(undefined);
  const router = useRouter();
  console.log(appId);

  useEffect(() => {
    async function loadApp() {
      const AnalysisApp = await importApplication(appId);
      return <AnalysisApp />;
    }

    loadApp().then(setAnalysisApp);

    router.push({
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
      {analysisApp}
    </Suspense>
  );
};

export default ActiveAnalysisTool;
