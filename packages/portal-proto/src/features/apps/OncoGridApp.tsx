import React, { FC } from "react";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { OncoGridAppId } from "@/features/oncoGrid/registerApp";
import { useRouter } from "next/router";

const OncoGridApp: FC = () => {
  const {
    query: { demoMode },
  } = useRouter();
  const isDemoMode = demoMode === "true" ? true : false;

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
