import { FC } from "react";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";
import SetOperationsForGenesSSMSCohorts from "../set-operations/SetOperationsForGenesSSMSCohorts";

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
        <SetOperationsDemo />
      ) : (
        <SetOperationsForGenesSSMSCohorts />
      )}
    </>
  );
};

export default SetOperationsApp;
