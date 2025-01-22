import React, { useEffect, useState, useReducer } from "react";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import AnalysisGrid from "./AnalysisGrid";
import {
  chartDownloadReducer,
  DashboardDownloadContext,
  SelectionScreenContext,
} from "./context";
import { AppRegistrationEntry } from "./types";

interface AnalysisWorkspaceProps {
  readonly app: string | undefined;
  readonly registeredApps: AppRegistrationEntry[];
  readonly recommendedApps: string[];
  readonly CountHookRegistry: any;
  readonly handleAppSelected: (app?: string, demoMode?: boolean) => void;
  readonly isDemoMode: boolean;
  readonly skipSelectionScreen: boolean;
  readonly ActiveAnalysisTool: React.ComponentType<{ appId: string }>;
}

const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  app,
  registeredApps,
  recommendedApps,
  CountHookRegistry,
  handleAppSelected,
  isDemoMode,
  skipSelectionScreen,
  ActiveAnalysisTool,
}: AnalysisWorkspaceProps) => {
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);
  const appInfo = registeredApps.find((a) => a.id === app);

  if (app !== undefined && appInfo === undefined) {
    return undefined;
  }

  useEffect(() => {
    setCohortSelectionOpen(
      !skipSelectionScreen && appInfo?.selectionScreen !== undefined,
    );
  }, [app, appInfo, skipSelectionScreen]);

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
              registeredApps={registeredApps}
            />
            <ActiveAnalysisTool appId={app} />
          </DashboardDownloadContext.Provider>
        </SelectionScreenContext.Provider>
      )}
      {!app && (
        <AnalysisGrid
          CountHookRegistry={CountHookRegistry}
          registeredApps={registeredApps}
          recommendedApps={recommendedApps}
        />
      )}
    </div>
  );
};

export default AnalysisWorkspace;
