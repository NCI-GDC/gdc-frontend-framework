import React, { FC } from "react";
import { RepositoryAppId } from "../repositoryApp/registerApp";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DemoUtil } from "./DemoUtil";

const Downloads: FC = () => {
  const isDemoMode = useIsDemoApp();
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(RepositoryAppId),
  ) as React.ElementType;

  return (
    <>
      {!isDemoMode && GdcApp ? (
        <GdcApp></GdcApp>
      ) : (
        <DemoUtil text="Demo mode is not available for this app" />
      )}
    </>
  );
};

export default Downloads;
