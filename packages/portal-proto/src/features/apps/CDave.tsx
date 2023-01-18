import useIsDemoApp from "@/hooks/useIsDemoApp";
import { FC } from "react";
import ClinicalDataAnalysis from "../cDave/ClinicalDataAnalysis";

export interface CDaveAppProps {
  onLoaded?: () => void;
}

const CDaveApp: FC<CDaveAppProps> = ({ onLoaded }: CDaveAppProps) => {
  const isDemoMode = useIsDemoApp();
  return isDemoMode ? (
    <div>Coming Soon!</div>
  ) : (
    <ClinicalDataAnalysis onLoaded={onLoaded} />
  );
};

export default CDaveApp;
