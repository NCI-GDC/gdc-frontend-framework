import React from "react";
import ProjectFacetPanel from "./ProjectFacetPanel";
import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/projectsCenter/appApi";

export const ProjectsCenter = () => {
  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row mx-3">
        <ProjectFacetPanel />
      </div>
    </div>
  );
};

export default createGdcAppWithOwnStore({
  App: ProjectsCenter,
  id: id,
  name: "Projects Center",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const ProjectsCenterAppId: string = id;
