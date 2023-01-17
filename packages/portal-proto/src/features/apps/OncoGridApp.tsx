import React, { FC } from "react";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { OncoGridAppId } from "@/features/oncoGrid/registerApp";
import useIsDemoApp from "@/hooks/useIsDemoApp";

const OncoGridApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(OncoGridAppId),
  ) as React.ElementType;

  return (
    <>
      {!isDemoMode && GdcApp ? <GdcApp></GdcApp> : <div>Yet to be build</div>}
    </>
  );
};

export default OncoGridApp;
