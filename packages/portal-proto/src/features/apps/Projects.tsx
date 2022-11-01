import React, { FC } from "react";
import { ProjectsCenterAppId } from "../projectsCenter/ProjectsCenter";
import { selectGdcAppById, useCoreSelector } from "@gff/core";

const Projects: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(ProjectsCenterAppId),
  ) as React.ElementType;

  return <>{GdcApp && <GdcApp></GdcApp>}</>;
};

export default Projects;
