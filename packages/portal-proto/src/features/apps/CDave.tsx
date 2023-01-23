import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { FC } from "react";
import ClinicalDataAnalysis from "../cDave/ClinicalDataAnalysis";
import { DemoUtil } from "./DemoUtil";

export interface CDaveAppProps {
  onLoaded?: () => void;
}

const CDaveApp: FC<CDaveAppProps> = ({ onLoaded }: CDaveAppProps) => {
  const isDemoMode = useIsDemoApp();
  return isDemoMode ? (
    <DemoUtil text="Coming Soon!" />
  ) : (
    <ClinicalDataAnalysis onLoaded={onLoaded} />
  );
};

export default CDaveApp;
