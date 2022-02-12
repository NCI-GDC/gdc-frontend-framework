import React, { Suspense, lazy, useEffect, useState }  from "react";
import { Loader } from '@mantine/core';

const importApplication = app =>
  lazy(() =>
    import(`../../../features/apps/${app}`).catch(() => import(`../../../features/apps/NullApp`))
  ); // TODO These longs paths are not the best. Will need to restructure this code.


export interface AnalysisToolInfo {
  readonly appId: string;
}

const ActiveAnalysisTool : React.FC<AnalysisToolInfo>  = ( { appId } : AnalysisToolInfo) => {

  const [ analysisApp, setAnalysisApp] = useState(undefined);
  console.log(appId);
  useEffect(() => {

    async function loadApp() {
      const AnalysisApp = await importApplication(appId);

      return (
        <AnalysisApp />
      );
    }

    loadApp().then(setAnalysisApp);
  }, [appId]);

  console.log(analysisApp);
  return (
      <Suspense fallback={
        <div className="inline-block justify-center w-100 h-24"><Loader size={100} /></div>
      }>
        {analysisApp}
      </Suspense>
  )
}

export default ActiveAnalysisTool;
