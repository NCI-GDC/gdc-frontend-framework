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

/**
 * Component to handle the navigation and selecting of apps from the Analysis Tools grid. Routing
 * should be handled by the application.
 * @param app - appId of the current app
 * @param registeredApps - list of available apps
 * @param recommendedApps - apps to display more prominently in the Core Tools section
 * @param CountHookRegistry - collection of hooks used for fetching count data
 * @param handleAppSelected - callback to handle routing when an app is selected from the tools grid
 * @param isDemoMode - whether the app is in demo mode
 * @param skipSelectionScreen - whether the selection screen component should be displayed on selecting the app
 * @param ActiveAnalysisTool - component wrapper to handle displaying the active analysis tool
 */

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

  useEffect(() => {
    setCohortSelectionOpen(
      !skipSelectionScreen && appInfo?.selectionScreen !== undefined,
    );
  }, [app, appInfo, skipSelectionScreen]);

  const [chartDownloadState, dispatch] = useReducer(chartDownloadReducer, []);

  if (app !== undefined && appInfo === undefined) {
    return undefined;
  }

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
