import React, { useEffect, useState } from "react";
import { Chip, Chips, Grid, Select } from "@mantine/core";
import { MdClear as Clear } from "react-icons/md";
import AnalysisCard from "./AnalysisCard";
import { APPTAGS, REGISTERED_APPS, RECOMMENDED_APPS } from "./registeredApps";
import { AppRegistrationEntry, sortAlphabetically } from "./utils";
import dynamic from "next/dynamic";

const ActiveAnalysisToolNoSSR = dynamic(() => import("./ActiveAnalysisTool"), {
  ssr: false,
});

const sortOptions = [
  { value: "default", label: "Default"},
  { value: "a-z", label: "Sort: A-Z" },
  { value: "z-a", label: "Sort: Z-A" },
];

const initialApps = REGISTERED_APPS.reduce((obj, item) => (obj[item.id] = item, obj) ,{});
const ALL_OTHER_APPS = Object.keys(initialApps).filter((x) => !RECOMMENDED_APPS.includes(x));

interface AnalysisGridProps {
  readonly onAppSelected?: (id:string, name: string) => void;
}

const AnalysisGrid : React.FC<AnalysisGridProps>  = ( { onAppSelected } : AnalysisGridProps) => {
  // TODO: move app registration to core
  // create mappable object


  const [appTags] = useState(APPTAGS); // set of tags to classify and App with.
  // TODO: build app registration and tags will be handled here
  const [activeTags, setActiveTags] = useState([]); // set of selected tags
  const [sortType, setSortType] = useState("a-z");
  const [recommendedApps] = useState([...RECOMMENDED_APPS]); // recommended apps based on Context
  const [remainingApps] = useState([...ALL_OTHER_APPS]); // all other apps
  const [activeApps, setActiveApps] = useState([...ALL_OTHER_APPS] ); // set of active apps i.e. not recommended but filterable/dimmable

  const sortTools = (arr, st) => {
    if (st === "default")
      return arr
    else {
      return sortAlphabetically(arr, st )
    }
  }

  const filterAppsByTagsAndSort = () => {
    // filter apps based off tags then sort
    const filteredApps = activeTags.length ? remainingApps.filter(key =>  initialApps[key].tags.some(tag => activeTags.includes(tag))) : remainingApps;
    const sortedApps = sortTools([...filteredApps], sortType)
    setActiveApps(sortedApps);
  }

  useEffect(() => {
    filterAppsByTagsAndSort();
  }, [activeTags, sortType]);

  const handleOpenAppClicked = (x:AppRegistrationEntry ) => {
    onAppSelected( x.id, x.name);
  }

  return (
    <div className="flex flex-col mb-6 ">
      <div data-tour="analysis_tool_management" className="flex flex-row  items-center mx-4 my-2 p-2 border border-nci-gray-lighter rounded-md shadow-lg">
        <div data-tour="most_common_tools" className="mx-10" >
          <Grid className="mx-2"  >
            { recommendedApps.map(k => initialApps[k]).map((x: AppRegistrationEntry) => {
                return (<Grid.Col key={x.name} xs={12} sm={6} md={4} lg={3} xl={2} style={{ minHeight: 64, maxWidth: 220 }}>
                  <AnalysisCard  entry={{...{  applicable: true,  ...x }}} onClick={handleOpenAppClicked} />
                </Grid.Col>)
              }
            )}
          </Grid>
        </div>
        <div data-tour="analysis_tool_filters" className="flex flex-col w-1/2">
          <h2 className="ml-6">Filter Tools</h2>
          <div className="flex flex-row">
            <Chips  className="py-1 pr-0" style={{ paddingRight: 0 }} multiple noWrap={false} value={activeTags}
                   onChange={setActiveTags}>
              {
                appTags.map((x) => <Chip size="sm" key={x.value} value={x.value}>{x.name}</Chip>)
              }
            </Chips>
            {activeTags.length ?
              <button className="bg-nci-gray-lighter h-6 rounded-full hover:bg-nci-gray"
                      onClick={() => setActiveTags([])} aria-label="Tools filter clear button">
                <Clear size="1.5rem" />
              </button> : null
            }
          </div>
          <div className=" mt-3">
            <Select data={sortOptions}
                    value={sortType}
                    classNames={{
                      root: "border border-nci-gray-lighter round-md ml-4 text-sm max-w-[20%] ",
                    }}
                    transition="pop-top-left"
                    transitionDuration={80}
                    transitionTimingFunction="ease"
                    onChange={(v) => setSortType(v)}
                    aria-label="Select tools sort"
            />
          </div>
        </div>


      </div>
      <div data-tour="all_other_apps" className="my-2">
        <Grid className="mx-2" >
          { activeApps.map(k => initialApps[k]).map((x: AppRegistrationEntry) => {
              return(
              <Grid.Col key={x.name} xs={12} sm={6} md={4} lg={3} xl={2} style={{ minHeight: 48, maxWidth: 180 }}>
                <AnalysisCard  entry={{...{  applicable: true,  ...x }}} onClick={handleOpenAppClicked} />
              </Grid.Col>
              )
            }
            )}
        </Grid>
      </div>
  </div>
  )
}

interface AnalysisWorkspaceProps {
  readonly app: string | undefined;
}
const AnalysisWorkspace : React.FC<AnalysisWorkspaceProps> = ({ app } : AnalysisWorkspaceProps ) => {
  const [selectedApp, setSelectedApp] = useState(undefined);
  const [selectedAppName, setSelectedAppName] = useState(undefined);

  const handleAppSelected = (id:string, name:string) => {
    setSelectedApp(id);
    setSelectedAppName(name);
  }

  useEffect(() => {
    setSelectedApp(app)
    setSelectedAppName(undefined); // will use the registered app name
  }, [app])

  return (
      <div> { (selectedApp) ?
        <div className="flex flex-col mx-2">
          <div className="flex flex-row items-center">
            <button  onClick={() => setSelectedApp(undefined)} className="bg-nci-gray-lighter hover:bg-nci-gray-light font-montserrat tracking-widest uppercase rounded-md shadow-md p-1 px-2">Applications</button>
            <div className=" mx-3 font-montserrat">/</div>
            <div className="bg-nci-gray-lighter font-montserrat uppercase rounded-md shadow-md p-1 px-2">{selectedAppName ? selectedAppName :  initialApps[selectedApp].name}</div>
          </div>
          <ActiveAnalysisToolNoSSR appId={selectedApp} />
        </div>
        :
        <AnalysisGrid onAppSelected={handleAppSelected} />
      }
      </div>
  )
}

export default AnalysisWorkspace;
