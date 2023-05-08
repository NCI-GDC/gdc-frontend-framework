import { FC } from "react";
import ClinicalDataAnalysis from "../cDave/ClinicalDataAnalysis";

export interface CDaveAppProps {
  onLoaded?: () => void;
}

const CDaveApp: FC<CDaveAppProps> = ({ onLoaded }: CDaveAppProps) => {
  return <ClinicalDataAnalysis onLoaded={onLoaded} />;
};

export default CDaveApp;
