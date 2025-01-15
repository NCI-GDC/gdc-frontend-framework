import React, { useEffect, useState, createContext, useReducer } from "react";
import { useRouter } from "next/router";
import {
  REGISTERED_APPS,
  RECOMMENDED_APPS,
} from "@/features/user-flow/workflow/registeredApps";
import dynamic from "next/dynamic";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  chartDownloadReducer,
  DashboardDownloadContext,
} from "@/utils/contexts";
import { CountHookRegistry } from "@gff/core";
import { AnalysisGrid } from "@gff/portal-components";

const ActiveAnalysisToolNoSSR = dynamic(
  () => import("@/features/user-flow/workflow/ActiveAnalysisTool"),
  {
    ssr: false,
  },
);

export const SelectionScreenContext = createContext({
  selectionScreenOpen: false,
  setSelectionScreenOpen: undefined,
  app: undefined,
  setActiveApp: undefined,
});

interface AnalysisWorkspaceProps {
  readonly app: string | undefined;
}

const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  app,
}: AnalysisWorkspaceProps) => {
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);
  const router = useRouter();
  const isDemoMode = useIsDemoApp();
  const appInfo = REGISTERED_APPS.find((a) => a.id === app);
  const skipSelectionScreen =
    router?.query?.skipSelectionScreen === "true" || isDemoMode;

  useEffect(() => {
    setCohortSelectionOpen(
      !skipSelectionScreen && appInfo?.selectionScreen !== undefined,
    );
  }, [app, appInfo, skipSelectionScreen]);

  const handleAppSelected = (app: string, demoMode?: boolean) => {
    router.push({ query: { app, ...(demoMode && { demoMode }) } });
  };

  const [chartDownloadState, dispatch] = useReducer(chartDownloadReducer, []);

  return (
    <div>
      {app && (
        <SelectionScreenContext.Provider
          value={{
            selectionScreenOpen: cohortSelectionOpen,
            setSelectionScreenOpen: setCohortSelectionOpen,
            app,
            setActiveApp: handleAppSelected,
          }}
        >
          <DashboardDownloadContext.Provider
            value={{ state: chartDownloadState, dispatch }}
          >
            <AnalysisBreadcrumbs
              onDemoApp={isDemoMode}
              skipSelectionScreen={skipSelectionScreen}
              rightComponent={
                appInfo?.rightComponent && <appInfo.rightComponent />
              }
            />
            <ActiveAnalysisToolNoSSR appId={app} />
          </DashboardDownloadContext.Provider>
        </SelectionScreenContext.Provider>
      )}
      {!app && (
        <AnalysisGrid
          CountHookRegistry={CountHookRegistry}
          registeredApps={REGISTERED_APPS}
          recommendedApps={RECOMMENDED_APPS}
        />
      )}
    </div>
  );
};

export default AnalysisWorkspace;
