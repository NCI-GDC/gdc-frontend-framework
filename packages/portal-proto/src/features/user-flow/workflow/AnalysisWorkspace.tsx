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
        className="flex flex-row  items-center shadow-lg bg-primary-lightest"
      >
        <div data-tour="most_common_tools" className="mx-4 my-6 flex">
          <h2 className="text-primary-content-darkest font-bold uppercase pr-6">
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
      <div className="bg-base-lightest">
        <Grid columns={12} className="p-3 my-2" gutter="md">
          <Grid.Col
            data-tour="analysis_tool_filters"
            className="flex flex-col pr-1"
            span={1}
            xs={3}
            sm={3}
            md={3}
            lg={3}
            xl={3}
          >
            <div className="flex justify-between pb-4 text-primary-content-darkest">
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
                    label: "text-primary-content-darkest",
                    dropdown: "border-t-8 border-primary-darkest w-24",
                  }}
                >
                  <Menu.Target>
                    <ActionIcon
                      variant="outline"
                      className="text-primary-content-darkest hover:bg-primary hover:text-primary-content-lightest hover:border-primary"
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
                        "text-primary-content-darker font-medium border border-solid border-primary-darkest hover:bg-primary hover:text-primary-content-max hover:border-primary data-checked:text-primary-content-lightest data-checked:bg-primary-darkest ",
                      checkIcon: "text-white",
                      iconWrapper: "text-primary-content-min",
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
            xs={9}
            sm={9}
            md={9}
            lg={9}
            xl={9}
            span={11}
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
  const [inTransitionState, setInTransitionState] = useState(false);

  const { scrollIntoView, targetRef } = useScrollIntoView({ offset: 115 });
  const router = useRouter();

  useEffect(() => {
    if (app) {
      scrollIntoView();
    } else {
      clearComparisonCohorts();
    }
  }, [app, scrollIntoView]);

  const handleAppLoaded = useCallback(() => {
    scrollIntoView();
  }, [scrollIntoView]);

  const handleAppSelected = (app: string) => {
    router.push({ query: { app } });
  };

  return (
    <div
      ref={(ref) => (targetRef.current = ref)}
      className="flex flex-col flex-grow"
    >
      <CSSTransition in={app !== undefined} timeout={0}>
        {(state) => (
          <div
            className={
              {
                entering:
                  "transition-transform scale-y-100 origin-top 50000ms ease ",

                entered:
                  "transition-transform scale-y-0 origin-top 50000ms ease h-0",
                exiting:
                  "transition-transform scale-y-100 origin-top 50000ms ease ",
                exited: "h-full",
              }[state]
            }
          >
            <AnalysisGrid onAppSelected={handleAppSelected} />
          </div>
        )}
      </CSSTransition>
      <CSSTransition
        in={app !== undefined}
        timeout={0}
        onEntering={() => setInTransitionState(true)}
        onEntered={() => setInTransitionState(false)}
        onExited={() => setInTransitionState(false)}
      >
        {(state) => (
          <div
            className={
              {
                entering:
                  "transition-transform scale-y-0 origin-bottom 50000ms ease",
                entered:
                  "transition-transform scale-y-100 origin-bottom 50000ms ease flex flex-col flex-grow",
                exiting:
                  "transition-transform scale-y-100 origin-bottom 50000ms ease",
                exited: "scale-y-0 hidden",
              }[state]
            }
          >
            <ActiveAnalysisToolNoSSR
              appId={app}
              onLoaded={handleAppLoaded}
              inTransitionState={inTransitionState}
            />
          </div>
        )}
      </CSSTransition>
    </div>
  );
};

export default AnalysisWorkspace;
