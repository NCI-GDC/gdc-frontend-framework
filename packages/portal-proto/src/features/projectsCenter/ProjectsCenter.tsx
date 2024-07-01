import React, { useEffect } from "react";
import { useCoreSelector, selectCurrentCohortId, usePrevious } from "@gff/core";
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

  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));
  const prevId = usePrevious(cohortId);

  useEffect(() => {
    if (cohortId !== prevId) {
      clearAllFilters();
    }
  }, [cohortId, prevId, clearAllFilters]);

  return (
    <>
      <PersistGate persistor={persistor}>
        <div className="flex flex-col m-4">
          <div className="flex flex-row" data-testid="projects-table">
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
