import { useRouter } from "next/router";
import { FC } from "react";
import ClinicalDataAnalysis from "../cDave/ClinicalDataAnalysis";

export interface CDaveAppProps {
  onLoaded?: () => void;
}

const CDaveApp: FC<CDaveAppProps> = ({ onLoaded }: CDaveAppProps) => {
  const {
    query: { demoMode },
  } = useRouter();
  const isDemoMode = demoMode === "true" ? true : false;
  return isDemoMode ? (
    <div>Yet to be build</div>
  ) : (
    <ClinicalDataAnalysis onLoaded={onLoaded} />
  );
};

export default CDaveApp;
