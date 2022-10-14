import React from "react";
import ProjectFacetPanel from "./ProjectFacetPanel";

const ProjectCenter = () => {
  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row mx-3">
        <ProjectFacetPanel />
      </div>
    </div>
  );
};

export default ProjectCenter;
