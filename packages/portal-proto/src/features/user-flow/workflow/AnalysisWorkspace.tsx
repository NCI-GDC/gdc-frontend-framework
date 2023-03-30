import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Chip, Menu, Grid, ActionIcon } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { MdSort as SortIcon } from "react-icons/md";
import AnalysisCard from "@/features/user-flow/workflow/AnalysisCard";
import {
  APPTAGS,
  REGISTERED_APPS,
  RECOMMENDED_APPS,
} from "@/features/user-flow/workflow/registeredApps";
import {
  AppRegistrationEntry,
  sortAlphabetically,
} from "@/features/user-flow/workflow/utils";
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

const sortOptions = [
  { value: "a-z", label: "Sort: A-Z" },
  { value: "z-a", label: "Sort: Z-A" },
];

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

  const [appTags] = useState(APPTAGS); // set of tags to classify and App with.
  // TODO: build app registration and tags will be handled here
  const [activeTags, setActiveTags] = useState([]); // set of selected tags
  const [sortType, setSortType] = useState("a-z");
  const [recommendedApps] = useState([...RECOMMENDED_APPS]); // recommended apps based on Context
  const [remainingApps] = useState([...ALL_OTHER_APPS]); // all other apps
  const [activeApps, setActiveApps] = useState([...ALL_OTHER_APPS]); // set of active apps i.e. not recommended but filterable/dimmable
  const [activeAnalysisCard, setActiveAnalysisCard] = useState(null);

  const sortTools = (arr, st) => {
    if (st === "default") return arr;
    else {
      return sortAlphabetically(arr, st);
    }
  };

  const filterAppsByTagsAndSort = useCallback(() => {
    // filter apps based off tags then sort
    const filteredApps = activeTags.length
      ? remainingApps.filter((key) =>
          initialApps[key].tags.some((tag) => activeTags.includes(tag)),
        )
      : remainingApps;
    const sortedApps = sortTools([...filteredApps], sortType);
    setActiveApps(sortedApps);
  }, [activeTags, remainingApps, sortType]);

  useEffect(() => {
    filterAppsByTagsAndSort();
  }, [filterAppsByTagsAndSort]);

  const handleOpenAppClicked = (
    x: AppRegistrationEntry,
    demoMode?: boolean,
  ) => {
    onAppSelected(x.id, demoMode);
  };

  return (
    <div className="flex flex-col font-heading mb-4">
      <div
        data-tour="analysis_tool_management"
        className="flex flex-row  items-center shadow-lg bg-primary-lightest"
      >
        <div data-tour="most_common_tools" className="mx-4 my-6 flex flex-col">
          <h2 className="text-primary-content-darkest font-bold uppercase pr-6 mb-2">
            Core Tools
          </h2>
          <Grid columns={12}>
            {recommendedApps
              .map((k) => initialApps[k])
              .map((x: AppRegistrationEntry) => {
                return (
                  <Grid.Col
                    key={x.name}
                    lg={4}
                    xl={4}
                    style={{ minHeight: 64 }}
                  >
                    <CoreToolCard
                      entry={{ ...{ applicable: true, ...x } }}
                      onClick={handleOpenAppClicked}
                    />
                  </Grid.Col>
                );
              })}
          </Grid>
        </div>
      </div>
      <div className="bg-base-max mx-4 my-2">
        <div>
          <h2 className="font-bold text-lg pb-3 uppercase">Tools</h2>
        </div>

        <Grid columns={12} gutter="md">
          <Grid.Col
            data-tour="all_other_apps"
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            span={12}
          >
            <Grid className="mx-0" gutter="md">
              {activeApps
                .map((k) => initialApps[k])
                .map((x: AppRegistrationEntry, idx: number) => {
                  return (
                    <Grid.Col
                      key={x.name}
                      xs={8}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      style={{ minHeight: 130, maxWidth: 200 }}
                    >
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
                    </Grid.Col>
                  );
                })}
            </Grid>
          </Grid.Col>
        </Grid>
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
