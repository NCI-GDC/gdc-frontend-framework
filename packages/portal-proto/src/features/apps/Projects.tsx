import React, { FC } from "react";
import { ProjectsCenterAppId } from "../projectsCenter/registerApp";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { DemoUtil } from "./DemoUtil";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";

const Projects: FC = () => {
  const isDemoMode = useIsDemoApp();

  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(ProjectsCenterAppId),
  ) as React.ElementType;

  return (
    <>
      {!isDemoMode && GdcApp ? (
        <GdcApp />
      ) : (
        <DemoUtil text="Demo mode is not available for this app" />
      )}
    </>
  );
};

export default Projects;
