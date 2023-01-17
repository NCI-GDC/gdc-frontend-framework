import useIsDemoApp from "@/hooks/useIsDemoApp";
import { useRouter } from "next/router";
import { FC } from "react";
import ClinicalDataAnalysis from "../cDave/ClinicalDataAnalysis";

export interface CDaveAppProps {
  onLoaded?: () => void;
}

const CDaveApp: FC<CDaveAppProps> = ({ onLoaded }: CDaveAppProps) => {
  const isDemoMode = useIsDemoApp();
  return isDemoMode ? (
    <div>Yet to be build</div>
  ) : (
    <ClinicalDataAnalysis onLoaded={onLoaded} />
  );
};

export default CDaveApp;
