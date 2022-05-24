import React, { useEffect, useState, useCallback } from "react";
import { Chip, Chips, Menu, Grid, Select, ActionIcon } from "@mantine/core";
import { MdClear as Clear, MdSort as SortIcon } from "react-icons/md";
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
import dynamic from "next/dynamic";
import FeaturedToolCard from "./FeaturedToolCard";
import tailwindConfig from "tailwind.config";

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
);
const ALL_OTHER_APPS = Object.keys(initialApps).filter(
  (x) => !RECOMMENDED_APPS.includes(x),
);

interface AnalysisGridProps {
  readonly onAppSelected?: (id: string, name: string) => void;
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

  console.log("tags", appTags);
  console.log("active", activeApps);

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
    onAppSelected(x.id, x.name);
  };

  return (
    <div className="flex flex-col mb-6 ">
      <div
        data-tour="analysis_tool_management"
        className="flex flex-row  items-center shadow-lg bg-nci-blue-darkest"
      >
        <div data-tour="most_common_tools" className="mx-4 my-6">
          <Grid className="mx-2" columns={13}>
            <Grid.Col span={1}>
              <h2 className="text-white font-bold uppercase">
                {"Featured Tools"}
              </h2>
            </Grid.Col>
            {recommendedApps
              .map((k) => initialApps[k])
              .map((x: AppRegistrationEntry) => {
                return (
                  <Grid.Col
                    key={x.name}
                    span={4}
                    //xs={12}
                    //sm={6}
                    //md={4}
                    //lg={3}
                    //xl={2}
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
      <Grid className="p-2" gutter={"lg"}>
        <Grid.Col
          data-tour="analysis_tool_filters"
          className="flex flex-col p-3"
          span={3}
        >
          <div className="flex justify-between pb-2">
            <div>
              <h2 className="font-bold pb-2 uppercase">Tools</h2>
              <h3>Categories</h3>
            </div>
            <div className="flex flex-col">
              <Menu
                control={
                  <ActionIcon variant="outline">
                    <SortIcon />
                  </ActionIcon>
                }
                aria-label="Select tools sort"
                withinPortal={false}
                classNames={{
                  body: "border-t-4 border-nci-blue w-28",
                }}
              >
                {sortOptions.map((option) => (
                  <Menu.Item onClick={() => setSortType(option.value)}>
                    {option.label}
                  </Menu.Item>
                ))}
              </Menu>
              {activeTags.length ? (
                <span className="pointer" onClick={() => setActiveTags([])}>
                  {"Clear all"}
                </span>
              ) : (
                <span
                  onClick={() => setActiveTags(appTags.map((tag) => tag.value))}
                  tabIndex={0}
                  onKeyPress={(event) =>
                    event.key === "Enter"
                      ? setActiveTags(appTags.map((tag) => tag.value))
                      : undefined
                  }
                  className="cursor-pointer mt-1"
                >
                  {"Select all"}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-row">
            <Chips
              multiple
              noWrap={false}
              value={activeTags}
              onChange={setActiveTags}
              classNames={{
                checked: "!text-white bg-gdc-cyan",
                label: "text-gdc-cyan",
                checkIcon: "text-white",
              }}
            >
              {appTags.map((x) => (
                <Chip size="sm" key={x.value} value={x.value}>
                  {x.name}
                </Chip>
              ))}
            </Chips>
          </div>
        </Grid.Col>

        <Grid.Col data-tour="all_other_apps" span={9}>
          <Grid className="mx-2">
            {activeApps
              .map((k) => initialApps[k])
              .map((x: AppRegistrationEntry) => {
                return (
                  <Grid.Col
                    key={x.name}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    style={{ minHeight: 130, maxWidth: 180 }}
                  >
                    <AnalysisCard
                      entry={{ ...{ applicable: true, ...x } }}
                      onClick={handleOpenAppClicked}
                    />
                  </Grid.Col>
                );
              })}
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
};

interface AnalysisWorkspaceProps {
  readonly app: string | undefined;
}
const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  app,
}: AnalysisWorkspaceProps) => {
  const [selectedApp, setSelectedApp] = useState(undefined);
  const [selectedAppName, setSelectedAppName] = useState(undefined);

  const handleAppSelected = (id: string, name: string) => {
    setSelectedApp(id);
    setSelectedAppName(name);
  };

  useEffect(() => {
    setSelectedApp(app);
    setSelectedAppName(undefined); // will use the registered app name
  }, [app]);

  return (
    <div>
      {" "}
      {selectedApp ? (
        <div className="flex flex-col mx-2">
          <div className="flex flex-row items-center">
            <button
              onClick={() => setSelectedApp(undefined)}
              className="bg-nci-gray-lighter hover:bg-nci-gray-light font-montserrat tracking-widest uppercase rounded-md shadow-md p-1 px-2 py-2"
            >
              Applications
            </button>
            <div className=" mx-3 font-montserrat">/</div>
            <div className="bg-nci-gray-lighter font-montserrat tracking-widest uppercase rounded-md shadow-md p-1 px-2">
              {selectedAppName
                ? selectedAppName
                : initialApps[selectedApp].name}
            </div>
          </div>
          <ActiveAnalysisToolNoSSR appId={selectedApp} />
        </div>
      ) : (
        <AnalysisGrid onAppSelected={handleAppSelected} />
      )}
    </div>
  );
};

export default AnalysisWorkspace;
