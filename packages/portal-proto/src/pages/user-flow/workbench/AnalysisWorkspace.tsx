import React, { useState, useEffect } from "react";
import { Button, Chips, Chip, Select, Grid } from "@mantine/core";
import { MdClear as Clear } from "react-icons/md";
import AnalysisCard from "./AnalysisCard";
import {  REGISTERED_APPS, APPTAGS } from "./registeredApps"
import { AppRegistrationEntry, sortAlphabetically } from "./utils";
import dynamic from "next/dynamic";

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

interface AnalysisGridProps {
  readonly onAppSelected?: (x) => void;
}

const AnalysisGrid : React.FC<AnalysisGridProps>  = ( { onAppSelected } : AnalysisGridProps) => {
  // TODO: move app registration to core
  // create mappable object


  const [appTags] = useState(APPTAGS); // set of tags to classify and App with.
  // TODO: build app registration and tags will be handled here
  const [activeTags, setActiveTags] = useState([]); // set of selected tags
  const [sortType, setSortType] = useState("default");
  const [recommendedApps, setRecommendedApps] = useState([]); // recommended apps based on Context
  const [remainingApps, setRemainingApps] = useState([...initialOrder]); // all other apps
  const [activeApps, setActiveApps] = useState([...initialOrder] ); // set of active apps i.e. not recommended but filterable/dimmable

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

  const handleOpenAppClicked = (x) => {
    onAppSelected(x.id);
  }

  return (
    <div className="flex flex-col">
      <div className="mx-4 mt-2 bg-white rounded-md shadow-md">
      <h2 className="ml-6"> Filter Tools</h2>
        <div className="flex flex-row">
          <Chips className="p-1 w-1/3" multiple noWrap={false} value={activeTags} onChange={setActiveTags}>
            {
              appTags.map((x) => <Chip key={x.value} value={x.value}>{x.name}</Chip>)
            }
          </Chips>
          <div className="flex flex-row items-center ml-8 mb-1.5">
            <button className="bg-nci-gray-lighter h-6 rounded-full hover:bg-nci-gray" onClick={()=>setActiveTags([])}>
              <Clear size="1.5rem" />
            </button>
            <Select data={sortOptions} className="ml-4"
                    label="Sort"
                    placeholder="Applications Sort"
                    transition="pop-top-left"
                    transitionDuration={80}
                    transitionTimingFunction="ease"
                    onChange={(v) => setSortType(v)}
            />
          </div>
        </div>
      </div>
      <div  className="m-2 bg-nci-cyan-darker" >
        <Grid className="px-12">
        { recommendedApps.map((x: AppRegistrationEntry) => {
          return (<Grid.Col key={x.name} span={3} style={{ minHeight: 64 }}>
            <AnalysisCard  {...{  applicable: true, onClick: handleOpenAppClicked, ...x }} />
          </Grid.Col>)
          }
        )}
      </Grid>
      </div>

      <div className="my-2">
        <Grid className="mx-2" >
          { activeApps.map(k => initialApps[k]).map((x: AppRegistrationEntry) => {
              return(
              <Grid.Col key={x.name} span={3} style={{ minHeight: 80 }}>
                <AnalysisCard  {...{ applicable: true, onClick: handleOpenAppClicked, ...x }} />
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

  useEffect(() => {
    setSelectedApp(app)
  }, [app])



  return (
      <div> { (selectedApp) ?
        <div className="flex flex-col mx-2">
          <div className="flex flex-row items-center">
            <button  onClick={() => setSelectedApp(undefined)} className="bg-nci-gray-lighter hover:bg-nci-gray-light font-montserrat tracking-widest uppercase rounded-md shadow-md p-1 px-2">Applications</button>
            <div className=" mx-3 font-montserrat">/</div>
            <div className="bg-nci-gray-lighter font-montserrat uppercase rounded-md shadow-md p-1 px-2">{initialApps[selectedApp].name}</div>
          </div>
          <ActiveAnalysisToolNoSSR appId={selectedApp} />
        </div>
        :
        <AnalysisGrid onAppSelected={setSelectedApp} />
      }
      </div>
  )
}

export default AnalysisWorkspace;
