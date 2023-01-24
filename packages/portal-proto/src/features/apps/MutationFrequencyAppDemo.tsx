import React, { FC } from "react";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { GenesAndMutationFrequencyAppId } from "@/features/genomic/registerApp";

const MutationFrequencyAppDemo: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(GenesAndMutationFrequencyAppId),
  ) as React.ElementType;

  return <>{GdcApp && <GdcApp></GdcApp>}</>;
};

export default MutationFrequencyAppDemo;
