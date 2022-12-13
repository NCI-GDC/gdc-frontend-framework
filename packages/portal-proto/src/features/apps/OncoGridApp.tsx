import React, { FC } from "react";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { OncoGridAppId } from "@/features/oncoGrid/registerApp";

const OncoGridApp: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(OncoGridAppId),
  ) as React.ElementType;

  return <>{GdcApp && <GdcApp></GdcApp>}</>;
};

export default OncoGridApp;
