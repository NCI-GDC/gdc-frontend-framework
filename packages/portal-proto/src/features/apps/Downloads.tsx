import React, { FC } from "react";
import { RepositoryAppId } from "../repositoryApp/RepositoryApp";
import { selectGdcAppById, useCoreSelector } from "@gff/core";

const Downloads: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(RepositoryAppId),
  ) as React.ElementType;

  return <>{GdcApp && <GdcApp></GdcApp>}</>;
};

export default Downloads;
