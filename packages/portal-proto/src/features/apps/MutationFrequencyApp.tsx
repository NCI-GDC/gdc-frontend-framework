import React, { FC } from "react";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
//import GenesAndMutationFrequencyAnalysisTool from "../genomic/GenesAndMutationFrequencyAnalysisTool";
import { GenesAndMutationFrequencyAppId } from "@/features/genomic/registerApp";

// const MutationFrequencyApp: FC = () => {
//   return <GenesAndMutationFrequencyAnalysisTool />;
// };

const MutationFrequencyApp: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(GenesAndMutationFrequencyAppId),
  ) as React.ElementType;

  return <>{GdcApp && <GdcApp></GdcApp>}</>;
};

export default MutationFrequencyApp;
