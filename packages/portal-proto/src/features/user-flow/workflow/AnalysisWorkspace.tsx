import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useScrollIntoView } from "@mantine/hooks";
import AnalysisCard from "@/features/user-flow/workflow/AnalysisCard";
import {
  REGISTERED_APPS,
  RECOMMENDED_APPS,
} from "@/features/user-flow/workflow/registeredApps";
import { AppRegistrationEntry } from "@/features/user-flow/workflow/utils";
import SearchInput from "@/components/SearchInput";
import dynamic from "next/dynamic";
import CoreToolCard from "./CoreToolCard";

import { CSSTransition } from "react-transition-group";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import AdditionalCohortSelection from "./AdditionalCohortSelection";
import { clearComparisonCohorts } from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";

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

interface AnalysisGridProps {
  readonly onAppSelected?: (id: string, demoMode?: boolean) => void;
}

const AnalysisGrid: React.FC<AnalysisGridProps> = ({
  onAppSelected,
}: AnalysisGridProps) => {
  // TODO: move app registration to core
  // create mappable object

  // TODO: build app registration and tags will be handled here
  const [recommendedApps] = useState([...RECOMMENDED_APPS]); // recommended apps based on Context
  const [activeApps] = useState([...ALL_OTHER_APPS]); // set of active apps i.e. not recommended but filterable/dimmable
  const [activeAnalysisCard, setActiveAnalysisCard] = useState(null);

  const handleOpenAppClicked = (
    x: AppRegistrationEntry,
    demoMode?: boolean,
  ) => {
    onAppSelected(x.id, demoMode);
  };

  return (
    <div className="flex flex-col font-heading mb-4">
      <div data-tour="analysis_tool_management" className="flex items-center">
        <div data-tour="most_common_tools" className="mx-4 my-6">
          <h2 className="text-primary-content-darkest font-bold uppercase text-xl mb-2">
            Core Tools
          </h2>
          <div className="flex gap-6 flex-wrap">
            {recommendedApps
              .map((k) => initialApps[k])
              .map((x: AppRegistrationEntry) => {
                return (
                  <div key={x.name} className="basis-coretools">
                    <CoreToolCard
                      entry={{ ...{ applicable: true, ...x } }}
                      onClick={handleOpenAppClicked}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="mx-4 my-2">
        <h2 className="text-primary-content-darkest font-bold uppercase text-xl mb-2">
          Analysis Tools
        </h2>

        <div className="flex gap-6 flex-wrap">
          {activeApps
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((k) => initialApps[k])
            .map((x: AppRegistrationEntry, idx: number) => {
              return (
                <div key={x.name} className="min-w-0 basis-tools">
                  <AnalysisCard
                    entry={{ ...{ applicable: true, ...x } }}
                    onClick={handleOpenAppClicked}
                    descriptionVisible={activeAnalysisCard === idx}
                    setDescriptionVisible={() =>
                      setActiveAnalysisCard(
                        idx === activeAnalysisCard ? null : idx,
                      )
                    }
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

interface AnalysisWorkspaceProps {
  readonly app: string | undefined;
}

const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  app,
}: AnalysisWorkspaceProps) => {
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);
  const { scrollIntoView, targetRef } = useScrollIntoView({ offset: 115 });
  const router = useRouter();
  const isDemoMode = useIsDemoApp();
  const appInfo = useMemo(
    () => REGISTERED_APPS.find((a) => a.id === app),
    [app],
  );
  useEffect(() => {
    setCohortSelectionOpen(!isDemoMode && appInfo?.selectAdditionalCohort);

    if (app) {
      scrollIntoView();
    } else {
      clearComparisonCohorts();
    }
  }, [app, isDemoMode, appInfo, scrollIntoView]);

  const handleAppSelected = (app: string, demoMode?: boolean) => {
    router.push({ query: { app, ...(demoMode && { demoMode }) } });
  };

  const handleAppLoaded = useCallback(() => {
    scrollIntoView();
  }, [scrollIntoView]);

  return (
    <div ref={(ref) => (targetRef.current = ref)}>
      <CSSTransition in={cohortSelectionOpen} timeout={500}>
        {(state) => (
          <div
            className={
              {
                entering:
                  "animate-slide-up min-h-[550px] w-full flex flex-col absolute z-[200]",
                entered: "min-h-[550px] w-full flex flex-col absolute z-[200]",
                exiting:
                  "animate-slide-down min-h-[550px] w-full flex flex-col absolute z-[200]",
                exited: "hidden translate-x-0",
              }[state]
            }
          >
            <AnalysisBreadcrumbs
              currentApp={app}
              setCohortSelectionOpen={setCohortSelectionOpen}
              cohortSelectionOpen={cohortSelectionOpen}
              setActiveApp={handleAppSelected}
              onDemoApp={isDemoMode}
            />
            <AdditionalCohortSelection
              app={app}
              setOpen={setCohortSelectionOpen}
              setActiveApp={handleAppSelected}
            />
          </div>
        )}
      </CSSTransition>
      {app && !cohortSelectionOpen && (
        <>
          <AnalysisBreadcrumbs
            currentApp={app}
            setCohortSelectionOpen={setCohortSelectionOpen}
            cohortSelectionOpen={cohortSelectionOpen}
            setActiveApp={handleAppSelected}
            onDemoApp={isDemoMode}
            rightComponent={
              app === "CohortBuilder" && !isDemoMode ? <SearchInput /> : null
            }
          />
          <ActiveAnalysisToolNoSSR appId={app} onLoaded={handleAppLoaded} />
        </>
      )}
      {!app && <AnalysisGrid onAppSelected={handleAppSelected} />}
    </div>
  );
};

export default AnalysisWorkspace;
