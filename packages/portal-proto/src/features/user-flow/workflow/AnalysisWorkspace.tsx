import React, { useEffect, useState, useCallback } from "react";
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
import FeaturedToolCard from "./FeaturedToolCard";

import { CSSTransition } from "react-transition-group";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import AdditionalCohortSelection from "./AdditionalCohortSelection";
import { clearComparisonCohorts } from "@gff/core";

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
  readonly onAppSelected?: (id: string) => void;
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

  const handleOpenAppClicked = (x: AppRegistrationEntry) => {
    onAppSelected(x.id);
  };

  return (
    <div className="flex flex-col font-montserrat">
      <div
        data-tour="analysis_tool_management"
        className="flex flex-row  items-center shadow-lg bg-nci-blue-darkest"
      >
        <div data-tour="most_common_tools" className="mx-4 my-6 flex">
          <h2 className="text-white font-bold uppercase pr-6">
            {"Featured Tools"}
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
                    <FeaturedToolCard
                      entry={{ ...{ applicable: true, ...x } }}
                      onClick={handleOpenAppClicked}
                    />
                  </Grid.Col>
                );
              })}
          </Grid>
        </div>
      </div>
      <div className="bg-white">
        <Grid className="p-3 my-2" gutter={"lg"}>
          <Grid.Col
            data-tour="analysis_tool_filters"
            className="flex flex-col p-3"
            xs={4}
            sm={4}
            md={3}
            lg={3}
            xl={2}
          >
            <div className="flex justify-between pb-4 text-nci-blue-darkest">
              <div>
                <h2 className="font-bold text-lg pb-3 uppercase">Tools</h2>
                <h3 className="text-lg">Categories</h3>
              </div>
              <div className="flex flex-col justify-around items-end">
                <Menu
                  aria-label="Select tools sort"
                  withinPortal={false}
                  position="bottom-start"
                  transition="pop-bottom-left"
                  transitionDuration={150}
                  classNames={{
                    label: "text-nci-blue-darkest",
                    dropdown: "border-t-8 border-nci-blue-darkest w-24",
                  }}
                >
                  <Menu.Target>
                    <ActionIcon
                      variant="outline"
                      className="text-nci-blue-darkest hover:bg-nci-blue hover:text-white hover:border-nci-blue"
                    >
                      <SortIcon size={24} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {sortOptions.map((option) => (
                      <Menu.Item
                        onClick={() => setSortType(option.value)}
                        key={option.value}
                      >
                        {option.label}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
                {activeTags.length ? (
                  <span
                    className="cursor-pointer text-xs"
                    tabIndex={0}
                    role="button"
                    onClick={() => setActiveTags([])}
                    onKeyPress={(event) =>
                      event.key === "Enter" ? setActiveTags([]) : undefined
                    }
                  >
                    {"Clear all"}
                  </span>
                ) : (
                  <span
                    className="cursor-pointer text-xs"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setActiveTags(appTags.map((tag) => tag.value))
                    }
                    onKeyPress={(event) =>
                      event.key === "Enter"
                        ? setActiveTags(appTags.map((tag) => tag.value))
                        : undefined
                    }
                  >
                    {"Select all"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row">
              <Chip.Group
                multiple
                noWrap={false}
                value={activeTags}
                onChange={setActiveTags}
                spacing={"xs"}
              >
                {appTags.map((x) => (
                  <Chip
                    key={x.value}
                    size="xs"
                    value={x.value}
                    classNames={{
                      label:
                        "text-nci-blue border border-solid border-nci-blue-darkest hover:bg-nci-blue hover:text-white hover:border-nci-blue data-checked:text-white data-checked:bg-nci-blue-darkest ",
                      checkIcon: "text-white",
                      iconWrapper: "text-white",
                    }}
                  >
                    {x.name}
                  </Chip>
                ))}
              </Chip.Group>
            </div>
          </Grid.Col>

          <Grid.Col
            data-tour="all_other_apps"
            xs={8}
            sm={8}
            md={9}
            lg={9}
            xl={10}
          >
            <Grid className="mx-2">
              {activeApps
                .map((k) => initialApps[k])
                .map((x: AppRegistrationEntry, idx: number) => {
                  return (
                    <Grid.Col
                      key={x.name}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      style={{ minHeight: 130, maxWidth: 170 }}
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

  useEffect(() => {
    const appInfo = REGISTERED_APPS.find((a) => a.id === app);
    setCohortSelectionOpen(appInfo?.selectAdditionalCohort);

    if (app) {
      scrollIntoView();
    } else {
      clearComparisonCohorts();
    }
  }, [app, scrollIntoView]);

  const handleAppSelected = (app: string) => {
    router.push({ query: { app } });
  };

  return (
    <div ref={(ref) => (targetRef.current = ref)}>
      <CSSTransition in={cohortSelectionOpen} timeout={500}>
        {(state) => (
          <div
            className={
              {
                entering:
                  "block animate-slide-up min-h-[650px] w-full flex flex-col absolute z-[1000]",
                entered: `block min-h-[650px] w-full flex flex-col absolute z-[1000]`,
                exiting:
                  "block animate-slide-down min-h-[650px] w-full flex flex-col absolute z-[1000]",
                exited: "hidden translate-x-0",
              }[state]
            }
          >
            <AnalysisBreadcrumbs
              currentApp={app}
              setCohortSelectionOpen={setCohortSelectionOpen}
              cohortSelectionOpen={cohortSelectionOpen}
              setActiveApp={handleAppSelected}
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
          />
          <div className="w-10/12 m-auto">
            {app === "CohortBuilder" ? <SearchInput /> : null}
          </div>
          <ActiveAnalysisToolNoSSR appId={app} />
        </>
      )}
      {!app && <AnalysisGrid onAppSelected={handleAppSelected} />}
    </div>
  );
};

export default AnalysisWorkspace;
