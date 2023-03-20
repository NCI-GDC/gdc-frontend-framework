import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { FC } from "react";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";
import SelectionPanel from "../set-operations/SelectionPanel";

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return <>{isDemoMode ? <SetOperationsDemo /> : <SelectionPanel />}</>;
};

export default SetOperationsApp;
