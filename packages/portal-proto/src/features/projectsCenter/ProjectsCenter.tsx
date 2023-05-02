import React from "react";
import ProjectFacetPanel from "./ProjectFacetPanel";
import ProjectsTable from "./ProjectsTable";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { AppStore } from "./appApi";

const persistor = persistStore(AppStore);

export const ProjectsCenter = (): JSX.Element => {
  return (
    <>
      <PersistGate persistor={persistor}>
        <div className="flex flex-col mt-4 ">
          <div className="flex flex-row mx-3" data-testid="projects-table">
            <ProjectFacetPanel />
            <ProjectsTable />
          </div>
        </div>
      </PersistGate>
    </>
  );
};
