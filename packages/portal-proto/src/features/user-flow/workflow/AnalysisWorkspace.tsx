import React, { useEffect, useState, createContext, useReducer } from "react";
import { useRouter } from "next/router";
import AnalysisCard from "@/features/user-flow/workflow/AnalysisCard";
import {
  REGISTERED_APPS,
  RECOMMENDED_APPS,
} from "@/features/user-flow/workflow/registeredApps";
import { AppRegistrationEntry } from "@/features/user-flow/workflow/utils";
import dynamic from "next/dynamic";
import CoreToolCard from "./CoreToolCard";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  chartDownloadReducer,
  DashboardDownloadContext,
} from "@/utils/contexts";
import { CountHookRegistry } from "@gff/core";

const ActiveAnalysisToolNoSSR = dynamic(
  () => import("@/features/user-flow/workflow/ActiveAnalysisTool"),
  {
    ssr: false,
  },
);

const initialApps = REGISTERED_APPS.reduce(
  (obj, item) => ((obj[item.id] = item), obj),
  {},
) as AppRegistrationEntry[];
const ALL_OTHER_APPS = Object.keys(initialApps).filter(
  (x) => !RECOMMENDED_APPS.includes(x),
);

const AnalysisGrid: React.FC = () => {
  // TODO: move app registration to core
  // create mappable object

  // TODO: build app registration and tags will be handled here
  const [recommendedApps] = useState([...RECOMMENDED_APPS]); // recommended apps based on Context
  const [activeApps] = useState([...ALL_OTHER_APPS]); // set of active apps i.e. not recommended but filterable/dimmable
  const [activeAnalysisCard, setActiveAnalysisCard] = useState(null);
  const registry = CountHookRegistry.getInstance();

  return (
    <div className="flex flex-col font-heading mb-4">
      <div data-tour="analysis_tool_management" className="flex items-center">
        <h1 className="sr-only">Tools</h1>
        <div data-tour="most_common_tools" className="m-4">
          <h2 className="text-primary-content-darkest font-bold uppercase text-xl mb-2">
            Core Tools
          </h2>
          <div className="flex gap-4 lg:gap-6 flex-wrap">
            {recommendedApps
              .map((k) => initialApps[k])
              .map((x: AppRegistrationEntry) => {
                return (
                  <div
                    key={x.name}
                    className="basis-tools-sm md:basis-tools-md lg:basis-coretools"
                    data-testid={`button-core-tools-${x.name}`}
                  >
                    <CoreToolCard entry={{ ...{ applicable: true, ...x } }} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="m-4">
        <h2 className="text-primary-content-darkest font-bold uppercase text-xl mb-2">
          Analysis Tools
        </h2>

        <div className="flex gap-4 lg:gap-6 flex-wrap">
          {activeApps
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((k) => initialApps[k])
            .map((x: AppRegistrationEntry, idx: number) => {
              const countHook = registry.getHook(x.countsField);
              return (
                <div
                  key={x.name}
                  className="min-w-0 basis-tools-sm md:basis-tools-md lg:basis-tools"
                >
                  <AnalysisCard
                    entry={{ ...{ applicable: true, ...x } }}
                    descriptionVisible={activeAnalysisCard === idx}
                    setDescriptionVisible={() =>
                      setActiveAnalysisCard(
                        idx === activeAnalysisCard ? null : idx,
                      )
                    }
                    useApplicationDataCounts={countHook}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

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
      {!app && <AnalysisGrid />}
    </div>
  );
};

export default AnalysisWorkspace;
