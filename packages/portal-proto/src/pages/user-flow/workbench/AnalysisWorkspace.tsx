import React, { useState, useEffect } from "react";
import { Button, Chips, Chip, Select, Grid } from "@mantine/core";
import { MdClear as Clear } from "react-icons/md";
import AnalysisCard from "./AnalysisCard";
import {  REGISTERED_APPS, APPTAGS } from "./registeredApps"
import { AppRegistrationEntry, sortAlphabetically } from "./utils";
import dynamic from "next/dynamic";
import { ALL } from "dns";

const ActiveAnalysisToolNoSSR = dynamic(() => import('./ActiveAnalysisTool'), {
  ssr: false
})

const sortOptions = [
  { value: "default", label: "Default"},
  { value: "a-z", label: "Sort: A-Z" },
  { value: "z-a", label: "Sort: Z-A" },
];

const initialApps = REGISTERED_APPS.reduce((obj, item) => (obj[item.id] = item, obj) ,{});
// the default order of the apps
const initialOrder = Object.keys(initialApps);

const RECOMMENDED_APPS = ["CohortBuilder", "Downloads", "MutationFrequencyApp"];

const ALL_OTHER_APPS = Object.keys(initialApps).filter((x) => !RECOMMENDED_APPS.includes(x));
console.log(ALL_OTHER_APPS)

interface AnalysisGridProps {
  readonly onAppSelected?: (id:string, name: string) => void;
}

const AnalysisGrid : React.FC<AnalysisGridProps>  = ( { onAppSelected } : AnalysisGridProps) => {
  // TODO: move app registration to core
  // create mappable object


  const [appTags] = useState(APPTAGS); // set of tags to classify and App with.
  // TODO: build app registration and tags will be handled here
  const [activeTags, setActiveTags] = useState([]); // set of selected tags
  const [sortType, setSortType] = useState("default");
  const [recommendedApps, setRecommendedApps] = useState([...RECOMMENDED_APPS]); // recommended apps based on Context
  const [remainingApps, setRemainingApps] = useState([...ALL_OTHER_APPS]); // all other apps
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
    <div className="flex flex-col">
      <div className="mx-4 mt-2 bg-white rounded-md shadow-md">
      <h2 className="ml-6"> Filter Tools</h2>
        <div className="flex flex-row">
          <Chips className="py-1 pr-0 w-1/3" style={{ paddingRight: 0 }} multiple noWrap={false} value={activeTags} onChange={setActiveTags}>
            {
              appTags.map((x) => <Chip key={x.value} value={x.value}>{x.name}</Chip>)
            }
          </Chips>
          <div className="flex flex-row items-end mb-1.5">
            <button className="bg-nci-gray-lighter h-6 rounded-full hover:bg-nci-gray" onClick={()=>setActiveTags([])}>
              <Clear size="1.5rem" />
            </button>
            <div className="flex flex-row items-center ml-96">
              <p className="font-montserrat mr-2">Sort:</p>
            <Select data={sortOptions}
                    classNames={{
                         input: "border border-nci-gray-lighter round-md"
                    }}
                    placeholder="Applications Sort"
                    transition="pop-top-left"
                    transitionDuration={80}
                    transitionTimingFunction="ease"
                    onChange={(v) => setSortType(v)}
            />
            </div>
          </div>
        </div>
      </div>
      <div  className="mx-4 mt-2 bg-white rounded-md shadow-md" >
        <Grid className="px-12">
        { recommendedApps.map(k => initialApps[k]).map((x: AppRegistrationEntry) => {
          return (<Grid.Col key={x.name} span={3} style={{ minHeight: 64 }}>
            <AnalysisCard  entry={{...{  applicable: true,  ...x }}} onClick={handleOpenAppClicked} />
          </Grid.Col>)
          }
        )}
      </Grid>
      </div>

      <div className="my-2">
        <Grid className="mx-2" >
          { activeApps.map(k => initialApps[k]).map((x: AppRegistrationEntry) => {
              return(
              <Grid.Col key={x.name} span={3} style={{ minHeight: 64 }}>
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
