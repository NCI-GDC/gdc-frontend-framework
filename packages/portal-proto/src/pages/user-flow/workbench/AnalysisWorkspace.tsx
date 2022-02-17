import React, { useState, useEffect } from "react";
import { Button, Chips, Chip, Badge, Grid } from "@mantine/core";
import AnalysisCard from "./AnalysisCard";
const ActiveAnalysisToolNoSSR = dynamic(() => import('./ActiveAnalysisTool'), {
  ssr: false
})

import { COHORTS,  REGISTERED_APPS, APPTAGS } from "./registeredApps"
import { AppRegistrationEntry } from "./utils";
import dynamic from "next/dynamic";

interface AnalysisGridProps {
  readonly onAppSelected?: (x) => void;
}


const AnalysisGrid : React.FC<AnalysisGridProps>  = ( { onAppSelected } : AnalysisGridProps) => {
  const [registeredApps] = useState(REGISTERED_APPS.map((x) => {
    return { selected: false, ...x }
  })); // registered apps.
  // TODO: move app registration to core

  const [appTags] = useState(APPTAGS); // set of tags to classify and App with.
  // TODO: build app registration and tags will be handled here
  const [activeTags, setActiveTags] = useState([]); // set of selected tags
  const [recommendedApps, setRecommendedApps] = useState([]);
  const [remainingApps, setRemainingApps] = useState([...registeredApps]); // recommended apps based on Context
  const [activeApps, setActiveApps] = useState([...registeredApps] ); // set of active apps i.e. not recommended but filterable

  const filterAppsByTags = () => {
    // filter apps based off tags
    const filteredApps = remainingApps.filter(element =>  element.tags.some(tag => activeTags.includes(tag)));
    if (!activeTags.length) // no active tags
     setActiveApps(remainingApps)
    else
      setActiveApps(filteredApps);
  }

  useEffect(() => {
    filterAppsByTags();
  }, [activeTags]);

  const handleOpenAppClicked = (x) => {
    onAppSelected(x);
  }

  return (
    <div className="flex flex-col">
      <div className="mx-4 mt-2 bg-white rounded-md shadow-md">
      <h2 className="ml-6"> Filter Tools</h2>
      <Chips className="p-1" multiple value={activeTags} onChange={setActiveTags}>
        {
          appTags.map((x) => <Chip key={x.value} value={x.value}>{x.name}</Chip>)
        }
      </Chips>
      </div>
      <div  className="m-2 bg-nci-cyan-darker" >
        <Grid className="px-12">
        { recommendedApps.map((x: AppRegistrationEntry) =>
          <Grid.Col key={x.name} span={3} style={{ minHeight: 64 }}>
            <AnalysisCard  {...{  applicable: true, onClick: handleOpenAppClicked, ...x }} />
          </Grid.Col>
        )}
      </Grid>
      </div>

      <div className="my-2">
        <Grid className="mx-2" >
          { activeApps.map((x: AppRegistrationEntry) =>
                <Grid.Col key={x.name} span={3} style={{ minHeight: 80 }}>
                  <AnalysisCard  {...{  applicable: true, onClick: handleOpenAppClicked, ...x }} />
                </Grid.Col>
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
            <button  onClick={() => setSelectedApp(undefined)} className="bg-nci-gray-lighter hover:bg-nci-gray-light font-montserrat tracking-widest uppercase rounded-md shadow-md p-1 px-2">Analysis</button>
            <div className=" mx-3 font-montserrat">/</div>
            <div className="bg-nci-gray-lighter font-montserrat uppercase rounded-md shadow-md p-1 px-2">{selectedApp}</div>
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
