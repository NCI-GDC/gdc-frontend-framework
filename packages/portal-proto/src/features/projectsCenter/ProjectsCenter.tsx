import React, { useEffect } from "react";
import { useClearAllProjectFilters } from "./hooks";
import ProjectFacetPanel from "./ProjectFacetPanel";
import ProjectsTable from "./ProjectsTable";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { AppStore } from "./appApi";

const persistor = persistStore(AppStore);

export const ProjectsCenter = (): JSX.Element => {
  const clearAllFilters = useClearAllProjectFilters();
  useEffect(() => {
    return () => clearAllFilters();
  }, [clearAllFilters]);

  return (
    <>
      <PersistGate persistor={persistor}>
        <div className="flex flex-col m-4">
          <div className="flex flex-row" data-testid="table-projects">
            <ProjectFacetPanel />
            <div className="grow overflow-hidden mt-10">
              <ProjectsTable />
            </div>
          </div>
        </div>
      </PersistGate>
    </>
  );
};
