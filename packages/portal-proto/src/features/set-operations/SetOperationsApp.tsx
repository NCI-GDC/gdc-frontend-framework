import { FC } from "react";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";
import SetOperationsForGenesSSMSCohorts from "../set-operations/SetOperationsForGenesSSMSCohorts";

/**
 The components in set operations break down to the following:
 SetOperationsDemo: component that sets up the data for the demo
 SetOperationsForGenesSSMSCohorts: component that sets up the data for the genes, ssm, and cohorts
*/

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
