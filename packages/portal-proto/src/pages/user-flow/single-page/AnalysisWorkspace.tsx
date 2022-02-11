import React, { useState, useEffect } from "react";
import { Chips, Chip, Card, Grid, Breadcrumbs } from "@mantine/core";
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
  const [recommendedApps, setRecommendedApps] = useState([]); // recommended apps based on Context
  const [activeApps, setActiveApps] = useState([]); // set of active apps i.e. not recommended but filtered

  const handleTagSelection = (x) => {
    setActiveTags(x);
  }

  const handleOpenAppClicked = (x) => {
    onAppSelected(x);
  }

  return (
    <div className="flex flex-col">
      <Chips multiple value={activeTags} onChange={handleTagSelection}>
        {
          appTags.map((x) => <Chip key={x} value={x}>{x}</Chip>)
        }
      </Chips>

      <div>
        <Grid>
        { recommendedApps.map((x: AppRegistrationEntry) =>
          <Grid.Col key={x.name} span={3} style={{ minHeight: 80 }}>
            <AnalysisCard  {...{  applicable: true, onClick: handleOpenAppClicked, ...x }} />
          </Grid.Col>
        )}
      </Grid>
      </div>

      <div>
        <Grid >
          { registeredApps.map((x: AppRegistrationEntry) =>
                <Grid.Col key={x.name} span={3} style={{ minHeight: 80 }}>
                  <AnalysisCard  {...{  applicable: true, onClick: handleOpenAppClicked, ...x }} />
                </Grid.Col>
            )}
        </Grid>
      </div>
  </div>
  )
}

const AnalysisWorkspace = () => {
  const [selectedApp, setSelectedApp] = useState(undefined);

  return (
      <div> { (selectedApp) ?
        <div className="flex flex-col">
          <Breadcrumbs>
            <h2>Analysis</h2>
          </Breadcrumbs>
          <ActiveAnalysisToolNoSSR appId={selectedApp} />
        </div>
        :
        <AnalysisGrid onAppSelected={setSelectedApp} />
      }
      </div>
  )
}

export default AnalysisWorkspace;
